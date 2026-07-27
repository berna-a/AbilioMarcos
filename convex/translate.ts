// Portado de supabase/functions/translate-content/index.ts.
//
// Nota: essa função nunca chegou a ser deployada no Supabase (o frontend
// chamava "translate-content-021", que nunca existiu — confirmado via
// `list_edge_functions` no projeto hwpixsuovwxgilyfoszw: só existe
// "translate-content" no código local, e nenhuma das duas está lá). A
// tradução multilíngue estava morta em produção antes desta migração — isto
// não é uma regressão, é a primeira vez que fica realmente ligada.
//
// Precisa de OPENROUTER_API_KEY nas env vars do Convex (o Bernardo usa
// OpenRouter como agregador único para chamadas de API a LLMs, não contas
// directas por laboratório):
//   npx convex env set OPENROUTER_API_KEY <valor>

import { action } from "./_generated/server";
import { v } from "convex/values";

type Lang = "en" | "fr" | "de" | "es";
const ALL_LANGS: Lang[] = ["en", "fr", "de", "es"];

type Context = "artwork_title" | "artwork_description" | "about_title" | "about_section";

const CONTEXT_GUIDANCE: Record<Context, string> = {
  artwork_title:
    "This is the title of an artwork by Portuguese painter Abílio Marcos. Treat it as a poetic proper-name. Translate the meaning faithfully but keep it concise, evocative and naturally artistic in the target language. Never add quotation marks or commentary.",
  artwork_description:
    "This is the descriptive text for an artwork. Translate naturally and faithfully, preserving tone, paragraph breaks and punctuation.",
  about_title:
    "This is a section heading on the artist's About page (e.g. 'Biografia', 'Exposições individuais'). Translate it as a short, idiomatic section heading.",
  about_section:
    "This is the body text of an About page section. It often contains lists of exhibitions with years, gallery names and city names — keep years and proper names (galleries, cities, people) untranslated. Preserve every line break exactly.",
};

const LANG_NAMES: Record<Lang, string> = { en: "English", fr: "French", de: "German", es: "Spanish" };

async function translateOnce(text: string, ctx: Context, langs: Lang[]): Promise<Partial<Record<Lang, string>>> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured");

  const langList = langs.map((l) => `"${l}" (${LANG_NAMES[l]})`).join(", ");
  const prompt = [
    CONTEXT_GUIDANCE[ctx],
    "",
    `Translate the following Portuguese text into: ${langList}.`,
    "Return ONLY a valid JSON object with the language codes as keys.",
    "Preserve line breaks with \\n. Do not add any explanation.",
    'Example format: {"en": "...", "fr": "...", "de": "...", "es": "..."}',
    "",
    "SOURCE TEXT:",
    text,
  ].join("\n");

  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "anthropic/claude-haiku-4.5",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`OpenRouter API ${resp.status}: ${errText}`);
  }

  const data = await resp.json();
  const rawText: string = data?.choices?.[0]?.message?.content ?? "";
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  const parsed = JSON.parse(jsonMatch[0]);
  const out: Partial<Record<Lang, string>> = {};
  for (const l of langs) {
    if (typeof parsed[l] === "string") out[l] = parsed[l];
  }
  return out;
}

export const translateContent = action({
  args: {
    text: v.string(),
    context: v.union(
      v.literal("artwork_title"),
      v.literal("artwork_description"),
      v.literal("about_title"),
      v.literal("about_section"),
    ),
    targetLangs: v.optional(v.array(v.string())),
  },
  handler: async (_ctx, args): Promise<Partial<Record<Lang, string>>> => {
    const trimmed = args.text.trim();
    if (!trimmed) return {};
    const langs = (args.targetLangs?.filter((l): l is Lang => ALL_LANGS.includes(l as Lang)) ?? ALL_LANGS);
    return translateOnce(trimmed, args.context, langs.length ? langs : ALL_LANGS);
  },
});

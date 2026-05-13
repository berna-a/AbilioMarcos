import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Lang = "en" | "fr" | "de" | "es";
const ALL_LANGS: Lang[] = ["en", "fr", "de", "es"];
const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  fr: "French",
  de: "German",
  es: "Spanish",
};

type Context =
  | "artwork_title"
  | "artwork_description"
  | "about_title"
  | "about_section";

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

function buildPrompt(text: string, ctx: Context, langs: Lang[]): string {
  const langList = langs.map((l) => `"${l}" (${LANG_NAMES[l]})`).join(", ");
  return [
    "You are a professional literary translator specialised in fine art.",
    `The source language is European Portuguese (pt-PT).`,
    CONTEXT_GUIDANCE[ctx],
    "",
    `Translate the text below into the following target languages: ${langList}.`,
    "Preserve line breaks, lists and punctuation exactly. Do not add explanations.",
    "Return the result by calling the provided function once.",
    "",
    "SOURCE TEXT:",
    "<<<",
    text,
    ">>>",
  ].join("\n");
}

async function translateOnce(
  text: string,
  ctx: Context,
  langs: Lang[],
): Promise<Partial<Record<Lang, string>>> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const langList = langs.map((l) => `"${l}" (${LANG_NAMES[l]})`).join(", ");

  const prompt = [
    CONTEXT_GUIDANCE[ctx],
    "",
    `Translate the following Portuguese text into: ${langList}.`,
    "Return ONLY a valid JSON object with the language codes as keys.",
    "Preserve line breaks with \\n. Do not add any explanation.",
    "Example format: {\"en\": \"...\", \"fr\": \"...\", \"de\": \"...\", \"es\": \"...\"}",
    "",
    "SOURCE TEXT:",
    text,
  ].join("\n");

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Anthropic API ${resp.status}: ${errText}`);
  }

  const data = await resp.json();
  const rawText = data?.content?.[0]?.text ?? "";

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  const parsed = JSON.parse(jsonMatch[0]);
  const out: Partial<Record<Lang, string>> = {};
  for (const l of langs) {
    if (typeof parsed[l] === "string") out[l] = parsed[l];
  }
  return out;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const payload = await req.json();
    const text: string = (payload?.text ?? "").toString();
    const context: Context = (payload?.context ?? "artwork_description") as Context;
    const targetLangs: Lang[] = Array.isArray(payload?.targetLangs) && payload.targetLangs.length
      ? payload.targetLangs.filter((l: unknown): l is Lang => ALL_LANGS.includes(l as Lang))
      : ALL_LANGS;

    if (!text.trim()) {
      return new Response(JSON.stringify({ translations: {} }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!CONTEXT_GUIDANCE[context]) {
      return new Response(JSON.stringify({ error: "invalid context" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const translations = await translateOnce(text, context, targetLangs);
    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    const status = msg.includes("429")
      ? 429
      : msg.includes("402")
      ? 402
      : 500;
    console.error("translate-content error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

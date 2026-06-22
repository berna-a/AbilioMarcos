// Build-time sitemap generator. Writes public/sitemap.xml.
// Fetches published artwork slugs from Supabase via REST.
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE = "https://abiliomarcos.com";
// Projeto Supabase do AOS; as obras vivem no schema `cliente_021` (não `public`).
const SUPABASE_URL = "https://hwpixsuovwxgilyfoszw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4zfZ95cWvrhy0nWmqjEzqQ_kKh3jGAa";
const SUPABASE_SCHEMA = "cliente_021";

const STATIC_PATHS = ["/", "/obras", "/sobre", "/contacto"];

async function fetchPublishedSlugs() {
  const url = `${SUPABASE_URL}/rest/v1/artworks?select=slug&status=eq.published`;
  try {
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        // As obras estão num schema dedicado — PostgREST precisa do Accept-Profile.
        "Accept-Profile": SUPABASE_SCHEMA,
      },
    });
    if (!res.ok) {
      console.warn(`[sitemap] Supabase responded ${res.status}; skipping artworks.`);
      return [];
    }
    const rows = await res.json();
    return rows
      .map((r) => r?.slug)
      .filter((s) => typeof s === "string" && s.length > 0);
  } catch (err) {
    console.warn(`[sitemap] Failed to fetch artwork slugs: ${err?.message ?? err}`);
    return [];
  }
}

function escapeXml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  }[c]));
}

function urlEntry(loc, lastmod) {
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const slugs = await fetchPublishedSlugs();

  // Falhar ALTO: um sitemap sem obras é uma regressão de SEO silenciosa (já aconteceu).
  if (slugs.length === 0) {
    console.error("[sitemap] ERRO: 0 obras obtidas do Supabase — a abortar build para não publicar um sitemap vazio.");
    process.exit(1);
  }

  const urls = [
    ...STATIC_PATHS.map((p) => `${SITE}${p}`),
    ...slugs.map((slug) => `${SITE}/obra/${slug}`),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => urlEntry(u, today)).join("\n") +
    `\n</urlset>\n`;

  const outPath = resolve(__dirname, "..", "public", "sitemap.xml");
  writeFileSync(outPath, xml, "utf8");
  console.log(`[sitemap] Wrote ${urls.length} URLs to ${outPath}`);
}

main();

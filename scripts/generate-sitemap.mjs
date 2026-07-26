// Build-time sitemap generator. Writes public/sitemap.xml.
// Fetches published artwork slugs from Convex via HTTP client.
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ConvexHttpClient } from "convex/browser";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE = "https://abiliomarcos.com";
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://deafening-cormorant-584.eu-west-1.convex.cloud";

const STATIC_PATHS = ["/", "/obras", "/sobre", "/contacto"];

async function fetchPublishedSlugs() {
  try {
    const client = new ConvexHttpClient(CONVEX_URL);
    const rows = await client.query("artworks:getPublishedArtworks");
    return (rows || [])
      .map((r) => r?.slug)
      .filter((s) => typeof s === "string" && s.length > 0);
  } catch (err) {
    console.warn(`[sitemap] Failed to fetch artwork slugs from Convex: ${err?.message ?? err}`);
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

  if (slugs.length === 0) {
    console.error("[sitemap] ERRO: 0 obras obtidas da Convex — a abortar build.");
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

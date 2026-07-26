/**
 * Optimização de imagens — poupança de largura de banda.
 *
 * As imagens das obras vivem em Convex Storage (e, para um punhado de casos
 * legados, ainda no Supabase Storage) em alta resolução (1–2 MB cada). Servi-las
 * assim na galeria esgota a quota de banda. Este helper encaminha-as por um
 * redimensionador/CDN gratuito (images.weserv.nl) que:
 *   - redimensiona + converte para WebP (≈ −95% bytes)
 *   - faz cache no edge (a origem é tocada ~1×, não a cada visita)
 *
 * Só afeta URLs públicas reconhecidas (Convex Storage ou Supabase Storage);
 * outras (ou nulas) passam inalteradas. O componente deve manter um fallback
 * para a URL original em caso de falha do proxy.
 */
const OPTIMIZABLE_HOST_RE = /\.supabase\.co\/storage\/|\.convex\.cloud\/api\/storage\//;

function isOptimizable(url: string): boolean {
  return /^https?:\/\//.test(url) && OPTIMIZABLE_HOST_RE.test(url);
}

export function thumbUrl(url?: string | null, width = 1000, quality = 72): string | undefined {
  if (!url) return undefined;
  if (!isOptimizable(url)) return url;
  const noProto = url.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=ssl:${noProto}&w=${width}&q=${quality}&output=webp&we`;
}

/**
 * srcset responsivo (várias larguras) para o mesmo helper weserv — mobile descarrega
 * uma largura adequada ao ecrã em vez da de desktop. Devolve undefined p/ URLs
 * não reconhecidas (o <img> usa só `src`).
 */
export function thumbSrcSet(
  url?: string | null,
  widths: number[] = [400, 600, 800, 1000, 1400],
  quality = 72,
): string | undefined {
  if (!url || !isOptimizable(url)) return undefined;
  return widths.map((w) => `${thumbUrl(url, w, quality)} ${w}w`).join(', ');
}

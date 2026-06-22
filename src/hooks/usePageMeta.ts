import { useEffect } from "react";

const SITE = "https://abiliomarcos.com";

interface PageMetaOptions {
  /** <title> da página (já com sufixo da marca, ex.: "Contacto — Abílio Marcos"). */
  title: string;
  /** meta description própria da página. */
  description: string;
  /** Caminho absoluto (ex.: "/sobre") — usado em canonical + og:url. */
  path: string;
  /** Imagem og opcional; se omitida, mantém a default do index.html. */
  image?: string;
}

/**
 * Define title/description/OpenGraph/Twitter + canonical por página, e restaura
 * os valores originais ao desmontar. Mesmo padrão dinâmico de ArtworkDetail,
 * generalizado para as páginas estáticas (SPA client-side, sem SSR).
 */
export function usePageMeta({ title, description, path, image }: PageMetaOptions) {
  useEffect(() => {
    const head = document.head;
    const url = `${SITE}${path}`;
    const getMeta = (sel: string) => head.querySelector<HTMLMetaElement>(sel);
    const canonical = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    const targets: Array<[string, string]> = [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', description],
      ['meta[property="og:url"]', url],
      ['meta[name="twitter:title"]', title],
      ['meta[name="twitter:description"]', description],
    ];
    if (image) {
      targets.push(['meta[property="og:image"]', image]);
      targets.push(['meta[name="twitter:image"]', image]);
    }

    const originalTitle = document.title;
    const originals = targets.map(
      ([sel]) => [sel, getMeta(sel)?.getAttribute("content") ?? null] as const,
    );
    const originalCanonical = canonical?.getAttribute("href") ?? null;

    document.title = title;
    targets.forEach(([sel, value]) => getMeta(sel)?.setAttribute("content", value));
    canonical?.setAttribute("href", url);

    return () => {
      document.title = originalTitle;
      originals.forEach(([sel, value]) => {
        if (value !== null) getMeta(sel)?.setAttribute("content", value);
      });
      if (originalCanonical !== null) canonical?.setAttribute("href", originalCanonical);
    };
  }, [title, description, path, image]);
}

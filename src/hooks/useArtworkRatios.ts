import { useEffect, useState } from "react";
import type { Artwork } from "@/lib/types";

type ArtworkLike = Pick<Artwork, "id" | "primary_image_url"> &
  Partial<Pick<Artwork, "width_cm" | "height_cm" | "custom_width_cm" | "custom_height_cm">>;

const dbRatio = (a: ArtworkLike): number | null => {
  const w = a.width_cm ?? a.custom_width_cm;
  const h = a.height_cm ?? a.custom_height_cm;
  if (w && h && Number(w) > 0 && Number(h) > 0) return Number(w) / Number(h);
  return null;
};

/**
 * Resolve the TRUE aspect ratio (w/h) for a list of artworks.
 *
 * Source of truth (in order):
 *  1) width_cm / height_cm
 *  2) custom_width_cm / custom_height_cm
 *  3) primary image's intrinsic naturalWidth / naturalHeight (probed lazily)
 *
 * Returns a stable map { [artwork.id]: ratio | null }.
 * `null` means "not yet known" — callers can fall back conservatively.
 */
export function useArtworkRatios(artworks: ArtworkLike[]): Record<string, number | null> {
  const [intrinsic, setIntrinsic] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    const probe = async () => {
      for (const a of artworks) {
        if (!a.primary_image_url) continue;
        if (dbRatio(a) != null) continue;
        if (intrinsic[a.id] != null) continue;
        const url = a.primary_image_url;
        // Probe via Image — does not block React render.
        const img = new Image();
        img.decoding = "async";
        img.loading = "eager";
        img.src = url;
        img.onload = () => {
          if (cancelled) return;
          if (img.naturalWidth && img.naturalHeight) {
            setIntrinsic((prev) =>
              prev[a.id] ? prev : { ...prev, [a.id]: img.naturalWidth / img.naturalHeight }
            );
          }
        };
      }
    };
    probe();
    return () => {
      cancelled = true;
    };
    // We intentionally only re-run when the set of artworks changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artworks.map((a) => a.id).join("|")]);

  const out: Record<string, number | null> = {};
  for (const a of artworks) {
    out[a.id] = dbRatio(a) ?? intrinsic[a.id] ?? null;
  }
  return out;
}

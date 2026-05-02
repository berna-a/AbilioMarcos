import type { Artwork } from "@/lib/types";

/**
 * Compute the clamped display ratio (height / width) for an artwork.
 * - Uses custom_width_cm / custom_height_cm.
 * - Falls back to 1.0 (square) when missing.
 * - Clamped to [0.7, 1.4] so extreme formats don't break column rhythm.
 */
export function getClampedRatio(
  a: Pick<Artwork, "custom_width_cm" | "custom_height_cm">
): number {
  const w = a.custom_width_cm ? Number(a.custom_width_cm) : 0;
  const h = a.custom_height_cm ? Number(a.custom_height_cm) : 0;
  if (!w || !h) return 1;
  const natural = h / w;
  return Math.min(Math.max(natural, 0.7), 1.4);
}

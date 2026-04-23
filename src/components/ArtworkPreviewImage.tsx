import { useState, useMemo } from "react";
import ArtworkHoverZoom from "@/components/ArtworkHoverZoom";
import type { Artwork } from "@/lib/types";

interface ArtworkPreviewImageProps {
  artwork: Pick<Artwork, "title" | "primary_image_url"> & Partial<Pick<Artwork, "width_cm" | "height_cm" | "custom_width_cm" | "custom_height_cm">>;
  /** Enable cursor-following hover zoom (used in grids). */
  hoverZoom?: boolean;
  /** Optional class for the placeholder background when no image. */
  placeholderClassName?: string;
  /** Optional inline style for placeholder (e.g., gradient backgrounds). */
  placeholderStyle?: React.CSSProperties;
}

/**
 * Renders an artwork preview using its TRUE proportions.
 *
 * Source-of-truth resolution:
 *  1) width_cm / height_cm (DB)
 *  2) custom_width_cm / custom_height_cm (legacy)
 *  3) image's intrinsic naturalWidth / naturalHeight (on load)
 *
 * Never crops. Never forces a uniform ratio across cards.
 */
const ArtworkPreviewImage = ({
  artwork,
  hoverZoom = false,
  placeholderClassName = "bg-muted",
  placeholderStyle,
}: ArtworkPreviewImageProps) => {
  const [intrinsicRatio, setIntrinsicRatio] = useState<string | null>(null);

  const dbRatio = useMemo<string | null>(() => {
    const w = artwork.width_cm ?? artwork.custom_width_cm;
    const h = artwork.height_cm ?? artwork.custom_height_cm;
    if (w && h) return `${Number(w)} / ${Number(h)}`;
    return null;
  }, [artwork.width_cm, artwork.height_cm, artwork.custom_width_cm, artwork.custom_height_cm]);

  const ratio = dbRatio ?? intrinsicRatio ?? undefined;

  if (!artwork.primary_image_url) {
    // Placeholder uses a gentle 4/5 only when we truly know nothing about the work.
    return (
      <div
        className={`w-full ${placeholderClassName}`}
        style={{ aspectRatio: ratio ?? "4 / 5", ...placeholderStyle }}
      />
    );
  }

  if (hoverZoom) {
    return (
      <ArtworkHoverZoom
        src={artwork.primary_image_url}
        alt={artwork.title}
        ratio={ratio}
        onNaturalSize={(w, h) => {
          if (!dbRatio && w && h) setIntrinsicRatio(`${w} / ${h}`);
        }}
      />
    );
  }

  return (
    <img
      src={artwork.primary_image_url}
      alt={artwork.title}
      loading="lazy"
      className="w-full h-auto block"
      style={ratio ? { aspectRatio: ratio } : undefined}
      onLoad={(e) => {
        if (dbRatio) return;
        const img = e.currentTarget;
        if (img.naturalWidth && img.naturalHeight) {
          setIntrinsicRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
        }
      }}
    />
  );
};

export default ArtworkPreviewImage;

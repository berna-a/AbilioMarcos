import { useState, useRef, useCallback } from "react";

interface ArtworkHoverZoomProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Optional aspect ratio (e.g. "4 / 5"). When omitted, the container adapts
   * to the image's intrinsic dimensions — true artwork proportions, no crop.
   */
  ratio?: string;
  /** Notified once the underlying image has loaded with its natural pixel size. */
  onNaturalSize?: (width: number, height: number) => void;
}

const ZOOM_LEVEL = 1.5;

/**
 * Cursor-following hover zoom that NEVER crops the work to a forced ratio.
 * The image is rendered with `object-contain` and the container takes the
 * artwork's true proportions (either via the `ratio` prop or its intrinsic size).
 */
const ArtworkHoverZoom = ({ src, alt, className = "", style, ratio, onNaturalSize }: ArtworkHoverZoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }, []);

  const containerStyle: React.CSSProperties = ratio ? { aspectRatio: ratio } : {};

  return (
    <div
      ref={containerRef}
      className="overflow-hidden cursor-pointer w-full"
      style={containerStyle}
      onMouseEnter={() => setZooming(true)}
      onMouseLeave={() => setZooming(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={(e) => {
          const img = e.currentTarget;
          if (onNaturalSize && img.naturalWidth && img.naturalHeight) {
            onNaturalSize(img.naturalWidth, img.naturalHeight);
          }
        }}
        className={`${className} block transition-transform duration-300 ease-out will-change-transform ${
          ratio ? "w-full h-full object-contain" : "w-full h-auto"
        }`}
        style={{
          ...style,
          transform: zooming ? `scale(${ZOOM_LEVEL})` : "scale(1)",
          transformOrigin: origin,
        }}
      />
    </div>
  );
};

export default ArtworkHoverZoom;

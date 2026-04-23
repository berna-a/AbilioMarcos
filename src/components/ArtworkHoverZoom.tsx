import { useState, useRef, useCallback } from "react";

interface ArtworkHoverZoomProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  /** Override aspect ratio explicitly, e.g. "4 / 5" — used to honor real artwork proportions */
  ratio?: string;
}

const ZOOM_LEVEL = 1.5;

const ArtworkHoverZoom = ({ src, alt, className = "", style, ratio }: ArtworkHoverZoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }, []);

  const containerStyle: React.CSSProperties = ratio
    ? { aspectRatio: ratio }
    : {};

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
        className={`${className} transition-transform duration-300 ease-out will-change-transform ${ratio ? "w-full h-full object-cover" : ""}`}
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

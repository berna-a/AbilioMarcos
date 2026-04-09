import { useState, useRef, useCallback } from "react";

interface ArtworkHoverZoomProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

const ZOOM_LEVEL = 1.5;

const ArtworkHoverZoom = ({ src, alt, className = "", style }: ArtworkHoverZoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden cursor-zoom-in"
      onMouseEnter={() => setZooming(true)}
      onMouseLeave={() => setZooming(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className={`${className} transition-transform duration-300 ease-out will-change-transform`}
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

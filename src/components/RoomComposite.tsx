import { thumbUrl } from "@/lib/images";
import { RoomScene } from "@/lib/rooms";

interface Props {
  room: RoomScene;
  artworkSrc: string;
  alt: string;
  widthCm: number;
  heightCm: number;
  /** Resolução do thumbnail da obra sobreposta. */
  artRes?: number;
  className?: string;
}

/**
 * Sobreposição pura: foto da sala + obra colocada à escala real na parede.
 * Reutilizado no palco principal da galeria e nas miniaturas.
 */
const RoomComposite = ({ room, artworkSrc, alt, widthCm, heightCm, artRes = 1000, className }: Props) => {
  const artWidthPct = (widthCm / room.wallWidthCm) * 100;
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <img src={room.src} alt={room.label} className="block w-full h-auto select-none" draggable={false} />
      <img
        src={thumbUrl(artworkSrc, artRes) || artworkSrc}
        alt={alt}
        className="absolute select-none"
        draggable={false}
        style={{
          left: `${room.centerXPct}%`,
          top: `${room.centerYPct}%`,
          width: `${artWidthPct}%`,
          aspectRatio: `${widthCm} / ${heightCm}`,
          transform: "translate(-50%, -50%)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.30), 0 2px 6px rgba(0,0,0,0.20)",
        }}
      />
    </div>
  );
};

export default RoomComposite;

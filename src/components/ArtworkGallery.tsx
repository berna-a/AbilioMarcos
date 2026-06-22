import { useState } from "react";
import ArtworkLightbox from "./ArtworkLightbox";
import RoomComposite from "./RoomComposite";
import { pickScenes } from "@/lib/rooms";
import { thumbUrl, thumbSrcSet } from "@/lib/images";

interface Props {
  primaryImageUrl: string;
  alt: string;
  widthCm: number | null;
  heightCm: number | null;
  /** Semente estável p/ variar os ambientes por obra (ex.: slug). */
  seed: string;
}

/** Quantos ambientes mostrar na galeria de cada obra. */
const MAX_SCENES = 3;

/**
 * Galeria da obra: a peça + a peça em ambientes reais (à escala), no mesmo
 * carrossel com miniaturas. Substitui o antigo botão "Ver na parede".
 * A obra (slide 0) mantém o zoom (lightbox); os ambientes mostram contexto.
 */
const ArtworkGallery = ({ primaryImageUrl, alt, widthCm, heightCm, seed }: Props) => {
  const [active, setActive] = useState(0);
  const [mainImgFailed, setMainImgFailed] = useState(false);

  const hasDimensions = !!(widthCm && heightCm);
  const scenes = hasDimensions && primaryImageUrl ? pickScenes(seed || primaryImageUrl, MAX_SCENES) : [];

  // Proporções naturais da obra
  const isHorizontal = !!(widthCm && heightCm && widthCm > heightCm);
  const naturalRatio = widthCm && heightCm ? `${widthCm} / ${heightCm}` : undefined;

  if (!primaryImageUrl) {
    return (
      <div className="w-full bg-muted mx-auto" style={{ aspectRatio: naturalRatio || "4/5", maxHeight: "min(82vh, 880px)" }} />
    );
  }

  const ArtworkSlide = (
    <ArtworkLightbox src={primaryImageUrl} alt={alt}>
      <div className="w-full flex justify-center">
        <img
          src={thumbUrl(primaryImageUrl, 1400)}
          srcSet={mainImgFailed ? undefined : thumbSrcSet(primaryImageUrl, [600, 900, 1200, 1600])}
          sizes={isHorizontal ? "(max-width: 1024px) 92vw, 58vw" : "(max-width: 1024px) 78vw, 40vw"}
          {...(widthCm && heightCm ? { width: widthCm, height: heightCm } : {})}
          alt={alt}
          className={isHorizontal ? "w-full h-auto object-contain" : "h-auto w-auto max-w-full object-contain"}
          style={isHorizontal
            ? { ...(naturalRatio ? { aspectRatio: naturalRatio } : {}) }
            : { ...(naturalRatio ? { aspectRatio: naturalRatio } : {}), maxHeight: "min(82vh, 880px)" }}
          onError={(e) => { if (!mainImgFailed) setMainImgFailed(true); const img = e.currentTarget; if (img.src !== primaryImageUrl) img.src = primaryImageUrl; }}
        />
      </div>
    </ArtworkLightbox>
  );

  return (
    <div>
      {/* Palco principal */}
      <div className="w-full">
        {active === 0 || scenes.length === 0 ? (
          ArtworkSlide
        ) : (
          <RoomComposite
            room={scenes[active - 1]}
            artworkSrc={primaryImageUrl}
            alt={alt}
            widthCm={widthCm as number}
            heightCm={heightCm as number}
            artRes={1200}
            className="w-full shadow-sm"
          />
        )}
      </div>

      {/* Miniaturas — só quando há ambientes */}
      {scenes.length > 0 && (
        <div className="flex gap-2.5 mt-3">
          {/* Miniatura da obra */}
          <button
            type="button"
            onClick={() => setActive(0)}
            className={`relative h-16 flex-shrink-0 overflow-hidden border transition-colors ${active === 0 ? "border-foreground" : "border-transparent hover:border-foreground/30"}`}
            aria-label={alt}
          >
            <img src={thumbUrl(primaryImageUrl, 200) || primaryImageUrl} alt="" className="h-full w-auto object-cover" />
          </button>

          {/* Miniaturas dos ambientes */}
          {scenes.map((room, i) => (
            <button
              key={room.id}
              type="button"
              onClick={() => setActive(i + 1)}
              className={`relative h-16 w-[7.1rem] flex-shrink-0 overflow-hidden border transition-colors ${active === i + 1 ? "border-foreground" : "border-transparent hover:border-foreground/30"}`}
              aria-label={room.label}
            >
              <RoomComposite
                room={room}
                artworkSrc={primaryImageUrl}
                alt=""
                widthCm={widthCm as number}
                heightCm={heightCm as number}
                artRes={400}
                className="w-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtworkGallery;

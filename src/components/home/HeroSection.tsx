import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n";

const HeroSection = () => {
  const t = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  // O vídeo (5-8 MB) só é MONTADO depois do LCP do poster — senão o `autoPlay`
  // força o download do vídeo durante o carregamento e arruína o LCP em mobile.
  const [showVideo, setShowVideo] = useState(false);

  // Activar o vídeo só quando a página estiver ociosa (após o LCP).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // fica o poster

    const ric = (window as typeof window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const cic = (window as typeof window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
    let id: number;
    const activate = () => setShowVideo(true);
    id = ric ? ric(activate, { timeout: 3000 }) : window.setTimeout(activate, 1800);
    return () => { if (ric && cic) cic(id); else clearTimeout(id); };
  }, []);

  // Quando o vídeo é montado, carregar e tocar.
  useEffect(() => {
    if (!showVideo) return;
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => { setVideoReady(true); v.play().catch(() => {}); };
    if (v.readyState >= 2) onLoaded();
    else v.addEventListener("loadeddata", onLoaded, { once: true });
    return () => v.removeEventListener("loadeddata", onLoaded);
  }, [showVideo]);

  return (
    <section className="relative h-[calc(100vh-64px)] md:h-[calc(100vh-76px)] mt-16 md:mt-[76px] w-full overflow-hidden bg-gallery-charcoal">
      {/* Poster — visível IMEDIATAMENTE (candidato a LCP), por baixo do vídeo. Nunca escondido. */}
      <img
        src="/video/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        {...({ fetchpriority: "high" } as Record<string, string>)}
      />
      {showVideo && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onError={() => {
            /* Falha transitória de autoplay/decode — o poster (camada por baixo) cobre
               o fundo, por isso ignoramos em silêncio para não poluir a consola. */
          }}
        >
          <source src="/video/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/video/hero.mp4" type="video/mp4" />
          <source src="/video/hero.webm" type="video/webm" />
        </video>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--gallery-charcoal) / 0.45) 0%, hsl(var(--gallery-charcoal) / 0.42) 45%, hsl(var(--gallery-charcoal) / 0.65) 100%)",
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          className="text-base md:text-xl lg:text-2xl tracking-[0.2em] uppercase text-white font-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.2 }}
        >
          {t.hero.subtitle}
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-primary-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

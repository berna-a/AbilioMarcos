import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n";
import signatureGif from "@/assets/AbMa_GIF.gif";

const HeroSection = () => {
  const t = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tryPlay = () => {
      if (reduce) return;
      v.play().catch(() => {});
    };

    const onLoaded = () => {
      setVideoReady(true);
      tryPlay();
    };

    if (v.readyState >= 2) {
      onLoaded();
    } else {
      v.addEventListener("loadeddata", onLoaded, { once: true });
    }

    return () => {
      v.removeEventListener("loadeddata", onLoaded);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gallery-charcoal">
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
        poster="/video/hero-poster.jpg"
        aria-hidden="true"
        onError={(e) => {
          // eslint-disable-next-line no-console
          console.warn("Hero video failed to load", e.currentTarget.error);
        }}
      >
        <source src="/video/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/video/hero.mp4" type="video/mp4" />
        <source src="/video/hero.webm" type="video/webm" />
      </video>

      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--gallery-charcoal) / 0.35) 0%, hsl(var(--gallery-charcoal) / 0.25) 40%, hsl(var(--gallery-charcoal) / 0.55) 100%)",
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          className="text-[10px] md:text-[10px] tracking-[0.4em] uppercase text-primary-foreground/70 mb-8 md:mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.2 }}
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)]"
        >
          <img
            src={signatureGif}
            alt="Abílio Marcos"
            className="block w-[min(72vw,1280px)] h-[160px] md:h-[320px] lg:h-[400px] object-contain mix-blend-screen"
            draggable={false}
          />
        </motion.div>
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

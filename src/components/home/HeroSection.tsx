import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n";

const HeroSection = () => {
  const t = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onRm = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    rm.addEventListener("change", onRm);
    return () => {
      mq.removeEventListener("change", onChange);
      rm.removeEventListener("change", onRm);
    };
  }, []);

  // iOS Safari sometimes needs an explicit play() call after mount
  useEffect(() => {
    if (reducedMotion) return;
    const v = videoRef.current;
    if (v) {
      const tryPlay = () => v.play().catch(() => { /* autoplay blocked — poster will show */ });
      if (v.readyState >= 2) tryPlay();
      else v.addEventListener("loadeddata", tryPlay, { once: true });
    }
  }, [reducedMotion]);

  const desktopSrc = "/video/hero.mp4";
  const mobileSrc = "/video/hero-mobile.mp4";
  const webmSrc = "/video/hero.webm";
  const poster = "/video/hero-poster.jpg";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gallery-charcoal">
      {/* Background video — respects reduced motion */}
      {!reducedMotion && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          aria-hidden="true"
        >
          {/* Mobile gets the lighter MP4 first */}
          {isMobile && <source src={mobileSrc} type="video/mp4" />}
          <source src={webmSrc} type="video/webm" />
          <source src={desktopSrc} type="video/mp4" />
        </video>
      )}

      {/* Tonal overlay so foreground text remains legible against any frame */}
      <div className="absolute inset-0 bg-gallery-charcoal/55" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-50 mix-blend-multiply"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, hsl(25 30% 22%) 0%, transparent 70%), radial-gradient(ellipse at 70% 40%, hsl(35 20% 18%) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-primary-foreground/60 mb-8 md:mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.2 }}
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.h1
          className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-primary-foreground font-light tracking-[0.02em] leading-[0.9]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Abílio Marcos
        </motion.h1>

        <motion.div
          className="w-12 md:w-16 h-px bg-primary-foreground/30 mt-8 md:mt-10 mb-8 md:mb-10"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        />

        <motion.p
          className="max-w-md md:max-w-lg text-sm md:text-base text-primary-foreground/75 font-serif italic leading-[1.8] tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1.2 }}
        >
          {t.hero.statement}
        </motion.p>

        <motion.div
          className="mt-10 md:mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ delay: 1.6, duration: 1.2 }}
        >
          <svg viewBox="0 0 200 50" className="w-28 md:w-36" fill="none">
            <path
              d="M15 35 Q30 10 50 28 Q65 42 80 22 Q95 5 110 30 Q120 42 140 20 Q155 5 175 32"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
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
          <ChevronDown size={16} className="text-primary-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n";

const HeroSection = () => {
  const t = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Always mount the <video>. We honour `prefers-reduced-motion` by pausing
  // playback rather than removing the element (so the poster still shows).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tryPlay = () => {
      if (reduce) return;
      v.play().catch(() => {
        // Autoplay can be blocked (rare for muted+playsInline). Poster will show.
      });
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
      {/* Background video */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        loop
        muted
        playsInline
        // `auto` is required by some browsers (and Lovable's preview) to actually
        // download enough data to begin autoplay. `metadata` was preventing playback.
        preload="auto"
        poster="/video/hero-poster.jpg"
        aria-hidden="true"
        onError={(e) => {
          // eslint-disable-next-line no-console
          console.warn("Hero video failed to load", e.currentTarget.error);
        }}
      >
        {/*
          Order matters:
          1) Mobile MP4 (only used by browsers that match the media query)
          2) Desktop MP4 (universal — Safari, Chrome, Edge, Firefox)
          3) WebM as a smaller fallback for browsers that prefer it
          MP4 must come BEFORE WebM, otherwise Safari picks WebM and silently fails.
        */}
        <source src="/video/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/video/hero.mp4" type="video/mp4" />
        <source src="/video/hero.webm" type="video/webm" />
      </video>

      {/* Tonal overlay — kept light so the video remains clearly visible */}
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
          className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-primary-foreground/70 mb-8 md:mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.2 }}
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.h1
          className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-primary-foreground font-light tracking-[0.02em] leading-[0.9] drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Abílio Marcos
        </motion.h1>

        <motion.div
          className="w-12 md:w-16 h-px bg-primary-foreground/40 mt-8 md:mt-10"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        />
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

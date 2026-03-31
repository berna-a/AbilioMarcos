import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Placeholder background — will be replaced with masterwork image */}
      <div className="absolute inset-0 bg-gallery-charcoal">
        {/* Layered texture to avoid flat color block feel */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, hsl(25 30% 22%) 0%, transparent 70%), radial-gradient(ellipse at 70% 40%, hsl(35 20% 18%) 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-0 bg-foreground/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* Subtitle */}
        <motion.p
          className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-primary-foreground/50 mb-8 md:mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.2 }}
        >
          Contemporary Abstract Painting
        </motion.p>

        {/* Artist name — large, confident, memorable */}
        <motion.h1
          className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-primary-foreground font-light tracking-[0.02em] leading-[0.9]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Abílio Marcos
        </motion.h1>

        {/* Thin rule as a visual separator */}
        <motion.div
          className="w-12 md:w-16 h-px bg-primary-foreground/25 mt-8 md:mt-10 mb-8 md:mb-10"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        />

        {/* Statement — readable, poetic, grounded */}
        <motion.p
          className="max-w-md md:max-w-lg text-sm md:text-base text-primary-foreground/65 font-serif italic leading-[1.8] tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1.2 }}
        >
          Each gesture carries the weight of intention — color as emotion,
          texture as memory, the canvas as a space where thought and instinct
          converge.
        </motion.p>

        {/* Signature */}
        <motion.div
          className="mt-10 md:mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
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

      {/* Scroll cue — minimal */}
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
          <ChevronDown size={16} className="text-primary-foreground/30" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

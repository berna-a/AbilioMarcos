import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Placeholder hero images — will be replaced with real masterwork images.
 * Using CSS gradient backgrounds as placeholders for now.
 */
const placeholderWorks = [
  {
    id: "1",
    title: "Untitled Composition I",
    gradient: "linear-gradient(135deg, hsl(30 40% 30%), hsl(35 50% 50%), hsl(25 30% 20%))",
  },
];

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background artwork — full bleed */}
      <div
        className="absolute inset-0"
        style={{ background: placeholderWorks[0].gradient }}
      >
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-foreground/30" />
      </div>

      {/* Centered editorial typography */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          className="text-xs tracking-[0.3em] uppercase text-primary-foreground/70 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Contemporary Abstract Art
        </motion.p>

        <motion.h1
          className="font-serif text-4xl md:text-6xl lg:text-7xl text-primary-foreground font-light tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Abílio Marcos
        </motion.h1>

        <motion.p
          className="mt-6 max-w-lg text-sm md:text-base text-primary-foreground/80 font-light leading-relaxed italic font-serif"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          "Each gesture carries the weight of intention — color as emotion, texture as memory, 
          the canvas as a space where thought and instinct converge."
        </motion.p>

        {/* Artist signature placeholder */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <svg viewBox="0 0 200 50" className="w-32 md:w-40" fill="none">
            <path
              d="M15 35 Q30 10 50 28 Q65 42 80 22 Q95 5 110 30 Q120 42 140 20 Q155 5 175 32"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </motion.div>
      </div>

      {/* Scroll prompt */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={18} className="text-primary-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState<"signature" | "fading">("signature");

  useEffect(() => {
    // Check reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      onComplete();
      return;
    }

    // Auto-complete after 2.5s
    const timer = setTimeout(() => {
      setPhase("fading");
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const skip = useCallback(() => {
    setPhase("fading");
    setTimeout(onComplete, 300);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "fading" ? (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center cursor-pointer"
          onClick={skip}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* SVG signature animation — simplified elegant signature path */}
          <motion.svg
            viewBox="0 0 400 120"
            className="w-64 md:w-80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M30 80 Q50 20 80 60 Q100 90 120 50 Q140 10 160 60 Q175 90 195 40 Q210 10 230 70 Q245 100 270 45 Q290 10 310 65 Q325 90 350 50 Q365 25 380 60"
              stroke="hsl(var(--foreground))"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.svg>

          <motion.p
            className="absolute bottom-12 text-xs tracking-[0.2em] uppercase text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Click to enter
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default IntroAnimation;
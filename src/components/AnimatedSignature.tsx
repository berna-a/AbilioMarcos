import { motion } from "framer-motion";
import signatureUrl from "@/assets/signature.svg";

type AnimatedSignatureProps = {
  className?: string;
  /** Duration (s) of the writing animation. */
  duration?: number;
  /** Delay (s) before the writing begins. */
  delay?: number;
};

/**
 * Renders the artist's signature SVG as a white mask and reveals it
 * left-to-right to evoke the gesture of being written.
 *
 * The animation runs once and rests on the final frame (the full
 * signature visible) — Framer Motion does not loop by default and we
 * do not pass `repeat`, so the end state is preserved.
 */
const AnimatedSignature = ({
  className = "",
  duration = 2.4,
  delay = 0.3,
}: AnimatedSignatureProps) => {
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: `url(${signatureUrl})`,
    maskImage: `url(${signatureUrl})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    backgroundColor: "white",
  };

  return (
    <div
      aria-label="Abílio Marcos"
      role="img"
      className={`relative overflow-hidden ${className}`.trim()}
    >
      <motion.div
        className="absolute inset-0"
        style={maskStyle}
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}
      />
    </div>
  );
};

export default AnimatedSignature;

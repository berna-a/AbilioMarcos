import abmaSignature from "@/assets/AbMa_signature.png";

type AnimatedSignatureProps = {
  className?: string;
};

/**
 * Renders the artist's animated signature.
 *
 * The asset (`AbMa_signature.png`) is an APNG generated from the original
 * `AbMa_GIF.gif` with **real alpha transparency**:
 *   - The black ink was remapped to opaque white pixels.
 *   - The white background was remapped to fully transparent pixels.
 *   - The animation is authored with `loop: 1` so it plays once and rests
 *     on the final frame (the completed signature stays visible).
 *
 * Because the asset already has true transparency, no CSS/SVG hacks
 * (mix-blend-mode, invert(), feColorMatrix, masks) are needed — we just
 * render it as a normal <img>.
 */
const AnimatedSignature = ({ className = "" }: AnimatedSignatureProps) => {
  return (
    <img
      src={abmaSignature}
      alt="Abílio Marcos"
      className={`object-contain ${className}`.trim()}
      draggable={false}
    />
  );
};

export default AnimatedSignature;

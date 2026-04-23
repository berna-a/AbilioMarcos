import abmaGif from "@/assets/AbMa_GIF.gif";

type AnimatedSignatureProps = {
  className?: string;
};

/**
 * Renders the artist's signature using the same animated GIF asset
 * shown on the admin login page (`AbMa_GIF.gif`), recolored to white
 * via CSS filters so it remains legible over the dark hero video.
 *
 * The GIF has a white/opaque background, so a CSS mask approach would
 * just show a solid rectangle. Instead we use `invert(1)` to flip the
 * black ink to white and `mix-blend-mode: screen` so the (now black)
 * background drops out against the dark video underneath, leaving only
 * the white signature visible.
 *
 * The animation is baked into the GIF itself: it plays automatically
 * on load and rests on the final frame (the GIF is authored without
 * looping, so the signature stays visible once written).
 */
const AnimatedSignature = ({ className = "" }: AnimatedSignatureProps) => {
  return (
    <img
      src={abmaGif}
      alt="Abílio Marcos"
      className={`object-contain ${className}`.trim()}
      style={{
        filter: "invert(1)",
        mixBlendMode: "screen",
      }}
    />
  );
};

export default AnimatedSignature;

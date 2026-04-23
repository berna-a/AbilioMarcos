import abmaGif from "@/assets/AbMa_GIF.gif";

type AnimatedSignatureProps = {
  className?: string;
};

/**
 * Renders the artist's signature using the same animated GIF asset
 * shown on the admin login page (`AbMa_GIF.gif`), recolored to white
 * via a CSS mask so it remains legible over the dark hero video.
 *
 * The animation is baked into the GIF itself: it plays automatically
 * on load and rests on the final frame (the GIF is authored without
 * looping, so the signature stays visible once written).
 */
const AnimatedSignature = ({ className = "" }: AnimatedSignatureProps) => {
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: `url(${abmaGif})`,
    maskImage: `url(${abmaGif})`,
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
      className={className}
      style={maskStyle}
    />
  );
};

export default AnimatedSignature;

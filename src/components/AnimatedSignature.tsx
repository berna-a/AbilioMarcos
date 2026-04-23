import abmaGif from "@/assets/AbMa_GIF.gif";

type AnimatedSignatureProps = {
  className?: string;
};

/**
 * Renders the artist's signature using the same animated GIF asset
 * shown on the admin login page (`AbMa_GIF.gif`), recolored to white
 * with a fully transparent background.
 *
 * The GIF ships with a solid white background and black ink. We use an
 * inline SVG filter to:
 *   1. Invert the colors (black ink becomes white, white bg becomes black).
 *   2. Map luminance to the alpha channel via `feColorMatrix` so the
 *      now-black background becomes fully transparent while the white
 *      ink stays opaque.
 *
 * The animation is baked into the GIF itself: it plays automatically on
 * load and rests on the final frame (the GIF is authored without
 * looping, so the signature stays visible once written).
 */
const AnimatedSignature = ({ className = "" }: AnimatedSignatureProps) => {
  return (
    <>
      {/* SVG filter definition — rendered once, applied via CSS `filter: url(#...)`. */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="signature-white-on-transparent" colorInterpolationFilters="sRGB">
            {/* Step 1: invert RGB so ink (black) -> white, bg (white) -> black. */}
            <feColorMatrix
              type="matrix"
              values="-1 0 0 0 1
                       0 -1 0 0 1
                       0 0 -1 0 1
                       0 0 0 1 0"
            />
            {/* Step 2: use luminance as alpha — black bg becomes transparent. */}
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      1 1 1 0 0"
            />
          </filter>
        </defs>
      </svg>

      <img
        src={abmaGif}
        alt="Abílio Marcos"
        className={`object-contain ${className}`.trim()}
        style={{ filter: "url(#signature-white-on-transparent)" }}
      />
    </>
  );
};

export default AnimatedSignature;

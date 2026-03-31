import signatureUrl from "@/assets/signature.svg";

type SignatureLogoProps = {
  className?: string;
};

const signatureMaskStyle = {
  WebkitMaskImage: `url(${signatureUrl})`,
  maskImage: `url(${signatureUrl})`,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
};

const SignatureLogo = ({ className = "" }: SignatureLogoProps) => {
  return (
    <span
      aria-hidden="true"
      className={`block bg-current ${className}`.trim()}
      style={signatureMaskStyle}
    />
  );
};

export default SignatureLogo;
import logoUrl from "@/assets/abilio-marcos-logo.png";

type SignatureLogoProps = {
  className?: string;
};

const SignatureLogo = ({ className = "" }: SignatureLogoProps) => {
  return (
    <img
      src={logoUrl}
      alt="Abílio Marcos — Artista Plástico"
      className={`object-contain ${className}`.trim()}
      draggable={false}
    />
  );
};

export default SignatureLogo;

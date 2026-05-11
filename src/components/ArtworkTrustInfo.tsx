import { useT } from "@/i18n";
import { ShieldCheck } from "lucide-react";

const ArtworkTrustInfo = () => {
  const t = useT();

  return (
    <div className="space-y-3 pt-6 border-t border-border">
      <p className="text-[13px] tracking-[0.15em] uppercase text-foreground inline-flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
        {t.trust.certificate}
      </p>
      <p className="text-[13px] tracking-[0.05em] text-foreground">{t.trust.shipping}</p>
      <p className="text-[13px] tracking-[0.05em] text-foreground">{t.trust.delivery}</p>
    </div>
  );
};

export default ArtworkTrustInfo;

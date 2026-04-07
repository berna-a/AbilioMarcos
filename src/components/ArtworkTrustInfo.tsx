import { useT } from "@/i18n";

const ArtworkTrustInfo = () => {
  const t = useT();

  return (
    <div className="space-y-3 pt-6 border-t border-border">
      <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">{t.trust.certificate}</p>
      <p className="text-[11px] tracking-[0.05em] text-muted-foreground">{t.trust.shipping}</p>
      <p className="text-[11px] tracking-[0.05em] text-muted-foreground">{t.trust.delivery}</p>
    </div>
  );
};

export default ArtworkTrustInfo;

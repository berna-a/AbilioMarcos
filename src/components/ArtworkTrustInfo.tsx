import { Artwork } from '@/lib/types';

interface Props {
  artwork: Artwork;
}

const ArtworkTrustInfo = ({ artwork }: Props) => {
  const { shipping_time, shipping_notes, certificate_included, returns_policy_short } = artwork;

  const hasInfo = shipping_time || shipping_notes || certificate_included || returns_policy_short;
  if (!hasInfo) return null;

  return (
    <div className="space-y-3 pt-6 border-t border-border">
      {certificate_included && (
        <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
          Certificate of Authenticity included
        </p>
      )}
      {shipping_time && (
        <p className="text-[11px] tracking-[0.05em] text-muted-foreground">
          Shipping: {shipping_time}
        </p>
      )}
      {shipping_notes && (
        <p className="text-[11px] tracking-[0.05em] text-muted-foreground">
          {shipping_notes}
        </p>
      )}
      {returns_policy_short && (
        <p className="text-[11px] tracking-[0.05em] text-muted-foreground">
          {returns_policy_short}
        </p>
      )}
    </div>
  );
};

export default ArtworkTrustInfo;

import { Artwork, getSalesMode, formatPrice } from '@/lib/types';
import { createCheckoutSession } from '@/lib/checkout';
import { useState } from 'react';
import { useT } from '@/i18n';
import { trackArtwork, trackMetaInitiateCheckout } from '@/lib/analytics';

interface Props {
  artwork: Artwork;
  onInquiryClick: () => void;
}

const ArtworkCommerceCTA = ({ artwork, onInquiryClick }: Props) => {
  const { availability, price } = artwork;
  const salesMode = getSalesMode(price);
  const displayPrice = formatPrice(price);
  const [checkingOut, setCheckingOut] = useState(false);
  const t = useT();

  const handleAcquire = async () => {
    setCheckingOut(true);
    trackArtwork('acquire_online_clicked', artwork);
    trackMetaInitiateCheckout(artwork.price ?? undefined);
    const url = await createCheckoutSession(artwork.id);
    if (url) {
      trackArtwork('checkout_started', artwork);
      window.location.href = url;
    } else {
      alert('Unable to start checkout. Please try again.');
      setCheckingOut(false);
    }
  };

  // Shared button styles — filled (primary action) and outlined (secondary)
  const filledBtn = "inline-flex w-full items-center justify-center bg-brand-red text-primary-foreground px-6 py-3.5 text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-brand-red-soft transition-colors duration-300 disabled:opacity-50";
  const outlineBtn = "inline-flex w-full items-center justify-center border border-foreground/40 text-foreground px-6 py-3.5 text-[11px] tracking-[0.22em] uppercase hover:bg-foreground hover:text-primary-foreground transition-colors duration-300";
  const ghostBtn = "inline-flex w-full items-center justify-center text-[11px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 py-2";

  if (availability === 'sold') {
    return (
      <nav className="space-y-3 mt-auto mb-10" aria-label="Artwork actions">
        <span className="block text-center text-[11px] tracking-[0.22em] uppercase text-status-sold font-medium py-3.5 border border-status-sold/30 bg-status-sold/5">{t.commerce.sold}</span>
        <button onClick={onInquiryClick} className={outlineBtn}>{t.commerce.inquireSimilar}</button>
      </nav>
    );
  }

  if (availability === 'not_for_sale') {
    return (
      <nav className="space-y-3 mt-auto mb-10" aria-label="Artwork actions">
        <button onClick={onInquiryClick} className={outlineBtn}>{t.commerce.inquire}</button>
      </nav>
    );
  }

  if (salesMode === 'direct_purchase') {
    return (
      <nav className="space-y-3 mt-auto mb-10" aria-label="Artwork actions">
        {displayPrice && <p className="text-base tracking-wide text-foreground font-medium mb-2">{displayPrice}</p>}
        <button onClick={handleAcquire} disabled={checkingOut} className={filledBtn}>
          {checkingOut ? t.commerce.preparing : t.commerce.acquireOnline}
        </button>
        <button onClick={onInquiryClick} className={ghostBtn}>{t.commerce.askQuestion}</button>
      </nav>
    );
  }

  if (salesMode === 'hybrid') {
    return (
      <nav className="space-y-3 mt-auto mb-10" aria-label="Artwork actions">
        {displayPrice && <p className="text-base tracking-wide text-foreground font-medium mb-2">{displayPrice}</p>}
        <button onClick={handleAcquire} disabled={checkingOut} className={filledBtn}>
          {checkingOut ? t.commerce.preparing : t.commerce.acquireOnline}
        </button>
        <button onClick={onInquiryClick} className={outlineBtn}>{t.commerce.inquireAbout}</button>
      </nav>
    );
  }

  return (
    <nav className="space-y-3 mt-auto mb-10" aria-label="Artwork actions">
      <button onClick={onInquiryClick} className={filledBtn}>{t.commerce.inquireAbout}</button>
    </nav>
  );
};

export default ArtworkCommerceCTA;

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

  if (availability === 'sold') {
    return (
      <nav className="space-y-6 mt-auto mb-10" aria-label="Artwork actions">
        <span className="block text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{t.commerce.sold}</span>
        <button onClick={onInquiryClick} className="block text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500">{t.commerce.inquireSimilar}</button>
      </nav>
    );
  }

  if (availability === 'not_for_sale') {
    return (
      <nav className="space-y-6 mt-auto mb-10" aria-label="Artwork actions">
        <button onClick={onInquiryClick} className="block text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500">{t.commerce.inquire}</button>
      </nav>
    );
  }

  if (salesMode === 'direct_purchase') {
    return (
      <nav className="space-y-6 mt-auto mb-10" aria-label="Artwork actions">
        {displayPrice && <p className="text-sm tracking-wide text-foreground">{displayPrice}</p>}
        <button onClick={handleAcquire} disabled={checkingOut} className="block text-[11px] tracking-[0.2em] uppercase text-foreground hover:text-foreground/60 transition-colors duration-500 disabled:opacity-50">
          {checkingOut ? t.commerce.preparing : t.commerce.acquireOnline}
        </button>
        <button onClick={onInquiryClick} className="block text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500">{t.commerce.askQuestion}</button>
      </nav>
    );
  }

  if (salesMode === 'hybrid') {
    return (
      <nav className="space-y-6 mt-auto mb-10" aria-label="Artwork actions">
        {displayPrice && <p className="text-sm tracking-wide text-foreground">{displayPrice}</p>}
        <button onClick={handleAcquire} disabled={checkingOut} className="block text-[11px] tracking-[0.2em] uppercase text-foreground hover:text-foreground/60 transition-colors duration-500 disabled:opacity-50">
          {checkingOut ? t.commerce.preparing : t.commerce.acquireOnline}
        </button>
        <button onClick={onInquiryClick} className="block text-[11px] tracking-[0.2em] uppercase text-foreground hover:text-foreground/60 transition-colors duration-500">{t.commerce.inquireAbout}</button>
      </nav>
    );
  }

  return (
    <nav className="space-y-6 mt-auto mb-10" aria-label="Artwork actions">
      <button onClick={onInquiryClick} className="block text-[11px] tracking-[0.2em] uppercase text-foreground hover:text-foreground/60 transition-colors duration-500">{t.commerce.inquireAbout}</button>
    </nav>
  );
};

export default ArtworkCommerceCTA;

import { Artwork } from '@/lib/types';

interface Props {
  artwork: Artwork;
  onInquiryClick: () => void;
}

const ArtworkCommerceCTA = ({ artwork, onInquiryClick }: Props) => {
  const { sales_mode, availability, purchase_url } = artwork;

  if (availability === 'sold') {
    return (
      <nav className="space-y-6 mt-auto mb-10" aria-label="Artwork actions">
        <span className="block text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
          This work has been sold
        </span>
        <button
          onClick={onInquiryClick}
          className="block text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500"
        >
          Inquire About Similar Works
        </button>
      </nav>
    );
  }

  if (availability === 'not_for_sale') {
    return (
      <nav className="space-y-6 mt-auto mb-10" aria-label="Artwork actions">
        <button
          onClick={onInquiryClick}
          className="block text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500"
        >
          Inquire
        </button>
      </nav>
    );
  }

  // Available works — respond to sales_mode
  if (sales_mode === 'direct_purchase') {
    return (
      <nav className="space-y-6 mt-auto mb-10" aria-label="Artwork actions">
        {purchase_url && (
          <a
            href={purchase_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[11px] tracking-[0.2em] uppercase text-foreground hover:text-foreground/60 transition-colors duration-500"
          >
            Acquire Online
          </a>
        )}
        <button
          onClick={onInquiryClick}
          className="block text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500"
        >
          Ask a Question
        </button>
      </nav>
    );
  }

  if (sales_mode === 'hybrid') {
    return (
      <nav className="space-y-6 mt-auto mb-10" aria-label="Artwork actions">
        {purchase_url && (
          <a
            href={purchase_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[11px] tracking-[0.2em] uppercase text-foreground hover:text-foreground/60 transition-colors duration-500"
          >
            Acquire Online
          </a>
        )}
        <button
          onClick={onInquiryClick}
          className="block text-[11px] tracking-[0.2em] uppercase text-foreground hover:text-foreground/60 transition-colors duration-500"
        >
          Inquire About This Work
        </button>
      </nav>
    );
  }

  // inquiry_only (default)
  return (
    <nav className="space-y-6 mt-auto mb-10" aria-label="Artwork actions">
      <button
        onClick={onInquiryClick}
        className="block text-[11px] tracking-[0.2em] uppercase text-foreground hover:text-foreground/60 transition-colors duration-500"
      >
        Inquire About This Work
      </button>
    </nav>
  );
};

export default ArtworkCommerceCTA;

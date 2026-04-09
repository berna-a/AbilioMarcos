import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getArtworkBySlug, getRelatedArtworks } from "@/lib/artworks";
import { Artwork, getDimensions, formatPrice, getSalesMode, MEDIUM_DISPLAY } from "@/lib/types";
import InquiryModal from "@/components/InquiryModal";
import ArtworkTrustInfo from "@/components/ArtworkTrustInfo";
import ArtworkCommerceCTA from "@/components/ArtworkCommerceCTA";
import ArtworkLightbox from "@/components/ArtworkLightbox";
import { useT } from "@/i18n";
import { trackArtwork } from "@/lib/analytics";

const ArtworkDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [related, setRelated] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const t = useT();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getArtworkBySlug(slug).then((data) => {
      if (!data) { setNotFound(true); setLoading(false); return; }
      setArtwork(data);
      setLoading(false);
      trackArtwork('artwork_view', data);
      getRelatedArtworks(data.id).then(setRelated);
    });
  }, [slug]);

  if (loading) {
    return <Layout><div className="pt-40 pb-40 text-center"><p className="text-[13px] text-muted-foreground">{t.artwork.loading}</p></div></Layout>;
  }

  if (notFound || !artwork) {
    return (
      <Layout>
        <div className="pt-40 pb-40 text-center">
          <p className="text-muted-foreground mb-4">{t.artwork.notFound}</p>
          <Link to="/works" className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">{t.artwork.backToWorks}</Link>
        </div>
      </Layout>
    );
  }

  const statusDisplay: Record<string, { label: string; className: string }> = {
    available: { label: t.artwork.available, className: "text-foreground" },
    sold: { label: t.artwork.soldStatus, className: "text-muted-foreground" },
    not_for_sale: { label: "", className: "" },
  };

  const status = statusDisplay[artwork.availability] || statusDisplay.available;
  const additionalImages = artwork.additional_images || [];
  const dimensions = getDimensions(artwork);
  const salesMode = getSalesMode(artwork.price);
  const displayPrice = formatPrice(artwork.price);

  return (
    <Layout>
      <div className="pt-28 md:pt-40 pb-24 md:pb-40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mb-14 md:mb-24">
            <Link to="/works" className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500">
              <ArrowLeft className="w-3 h-3" /> {t.artwork.backToArchive}
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 mb-32 md:mb-48">
            <motion.div className="lg:col-span-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              {artwork.primary_image_url ? (
                <ArtworkLightbox src={artwork.primary_image_url} alt={artwork.title}>
                  <img src={artwork.primary_image_url} alt={artwork.title} className="w-full" />
                </ArtworkLightbox>
              ) : (
                <div className="w-full aspect-[4/5] md:aspect-[3/4] bg-muted" />
              )}
            </motion.div>

            <motion.div className="lg:col-span-5 flex flex-col lg:py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.15 }}>
              <h1 className="font-serif text-[3rem] md:text-[3.5rem] lg:text-[3.75rem] font-light text-foreground leading-[1.02] mb-2">{artwork.title}</h1>
              <p className="font-serif text-xl md:text-2xl text-muted-foreground italic mb-14 lg:mb-16">{artwork.year}</p>

              <div className="space-y-6 mb-14 lg:mb-16">
                <MetadataLine label={t.artwork.medium} value={MEDIUM_DISPLAY} />
                {dimensions && <MetadataLine label={t.artwork.dimensions} value={dimensions} />}
                {status.label && <MetadataLine label={t.artwork.status} value={status.label} valueClassName={status.className} />}
                {displayPrice && salesMode !== 'inquiry_only' && (
                  <MetadataLine label={t.artwork.price} value={displayPrice} />
                )}
              </div>

              <div className="h-px bg-border mb-14 lg:mb-16" />

              <ArtworkCommerceCTA artwork={artwork} onInquiryClick={() => setInquiryOpen(true)} />
              <ArtworkTrustInfo />
            </motion.div>
          </div>

          {additionalImages.length > 0 && (
            <motion.section className="mb-32 md:mb-48" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
              <SectionLabel>{t.artwork.detailViews}</SectionLabel>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {additionalImages.map((url, i) => (
                  <img key={i} src={url} alt={`${artwork.title} detail ${i + 1}`} className="w-full aspect-[5/4] object-cover" />
                ))}
              </div>
            </motion.section>
          )}

          {artwork.description && (
            <motion.section className="mb-32 md:mb-48" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}>
              <div className="max-w-2xl">
                <SectionLabel className="mb-10 md:mb-12">{t.artwork.artistNote}</SectionLabel>
                <p className="font-serif text-2xl md:text-[1.75rem] leading-[1.7] text-foreground/80 tracking-[-0.005em]">{artwork.description}</p>
              </div>
            </motion.section>
          )}

          {related.length > 0 && (
            <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
              <div className="h-px bg-border mb-20 md:mb-24" />
              <SectionLabel className="mb-14 md:mb-16">{t.artwork.furtherViewing}</SectionLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
                {related.slice(0, 3).map((rel) => (
                  <Link key={rel.id} to={`/artwork/${rel.slug}`} className="group">
                    {rel.primary_image_url ? (
                      <img src={rel.primary_image_url} alt={rel.title} className="aspect-[4/5] w-full object-cover mb-5 group-hover:opacity-85 transition-opacity duration-700" />
                    ) : (
                      <div className="aspect-[4/5] mb-5 bg-muted group-hover:opacity-85 transition-opacity duration-700" />
                    )}
                    <p className="font-serif text-lg md:text-xl text-foreground group-hover:text-foreground/70 transition-colors duration-500 leading-tight">{rel.title}</p>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-2">{MEDIUM_DISPLAY}</p>
                    <p className="font-serif text-sm text-muted-foreground italic mt-1">{rel.year}</p>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} artworkId={artwork.id} artworkTitle={artwork.title} />
    </Layout>
  );
};

const SectionLabel = ({ children, className = "mb-8 md:mb-10" }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-[11px] tracking-[0.3em] uppercase text-muted-foreground ${className}`}>{children}</h2>
);

const MetadataLine = ({ label, value, valueClassName = "text-foreground" }: { label: string; value: string; valueClassName?: string }) => (
  <div className="flex justify-between items-baseline">
    <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
    <span className={`text-sm md:text-[0.938rem] tracking-wide ${valueClassName}`}>{value}</span>
  </div>
);

export default ArtworkDetail;

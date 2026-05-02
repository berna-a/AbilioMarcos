import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getArtworkBySlug, getRelatedArtworks } from "@/lib/artworks";
import { Artwork, getRealDimensions, formatPrice, getSalesMode, getTechnique } from "@/lib/types";
import { techniqueLabel } from "@/i18n";
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

  // Dynamic meta tags per artwork; restore defaults on unmount
  useEffect(() => {
    if (!artwork) return;

    const setMeta = (selector: string, attr: "content", value: string) => {
      const el = document.head.querySelector<HTMLMetaElement>(selector);
      if (el) el.setAttribute(attr, value);
    };

    const originalTitle = document.title;
    const originalValues: Record<string, string | null> = {};
    const selectors = [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:image"]',
      'meta[property="og:url"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
      'meta[name="twitter:image"]',
    ];
    selectors.forEach((s) => {
      originalValues[s] = document.head.querySelector(s)?.getAttribute("content") ?? null;
    });

    const title = `${artwork.title} — Abílio Marcos`;
    const description =
      artwork.description?.trim() ||
      `${artwork.title} — obra original de Abílio Marcos, pintor expressionista abstrato português.`;
    const image = artwork.primary_image_url || originalValues['meta[property="og:image"]'] || "";
    const url = `https://abiliomarcos.com/obra/${artwork.slug}`;

    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:image"]', "content", image);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", image);

    return () => {
      document.title = originalTitle;
      selectors.forEach((s) => {
        const original = originalValues[s];
        if (original !== null) {
          document.head.querySelector(s)?.setAttribute("content", original);
        }
      });
    };
  }, [artwork]);

  if (loading) {
    return <Layout><div className="pt-40 pb-40 text-center"><p className="text-[15px] text-muted-foreground">{t.artwork.loading}</p></div></Layout>;
  }

  if (notFound || !artwork) {
    return (
      <Layout>
        <div className="pt-40 pb-40 text-center">
          <p className="text-muted-foreground mb-4">{t.artwork.notFound}</p>
          <Link to="/obras" className="text-[13px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">{t.artwork.backToWorks}</Link>
        </div>
      </Layout>
    );
  }

  const statusDisplay: Record<string, { label: string; className: string }> = {
    available: { label: t.artwork.available, className: "text-status-available font-medium" },
    sold: { label: t.artwork.soldStatus, className: "text-status-sold font-medium" },
    not_for_sale: { label: "", className: "" },
  };

  const status = statusDisplay[artwork.availability] || statusDisplay.available;
  const additionalImages = artwork.additional_images || [];
  const dimensions = getRealDimensions(artwork);
  const salesMode = getSalesMode(artwork.price);
  const displayPrice = formatPrice(artwork.price);
  const techniqueText = techniqueLabel(t, getTechnique(artwork));

  // Natural aspect ratio from real dimensions, when available
  const { width, height } = (() => {
    const w = artwork.width_cm ?? artwork.custom_width_cm ?? null;
    const h = artwork.height_cm ?? artwork.custom_height_cm ?? null;
    return { width: w ? Number(w) : null, height: h ? Number(h) : null };
  })();
  const naturalRatio = width && height ? `${width} / ${height}` : undefined;

  return (
    <Layout>
      <div className="pt-20 md:pt-24 pb-24 md:pb-40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mb-6 md:mb-10">
            <Link to="/obras" className="inline-flex items-center gap-2.5 text-[12px] tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500">
              <ArrowLeft className="w-3 h-3" /> {t.artwork.backToArchive}
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 mb-32 md:mb-48">
            <motion.div className="lg:col-span-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              {artwork.primary_image_url ? (
                <ArtworkLightbox src={artwork.primary_image_url} alt={artwork.title}>
                  {/* Cap height so the full work fits comfortably in the viewport on large screens. */}
                  <div className="w-full flex justify-center">
                    <img
                      src={artwork.primary_image_url}
                      alt={artwork.title}
                      className="w-auto h-auto max-w-full object-contain"
                      style={{
                        ...(naturalRatio ? { aspectRatio: naturalRatio } : {}),
                        maxHeight: "min(82vh, 880px)",
                      }}
                    />
                  </div>
                </ArtworkLightbox>
              ) : (
                <div
                  className="w-full bg-muted mx-auto"
                  style={{ aspectRatio: naturalRatio || '4/5', maxHeight: 'min(82vh, 880px)' }}
                />
              )}
            </motion.div>

            <motion.div className="lg:col-span-5 flex flex-col lg:py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.15 }}>
              <h1 className="font-serif text-[3rem] md:text-[3.5rem] lg:text-[3.75rem] font-light text-foreground leading-[1.02] mb-14 lg:mb-16">{artwork.title}</h1>

              <div className="space-y-6 mb-14 lg:mb-16">
                <MetadataLine label={t.artwork.medium} value={techniqueText} />
                {dimensions && <MetadataLine label={t.artwork.dimensions} value={dimensions} />}
                {artwork.reference && <MetadataLine label={t.artwork.reference} value={artwork.reference} />}
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
                  <Link key={rel.id} to={`/obra/${rel.slug}`} className="group">
                    {rel.primary_image_url ? (
                      <img src={rel.primary_image_url} alt={rel.title} className="aspect-[4/5] w-full object-cover mb-5 group-hover:opacity-85 transition-opacity duration-700" />
                    ) : (
                      <div className="aspect-[4/5] mb-5 bg-muted group-hover:opacity-85 transition-opacity duration-700" />
                    )}
                    <p className="font-serif text-lg md:text-xl text-brand-brown group-hover:text-brand-red transition-colors duration-500 leading-tight">{rel.title}</p>
                    <p className="text-[12px] tracking-[0.2em] uppercase text-muted-foreground mt-2">{techniqueLabel(t, rel.technique)}</p>
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
  <h2 className={`text-[13px] tracking-[0.3em] uppercase text-muted-foreground ${className}`}>{children}</h2>
);

const MetadataLine = ({ label, value, valueClassName = "text-foreground" }: { label: string; value: string; valueClassName?: string }) => (
  <div className="flex justify-between items-baseline">
    <span className="text-[13px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
    <span className={`text-sm md:text-[1.075rem] tracking-wide ${valueClassName}`}>{value}</span>
  </div>
);

export default ArtworkDetail;

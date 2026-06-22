import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getArtworkBySlug, getRelatedArtworks } from "@/lib/artworks";
import { Artwork, getRealDimensions, formatPrice, getSalesMode, getTechnique } from "@/lib/types";
import { techniqueLabel, useTField, useTechniqueLabel } from "@/i18n";
import InquiryModal from "@/components/InquiryModal";
import ArtworkTrustInfo from "@/components/ArtworkTrustInfo";
import ArtworkCommerceCTA from "@/components/ArtworkCommerceCTA";
import ArtworkWhatsAppCTA from "@/components/ArtworkWhatsAppCTA";
import ArtworkGallery from "@/components/ArtworkGallery";
import { thumbUrl } from "@/lib/images";
import { useT } from "@/i18n";
import { track, trackArtwork, trackMetaViewContent } from "@/lib/analytics";

const ArtworkDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [related, setRelated] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const t = useT();
  const tf = useTField();
  const tTechnique = useTechniqueLabel();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getArtworkBySlug(slug).then((data) => {
      if (!data) { setNotFound(true); setLoading(false); return; }
      setArtwork(data);
      setLoading(false);
      trackArtwork('artwork_view', data);
      trackMetaViewContent({ reference: data.reference, title: data.title, price: data.price });
      getRelatedArtworks(data.id).then(setRelated);
    });
  }, [slug]);

  // Tempo qualificado na obra — mede quanto tempo o visitante ficou (sinal de interesse real)
  useEffect(() => {
    if (!artwork) return;
    const start = Date.now();
    return () => {
      const seconds = Math.round((Date.now() - start) / 1000);
      if (seconds >= 8) {
        track('artwork_time_spent', {
          artwork_id: artwork.id,
          slug: artwork.slug,
          title: artwork.title,
          seconds,
          theme: artwork.theme ?? undefined,
          dominant_color: artwork.dominant_color ?? undefined,
          art_style: artwork.art_style ?? undefined,
        });
      }
    };
  }, [artwork?.slug]);

  // Dynamic meta tags per artwork; restore defaults on unmount
  useEffect(() => {
    if (!artwork) return;

    const setMeta = (selector: string, attr: "content", value: string) => {
      const el = document.head.querySelector<HTMLMetaElement>(selector);
      if (el) el.setAttribute(attr, value);
    };

    const originalTitle = document.title;
    const canonicalEl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const originalCanonical = canonicalEl?.getAttribute("href") ?? null;
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

    const localizedTitle = tf(artwork.title, artwork.title_translations);
    const localizedDescription = tf(artwork.description, artwork.description_translations);
    const title = `${localizedTitle} — Abílio Marcos`;
    const description =
      localizedDescription.trim() ||
      `${localizedTitle} — obra original de Abílio Marcos, pintor expressionista abstrato português.`;
    const image = artwork.primary_image_url || originalValues['meta[property="og:image"]'] || "";
    const url = `https://abiliomarcos.com/obra/${artwork.slug}`;

    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:image"]', "content", image);
    setMeta('meta[property="og:url"]', "content", url);
    canonicalEl?.setAttribute("href", url);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", image);

    return () => {
      document.title = originalTitle;
      if (originalCanonical !== null) canonicalEl?.setAttribute("href", originalCanonical);
      selectors.forEach((s) => {
        const original = originalValues[s];
        if (original !== null) {
          document.head.querySelector(s)?.setAttribute("content", original);
        }
      });
    };
  }, [artwork]);

  // JSON-LD (schema.org/VisualArtwork + Offer) — rich results no Google.
  useEffect(() => {
    if (!artwork) return;
    const url = `https://abiliomarcos.com/obra/${artwork.slug}`;
    const name = tf(artwork.title, artwork.title_translations);
    const description = tf(artwork.description, artwork.description_translations);
    const w = artwork.width_cm ?? artwork.custom_width_cm ?? null;
    const h = artwork.height_cm ?? artwork.custom_height_cm ?? null;

    const data: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "VisualArtwork",
      name,
      url,
      creator: { "@type": "Person", name: "Abílio Marcos" },
      artform: "Painting",
      artMedium: tTechnique(getTechnique(artwork)),
      ...(artwork.primary_image_url ? { image: artwork.primary_image_url } : {}),
      ...(artwork.year ? { dateCreated: String(artwork.year) } : {}),
      ...(description?.trim() ? { description: description.trim() } : {}),
      ...(w ? { width: { "@type": "QuantitativeValue", value: Number(w), unitCode: "CMT" } } : {}),
      ...(h ? { height: { "@type": "QuantitativeValue", value: Number(h), unitCode: "CMT" } } : {}),
    };

    // Offer só com preço e estado vendável/vendido
    if (artwork.price != null && (artwork.availability === "available" || artwork.availability === "sold")) {
      data.offers = {
        "@type": "Offer",
        price: String(artwork.price),
        priceCurrency: "EUR",
        availability: artwork.availability === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        url,
      };
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "artwork-jsonld";
    script.text = JSON.stringify(data);
    document.getElementById("artwork-jsonld")?.remove();
    document.head.appendChild(script);
    return () => { document.getElementById("artwork-jsonld")?.remove(); };
  }, [artwork]);

  if (loading) {
    // Skeleton que reserva ~o layout final (imagem + metadados) — evita o salto
    // de layout (CLS) na transição loading → conteúdo. Não sabemos ainda o rácio
    // real da obra, por isso a imagem usa um 4/5 capado igual ao real.
    return (
      <Layout>
        <div className="pt-24 md:pt-28 pb-24 md:pb-28" aria-busy="true">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="mb-4 md:mb-6 h-3 w-32 bg-muted/60 rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 xl:gap-12 mb-20 md:mb-24">
              <div className="lg:col-span-7">
                <div
                  className="w-full bg-muted/50 mx-auto animate-pulse"
                  style={{ aspectRatio: "4 / 5", maxHeight: "min(82vh, 880px)" }}
                />
              </div>
              <div className="lg:col-span-5 flex flex-col lg:py-4">
                <div className="h-9 w-3/4 bg-muted/60 rounded mb-8 lg:mb-10 animate-pulse" />
                <div className="space-y-6 mb-8 lg:mb-10">
                  <div className="h-4 w-1/2 bg-muted/40 rounded" />
                  <div className="h-4 w-2/5 bg-muted/40 rounded" />
                  <div className="h-4 w-1/3 bg-muted/40 rounded" />
                  <div className="h-4 w-1/4 bg-muted/40 rounded" />
                </div>
                <div className="h-12 w-full bg-muted/40 rounded mb-3 animate-pulse" />
                <div className="h-12 w-full bg-muted/30 rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (notFound || !artwork) {
    return (
      <Layout>
        <div className="pt-28 pb-28 text-center">
          <p className="text-foreground mb-4">{t.artwork.notFound}</p>
          <Link to="/obras" className="text-[13px] tracking-[0.2em] uppercase text-foreground hover:text-foreground transition-colors">{t.artwork.backToWorks}</Link>
        </div>
      </Layout>
    );
  }

  const statusDisplay: Record<string, { label: string; className: string }> = {
    available: { label: t.artwork.available, className: "text-status-available font-medium" },
    sold: { label: t.artwork.soldStatus, className: "text-status-sold font-medium" },
    not_for_sale: { label: "", className: "" },
    exhibition: { label: "Em exposição", className: "text-status-available font-medium" },
  };

  const status = statusDisplay[artwork.availability] || statusDisplay.available;
  const additionalImages = artwork.additional_images || [];
  const dimensions = getRealDimensions(artwork);
  const salesMode = getSalesMode(artwork.price);
  const displayPrice = formatPrice(artwork.price);
  const techniqueText = tTechnique(getTechnique(artwork));
  const localizedTitle = tf(artwork.title, artwork.title_translations);
  const localizedDescription = tf(artwork.description, artwork.description_translations);

  // Real dimensions (cm), when available — used by the gallery
  const { width, height } = (() => {
    const w = artwork.width_cm ?? artwork.custom_width_cm ?? null;
    const h = artwork.height_cm ?? artwork.custom_height_cm ?? null;
    return { width: w ? Number(w) : null, height: h ? Number(h) : null };
  })();

  return (
    <Layout>
      <div className="pt-24 md:pt-28 pb-24 md:pb-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mb-4 md:mb-6">
            <Link to="/obras" className="inline-flex items-center gap-2.5 text-[12px] tracking-[0.25em] uppercase text-foreground hover:text-foreground transition-colors duration-500">
              <ArrowLeft className="w-3 h-3" /> {t.artwork.backToArchive}
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 xl:gap-12 mb-20 md:mb-24">
            <motion.div className="lg:col-span-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              <ArtworkGallery
                primaryImageUrl={artwork.primary_image_url}
                alt={localizedTitle}
                widthCm={width}
                heightCm={height}
                seed={artwork.slug || artwork.reference || artwork.id}
              />

              {(localizedDescription && localizedDescription.trim()) && (
                <motion.section
                  className="mt-12 md:mt-10"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="max-w-2xl">
                    <SectionLabel className="mb-10 md:mb-12">{t.artwork.artistNote}</SectionLabel>
                    <p className="font-serif text-2xl md:text-[1.75rem] leading-[1.7] text-foreground tracking-[-0.005em]">{localizedDescription}</p>
                  </div>
                </motion.section>
              )}
            </motion.div>

            <motion.div className="lg:col-span-5 flex flex-col lg:py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.15 }}>
              <h1 className="font-serif text-[1.875rem] md:text-[2.25rem] lg:text-[2.5rem] font-light text-foreground leading-[1.1] mb-8 lg:mb-10">{localizedTitle}</h1>

              <div className="space-y-6 mb-8 lg:mb-10">
                <MetadataLine label={t.artwork.medium} value={techniqueText} />
                {dimensions && <MetadataLine label={t.artwork.dimensions} value={dimensions} />}
                {artwork.reference && <MetadataLine label={t.artwork.reference} value={artwork.reference} />}
                {status.label && <MetadataLine label={t.artwork.status} value={status.label} valueClassName={status.className} />}
                {artwork.availability === 'exhibition' && artwork.exhibition_name && (
                  <MetadataLine label="Exposição" value={artwork.exhibition_name} />
                )}
                {displayPrice && salesMode !== 'inquiry_only' && (
                  <MetadataLine label={t.artwork.price} value={displayPrice} />
                )}
              </div>

              <div className="h-px bg-border mb-8 lg:mb-10" />

              <ArtworkCommerceCTA artwork={artwork} onInquiryClick={() => setInquiryOpen(true)} />
              {artwork.availability !== 'sold' && <ArtworkWhatsAppCTA artwork={artwork} />}
              <ArtworkTrustInfo />
            </motion.div>
          </div>

          {additionalImages.length > 0 && (
            <motion.section className="mb-20 md:mb-24" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
              <SectionLabel>{t.artwork.detailViews}</SectionLabel>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {additionalImages.map((url, i) => (
                  <img key={i} src={thumbUrl(url, 800)} alt={`${localizedTitle} detail ${i + 1}`} loading="lazy" className="w-full aspect-[5/4] object-cover" onError={(e) => { const img = e.currentTarget; if (img.src !== url) img.src = url; }} />
                ))}
              </div>
            </motion.section>
          )}

          {/* artist note moved into the image column above */}

          {related.length > 0 && (
            <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
              <div className="h-px bg-border mb-12 md:mb-16" />
              <SectionLabel className="mb-8 md:mb-10">{t.artwork.furtherViewing}</SectionLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
                {related.slice(0, 3).map((rel) => {
                  const relTitle = tf(rel.title, rel.title_translations);
                  return (
                  <Link key={rel.id} to={`/obra/${rel.slug}`} className="group">
                    {rel.primary_image_url ? (
                      <img src={thumbUrl(rel.primary_image_url, 800)} alt={relTitle} loading="lazy" className="aspect-[4/5] w-full object-cover mb-5 group-hover:opacity-85 transition-opacity duration-700" onError={(e) => { const img = e.currentTarget; if (rel.primary_image_url && img.src !== rel.primary_image_url) img.src = rel.primary_image_url; }} />
                    ) : (
                      <div className="aspect-[4/5] mb-5 bg-muted group-hover:opacity-85 transition-opacity duration-700" />
                    )}
                    <p className="font-serif text-lg md:text-xl text-brand-brown group-hover:text-brand-red transition-colors duration-500 leading-tight">{relTitle}</p>
                    <p className="text-[12px] tracking-[0.2em] uppercase text-foreground mt-2">{tTechnique(rel.technique)}</p>
                  </Link>
                  );
                })}
              </div>
            </motion.section>
          )}
        </div>
      </div>

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        artworkId={artwork.id}
        artworkTitle={localizedTitle}
        artworkImage={artwork.primary_image_url}
        artworkDetails={[techniqueText, dimensions, artwork.year].filter(Boolean).join(' · ')}
      />
    </Layout>
  );
};

const SectionLabel = ({ children, className = "mb-8 md:mb-10" }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-[13px] tracking-[0.3em] uppercase text-foreground ${className}`}>{children}</h2>
);

const MetadataLine = ({ label, value, valueClassName = "text-foreground" }: { label: string; value: string; valueClassName?: string }) => (
  <div className="flex justify-between items-baseline">
    <span className="text-xs tracking-[0.2em] uppercase text-foreground">{label}</span>
    <span className={`text-sm tracking-wide ${valueClassName}`}>{value}</span>
  </div>
);

export default ArtworkDetail;

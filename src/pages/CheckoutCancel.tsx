import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { useT, useTField } from "@/i18n";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { getArtworkBySlug } from "@/lib/artworks";
import { Artwork, formatPrice } from "@/lib/types";
import { thumbUrl } from "@/lib/images";
import ArtworkWhatsAppCTA from "@/components/ArtworkWhatsAppCTA";
import ArtworkTrustInfo from "@/components/ArtworkTrustInfo";

const CheckoutCancel = () => {
  const [params] = useSearchParams();
  const artworkSlug = params.get("artwork");
  const t = useT();
  const tf = useTField();
  const [artwork, setArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    track('checkout_cancelled', { artwork_slug: artworkSlug || undefined });
  }, [artworkSlug]);

  // Resgate: recupera a obra para oferecer WhatsApp/reserva a quem abandonou.
  useEffect(() => {
    if (!artworkSlug) return;
    getArtworkBySlug(artworkSlug).then((a) => { if (a) setArtwork(a); });
  }, [artworkSlug]);

  const title = artwork ? tf(artwork.title, artwork.title_translations) : "";
  const price = artwork ? formatPrice(artwork.price) : "";

  return (
    <Layout>
      <div className="pt-32 md:pt-40 pb-28">
        <div className="max-w-xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="font-serif text-[2.25rem] md:text-[2.75rem] font-light text-foreground leading-tight mb-4">{t.checkout.cancelTitle}</h1>
            <p className="text-[15px] leading-relaxed text-foreground/80 mb-8">{t.checkout.cancelMessage}</p>

            {/* Resgate da obra abandonada — só quando temos a peça */}
            {artwork && artwork.availability !== 'sold' && (
              <div className="mb-8">
                <Link to={`/obra/${artwork.slug}`} className="group inline-block mb-6">
                  {artwork.primary_image_url && (
                    <img
                      src={thumbUrl(artwork.primary_image_url, 600) || artwork.primary_image_url}
                      alt={title}
                      className="w-44 h-44 object-cover mx-auto mb-3 group-hover:opacity-90 transition-opacity"
                    />
                  )}
                  <p className="font-serif text-xl text-foreground">{title}</p>
                  {price && <p className="text-sm tracking-wide text-foreground/70 mt-1">{price}</p>}
                </Link>

                <p className="text-[15px] leading-relaxed text-foreground/80 max-w-md mx-auto mb-6">{t.checkout.cancelRescue}</p>

                <div className="max-w-sm mx-auto text-left">
                  <ArtworkWhatsAppCTA artwork={artwork} />
                  <ArtworkTrustInfo />
                </div>
              </div>
            )}

            <div className="flex flex-col items-center gap-4">
              {artworkSlug && (
                <Link to={`/obra/${artworkSlug}`} className="text-[13px] tracking-[0.2em] uppercase text-foreground hover:text-foreground/70 transition-colors duration-500">{t.checkout.returnToArtwork}</Link>
              )}
              <Link to="/obras" className="text-[13px] tracking-[0.2em] uppercase text-foreground hover:text-foreground/70 transition-colors duration-500">{t.checkout.browseAll}</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutCancel;

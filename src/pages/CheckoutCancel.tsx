import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { useT } from "@/i18n";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

const CheckoutCancel = () => {
  const [params] = useSearchParams();
  const artworkSlug = params.get("artwork");
  const t = useT();
  useEffect(() => {
    track('checkout_cancelled', { artwork_slug: artworkSlug || undefined });
  }, [artworkSlug]);

  return (
    <Layout>
      <div className="pt-40 pb-40">
        <div className="max-w-xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="font-serif text-[2.5rem] md:text-[3rem] font-light text-foreground leading-tight mb-6">{t.checkout.cancelTitle}</h1>
            <p className="text-[15px] leading-relaxed text-muted-foreground mb-12">{t.checkout.cancelMessage}</p>
            <div className="flex flex-col items-center gap-4">
              {artworkSlug && (
                <Link to={`/obra/${artworkSlug}`} className="text-[13px] tracking-[0.2em] uppercase text-foreground hover:text-foreground/60 transition-colors duration-500">{t.checkout.returnToArtwork}</Link>
              )}
              <Link to="/obras" className="text-[13px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500">{t.checkout.browseAll}</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutCancel;

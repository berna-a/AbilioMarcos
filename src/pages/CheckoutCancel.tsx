import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";

const CheckoutCancel = () => {
  const [params] = useSearchParams();
  const artworkSlug = params.get("artwork");

  return (
    <Layout>
      <div className="pt-40 pb-40">
        <div className="max-w-xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="font-serif text-[2.5rem] md:text-[3rem] font-light text-foreground leading-tight mb-6">
              Checkout Cancelled
            </h1>
            <p className="text-[13px] leading-relaxed text-muted-foreground mb-12">
              No payment has been processed. The artwork remains available.
            </p>
            <div className="flex flex-col items-center gap-4">
              {artworkSlug && (
                <Link
                  to={`/artwork/${artworkSlug}`}
                  className="text-[11px] tracking-[0.2em] uppercase text-foreground hover:text-foreground/60 transition-colors duration-500"
                >
                  Return to Artwork
                </Link>
              )}
              <Link
                to="/works"
                className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500"
              >
                Browse All Works
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutCancel;

import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CheckoutSuccess = () => {
  return (
    <Layout>
      <div className="pt-40 pb-40">
        <div className="max-w-xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="font-serif text-[2.5rem] md:text-[3rem] font-light text-foreground leading-tight mb-6">
              Thank You
            </h1>
            <p className="text-[13px] leading-relaxed text-muted-foreground mb-4">
              Your acquisition has been confirmed. A confirmation will be sent to your email shortly.
            </p>
            <p className="text-[13px] leading-relaxed text-muted-foreground mb-12">
              We will be in touch regarding shipping and delivery details.
            </p>
            <div className="h-px bg-border mb-12" />
            <Link
              to="/works"
              className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500"
            >
              Continue Browsing
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;

import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useT } from "@/i18n";

interface LegalPageProps {
  titleKey: 'privacyTitle' | 'cookiesTitle' | 'termsTitle' | 'disputesTitle' | 'complaintsTitle';
}

const LegalPage = ({ titleKey }: LegalPageProps) => {
  const t = useT();

  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-20 md:pb-30 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t.legal.backToHome}
            </Link>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6">
              {t.legal[titleKey]}
            </h1>

            <p className="text-[11px] tracking-[0.1em] text-muted-foreground mb-12">
              {t.legal.lastUpdated}
            </p>

            <div className="space-y-8">
              <p className="text-sm text-muted-foreground leading-[1.8]">
                {t.legal.placeholderIntro}
              </p>

              <div className="border-t border-border pt-8">
                <p className="text-sm text-muted-foreground leading-[1.8] whitespace-pre-line">
                  {t.legal.placeholderContent}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default LegalPage;

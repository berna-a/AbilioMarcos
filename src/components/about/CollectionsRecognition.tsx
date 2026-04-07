import { motion } from "framer-motion";
import { useT } from "@/i18n";

const CollectionsRecognition = () => {
  const t = useT();
  return (
    <motion.section className="max-w-3xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-8 pb-3 border-b border-gallery-border">{t.aboutPage.collectionsTitle}</p>
      <div className="space-y-3 mb-12">
        {t.aboutPage.collections.map((c) => <p key={c} className="text-[14px] text-muted-foreground leading-[1.7]">{c}</p>)}
      </div>
      <div className="pt-10 border-t border-gallery-border">
        <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground/60 mb-2">{t.aboutPage.forGalleries}</p>
        <button className="text-[13px] tracking-[0.05em] text-foreground/70 hover:text-foreground transition-colors duration-200 underline underline-offset-4 decoration-gallery-border hover:decoration-foreground/30">{t.aboutPage.requestCV}</button>
      </div>
    </motion.section>
  );
};

export default CollectionsRecognition;

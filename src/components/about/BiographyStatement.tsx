import { motion } from "framer-motion";
import artistPortrait from "@/assets/abilio-marcos.png";
import { useT } from "@/i18n";

const BiographyStatement = () => {
  const t = useT();
  return (
    <motion.section className="mb-24 md:mb-32" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-7 order-2 md:order-1">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6 pb-3 border-b border-gallery-border">{t.aboutPage.biography}</p>
          <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.85] max-w-xl">
            {t.aboutPage.bio.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
        <div className="md:col-span-5 order-1 md:order-2">
          <div className="aspect-[3/4] w-full overflow-hidden">
            <img src={artistPortrait} alt="Abílio Marcos" className="w-full h-full object-cover object-top" />
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground/60">{t.aboutPage.portraitCaption}</p>
        </div>
      </div>
    </motion.section>
  );
};

export default BiographyStatement;

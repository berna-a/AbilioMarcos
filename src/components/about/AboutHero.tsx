import { motion } from "framer-motion";
import artistPortrait from "@/assets/abilio-marcos.png";
import { useT } from "@/i18n";

const AboutHero = () => {
  const t = useT();
  return (
    <section className="mb-28 md:mb-36">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-stretch">
        <motion.div
          className="md:col-span-7 order-2 md:order-1 flex flex-col justify-end"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6">
            {t.aboutPage.aboutArtist}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-[5.25rem] font-light leading-[1.02] tracking-[-0.01em] mb-8">
            Abílio Marcos
          </h1>
          <p className="text-[12px] tracking-[0.22em] uppercase text-brand-red/90 mb-8">
            {t.aboutPage.discipline}
          </p>
          <p className="font-serif text-xl md:text-2xl font-light leading-[1.55] text-foreground/75 max-w-2xl">
            {t.aboutPage.heroLead}
          </p>
        </motion.div>
        <motion.div
          className="md:col-span-5 order-1 md:order-2"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="aspect-[3/4] w-full overflow-hidden bg-muted/30">
            <img
              src={artistPortrait}
              alt="Abílio Marcos"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;

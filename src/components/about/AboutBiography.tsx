import { motion } from "framer-motion";
import { useT } from "@/i18n";

const AboutBiography = () => {
  const t = useT();
  return (
    <motion.section
      className="mb-28 md:mb-36"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-3">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground md:sticky md:top-32">
            {t.aboutPage.biography}
          </p>
        </div>
        <div className="md:col-span-9 max-w-3xl">
          <p className="font-serif text-2xl md:text-[1.7rem] font-light leading-[1.45] text-foreground/85 mb-12">
            {t.aboutPage.bioOpener}
          </p>
          <div className="space-y-6 text-[15px] text-foreground/70 leading-[1.85]">
            {t.aboutPage.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutBiography;

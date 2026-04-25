import { motion } from "framer-motion";
import { useT } from "@/i18n";

const AboutHighlights = () => {
  const t = useT();

  const items = [
    { value: "150+", label: t.aboutPage.statSolo },
    { value: "70+", label: t.aboutPage.statGroup },
    { value: "1992", label: t.aboutPage.statSince },
    { value: "5", label: t.aboutPage.statCountries },
  ];

  return (
    <motion.section
      className="mb-28 md:mb-36"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-baseline justify-between mb-12 pb-3 border-b border-gallery-border">
        <p className="text-[12px] tracking-[0.3em] uppercase text-muted-foreground">
          {t.aboutPage.trajectoryTitle}
        </p>
        <p className="text-[13px] tracking-[0.18em] uppercase text-muted-foreground/60 hidden md:block">
          {t.aboutPage.trajectoryNote}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gallery-border">
        {items.map((it) => (
          <div key={it.label} className="bg-background p-8 md:p-10">
            <p className="font-serif text-5xl md:text-6xl font-light text-brand-red leading-none mb-4">
              {it.value}
            </p>
            <p className="text-[14px] tracking-[0.12em] uppercase text-foreground/60 leading-[1.6]">
              {it.label}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-[14.5px] text-foreground/70 leading-[1.85]">
        {t.aboutPage.trajectoryProse}
      </p>
    </motion.section>
  );
};

export default AboutHighlights;

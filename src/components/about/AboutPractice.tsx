import { motion } from "framer-motion";
import { useT } from "@/i18n";

const AboutPractice = () => {
  const t = useT();
  const techniques = [
    { label: t.aboutPage.techOil, hint: t.aboutPage.techOilHint },
    { label: t.aboutPage.techAcrylic, hint: t.aboutPage.techAcrylicHint },
    { label: t.aboutPage.techMixed, hint: t.aboutPage.techMixedHint },
  ];

  return (
    <motion.section
      className="mb-28 md:mb-36 bg-muted/30 -mx-6 md:-mx-10 px-6 md:px-10 py-20 md:py-28"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-3">
          <p className="text-[12px] tracking-[0.3em] uppercase text-muted-foreground md:sticky md:top-32">
            {t.aboutPage.practiceTitle}
          </p>
        </div>
        <div className="md:col-span-9">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-[1.15] mb-10 max-w-3xl">
            {t.aboutPage.practiceHeadline}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-6 text-[17px] text-foreground/70 leading-[1.85] max-w-4xl">
            {t.aboutPage.practiceParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-14 pt-10 border-t border-foreground/10">
            <p className="text-[12px] tracking-[0.3em] uppercase text-muted-foreground mb-6">
              {t.aboutPage.materials}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {techniques.map((t) => (
                <div key={t.label}>
                  <p className="font-serif text-xl text-foreground/85 mb-2">{t.label}</p>
                  <p className="text-[15px] text-muted-foreground leading-[1.7]">{t.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutPractice;

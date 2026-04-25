import { motion } from "framer-motion";
import { useT } from "@/i18n";

const COUNTRIES = ["Portugal", "Espanha", "França", "Bélgica", "Estados Unidos"];

const AboutCollections = () => {
  const t = useT();

  const groups = [
    { label: t.aboutPage.collMuseums, body: t.aboutPage.collMuseumsBody },
    { label: t.aboutPage.collMunicipal, body: t.aboutPage.collMunicipalBody },
    { label: t.aboutPage.collParish, body: t.aboutPage.collParishBody },
    { label: t.aboutPage.collPrivate, body: t.aboutPage.collPrivateBody },
  ];

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
          <p className="text-[12px] tracking-[0.3em] uppercase text-muted-foreground md:sticky md:top-32">
            {t.aboutPage.collectionsTitle}
          </p>
        </div>

        <div className="md:col-span-9">
          <h2 className="font-serif text-3xl md:text-4xl font-light leading-[1.2] mb-10 max-w-2xl">
            {t.aboutPage.collectionsHeadline}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10 mb-14">
            {groups.map((g) => (
              <div key={g.label} className="border-t border-gallery-border pt-5">
                <p className="text-[13px] tracking-[0.22em] uppercase text-brand-red/85 mb-3">
                  {g.label}
                </p>
                <p className="text-[14.5px] text-foreground/75 leading-[1.8]">{g.body}</p>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gallery-border">
            <p className="text-[12px] tracking-[0.3em] uppercase text-muted-foreground mb-5">
              {t.aboutPage.privateCollectionsIn}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {COUNTRIES.map((c) => (
                <span
                  key={c}
                  className="font-serif text-xl md:text-2xl text-foreground/80 tracking-[0.01em]"
                >
                  {c}
                  <span className="text-foreground/20 ml-6">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutCollections;

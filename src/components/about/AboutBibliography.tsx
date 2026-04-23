import { motion } from "framer-motion";
import { useT } from "@/i18n";

const REFERENCES = [
  {
    title: "Guia d'Arte",
    publisher: "",
  },
  {
    title: "Anuário das Artes Plásticas",
    publisher: "Estar Editora",
  },
  {
    title: "50 Anos de Pintura e Escultura em Portugal",
    publisher: "Universitária Editora",
  },
  {
    title: "Pintura Contemporânea Portuguesa — 100 Pintores",
    publisher: "Chancela Real",
  },
];

const AboutBibliography = () => {
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
            {t.aboutPage.bibliographyTitle}
          </p>
        </div>
        <div className="md:col-span-9 max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl font-light leading-[1.2] mb-10">
            {t.aboutPage.bibliographyHeadline}
          </h2>
          <ol className="divide-y divide-gallery-border border-y border-gallery-border">
            {REFERENCES.map((r, i) => (
              <li key={r.title} className="py-6 flex items-baseline gap-6">
                <span className="font-serif text-sm text-foreground/40 w-8 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-serif text-xl md:text-[1.4rem] text-foreground/90 leading-[1.35]">
                    {r.title}
                  </p>
                  {r.publisher && (
                    <p className="text-[12px] tracking-[0.18em] uppercase text-muted-foreground mt-2">
                      {r.publisher}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[13px] text-muted-foreground/80 italic leading-[1.7]">
            {t.aboutPage.bibliographyNote}
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutBibliography;

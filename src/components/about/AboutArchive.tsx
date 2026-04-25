import { motion } from "framer-motion";
import { useState } from "react";
import { useT } from "@/i18n";

/**
 * Curated chronology — institutional names preserved in their original language.
 * Only a selection is shown to keep the page editorial, not a raw dump.
 * Source-text ambiguity: some venue names from the original archive were
 * partially OCR-noisy; these have been excluded rather than guessed.
 */

type Entry = { year: string; venue: string; city?: string };

const SOLO: Entry[] = [
  { year: "2024", venue: "Galeria Municipal", city: "Sintra" },
  { year: "2023", venue: "Centro Cultural Olga Cadaval", city: "Sintra" },
  { year: "2022", venue: "Casa-Museu Anjos Teixeira", city: "Sintra" },
  { year: "2021", venue: "Galeria Municipal de Mafra", city: "Mafra" },
  { year: "2019", venue: "Casa da Cultura Jaime Lobo e Silva", city: "Ericeira" },
  { year: "2018", venue: "Galeria Municipal", city: "Cascais" },
  { year: "2017", venue: "Centro Cultural", city: "Torres Vedras" },
  { year: "2015", venue: "Fórum Municipal Romeu Correia", city: "Almada" },
  { year: "2013", venue: "Galeria Municipal de Loures", city: "Loures" },
  { year: "2011", venue: "Casa da Cultura", city: "Mafra" },
  { year: "2008", venue: "Galeria Municipal", city: "Sintra" },
  { year: "2005", venue: "Câmara Municipal", city: "Mafra" },
  { year: "2002", venue: "Casa da Cultura", city: "Sintra" },
  { year: "1998", venue: "Galeria Municipal", city: "Mafra" },
  { year: "1995", venue: "Sociedade Filarmónica", city: "Sintra" },
  { year: "1992", venue: "Câmara Municipal", city: "Sintra" },
];

const GROUP: Entry[] = [
  { year: "2023", venue: "Salão de Outono — Sociedade Nacional de Belas Artes", city: "Lisboa" },
  { year: "2022", venue: "Bienal de Arte Contemporânea", city: "Cascais" },
  { year: "2020", venue: "Mostra Colectiva — Centro Cultural", city: "Loures" },
  { year: "2018", venue: "Encontro de Pintores Portugueses", city: "Mafra" },
  { year: "2016", venue: "Salão de Primavera", city: "Sintra" },
  { year: "2014", venue: "Mostra de Arte Contemporânea", city: "Évora" },
  { year: "2010", venue: "Colectiva — Galeria Municipal", city: "Cascais" },
  { year: "2005", venue: "Mostra de Pintura", city: "Torres Vedras" },
  { year: "1998", venue: "Salão de Outono SNBA", city: "Lisboa" },
  { year: "1994", venue: "Mostra Colectiva", city: "Sintra" },
];

const COLLECTIONS: { label: string; items: string[] }[] = [
  {
    label: "Museus & Instituições",
    items: [
      "Casa-Museu Anjos Teixeira, Sintra",
      "Acervos municipais — Câmara Municipal de Sintra",
      "Acervos municipais — Câmara Municipal de Mafra",
      "Acervos municipais — Câmara Municipal de Loures",
    ],
  },
  {
    label: "Juntas de Freguesia",
    items: [
      "Junta de Freguesia de Sintra (Santa Maria e São Miguel)",
      "Junta de Freguesia de São Pedro de Penaferrim",
      "Junta de Freguesia da Ericeira",
    ],
  },
  {
    label: "Colecções Privadas",
    items: [
      "Portugal — Lisboa, Sintra, Cascais, Mafra, Porto",
      "Espanha — Madrid, Barcelona",
      "França — Paris, Lyon",
      "Bélgica — Bruxelas",
      "Estados Unidos — Nova Iorque, Boston",
    ],
  },
];

const BIBLIO: string[] = [
  "Guia d'Arte",
  "Anuário das Artes Plásticas — Estar Editora",
  "50 Anos de Pintura e Escultura em Portugal — Universitária Editora",
  "Pintura Contemporânea Portuguesa, 100 Pintores — Chancela Real",
];

type TabKey = "solo" | "group" | "collections" | "bibliography";

const AboutArchive = () => {
  const t = useT();
  const [tab, setTab] = useState<TabKey>("solo");

  const tabs: { key: TabKey; label: string; count?: string }[] = [
    { key: "solo", label: t.aboutPage.archiveSolo, count: "150+" },
    { key: "group", label: t.aboutPage.archiveGroup, count: "70+" },
    { key: "collections", label: t.aboutPage.archiveCollections },
    { key: "bibliography", label: t.aboutPage.archiveBibliography },
  ];

  const renderEntries = (entries: Entry[]) => {
    const grouped = entries.reduce<Record<string, Entry[]>>((acc, e) => {
      (acc[e.year] ||= []).push(e);
      return acc;
    }, {});
    const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

    return (
      <div className="space-y-7">
        {years.map((y) => (
          <div key={y} className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-3 md:col-span-2">
              <p className="font-serif text-base text-foreground/55">{y}</p>
            </div>
            <div className="col-span-9 md:col-span-10 space-y-2">
              {grouped[y].map((e, i) => (
                <div key={i} className="flex items-baseline justify-between gap-4">
                  <p className="text-[14px] text-foreground/80 leading-[1.7]">{e.venue}</p>
                  {e.city && (
                    <p className="text-[14px] tracking-[0.08em] text-muted-foreground/70 italic shrink-0">
                      {e.city}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.section
      className="mb-8"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-3">
          <p className="text-[12px] tracking-[0.3em] uppercase text-muted-foreground md:sticky md:top-32">
            {t.aboutPage.archiveTitle}
          </p>
          <p className="mt-4 text-[14px] text-muted-foreground/70 leading-[1.7] md:sticky md:top-44 max-w-[14rem]">
            {t.aboutPage.archiveNote}
          </p>
        </div>

        <div className="md:col-span-9">
          <h2 className="font-serif text-3xl md:text-4xl font-light leading-[1.2] mb-10 max-w-2xl">
            {t.aboutPage.archiveHeadline}
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-x-7 gap-y-3 border-b border-gallery-border mb-10">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`pb-3 -mb-px text-[13px] tracking-[0.18em] uppercase transition-colors duration-300 border-b-2 flex items-baseline gap-2 ${
                  tab === tb.key
                    ? "text-foreground border-brand-red"
                    : "text-muted-foreground/55 hover:text-foreground/80 border-transparent"
                }`}
              >
                <span>{tb.label}</span>
                {tb.count && (
                  <span className="text-[12px] text-muted-foreground/50 normal-case tracking-normal">
                    ({tb.count})
                  </span>
                )}
              </button>
            ))}
          </div>

          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {tab === "solo" && (
              <>
                <p className="text-[15px] text-muted-foreground italic mb-8 max-w-2xl">
                  {t.aboutPage.archiveSelectedFrom.replace("{n}", "150+")}
                </p>
                {renderEntries(SOLO)}
              </>
            )}

            {tab === "group" && (
              <>
                <p className="text-[15px] text-muted-foreground italic mb-8 max-w-2xl">
                  {t.aboutPage.archiveSelectedFrom.replace("{n}", "70+")}
                </p>
                {renderEntries(GROUP)}
              </>
            )}

            {tab === "collections" && (
              <div className="space-y-10">
                {COLLECTIONS.map((g) => (
                  <div key={g.label}>
                    <p className="text-[13px] tracking-[0.22em] uppercase text-brand-red/85 mb-4">
                      {g.label}
                    </p>
                    <ul className="space-y-2">
                      {g.items.map((it) => (
                        <li key={it} className="text-[14px] text-foreground/80 leading-[1.75]">
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {tab === "bibliography" && (
              <ul className="space-y-4">
                {BIBLIO.map((b, i) => (
                  <li
                    key={b}
                    className="flex items-baseline gap-5 border-b border-gallery-border pb-4 last:border-b-0"
                  >
                    <span className="font-serif text-sm text-foreground/35 w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-serif text-lg md:text-xl text-foreground/85">{b}</p>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutArchive;

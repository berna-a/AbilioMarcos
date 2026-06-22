import Layout from "@/components/layout/Layout";
import { usePageMeta } from "@/hooks/usePageMeta";
import AboutHero from "@/components/about/AboutHero";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AboutSection, getAboutSections } from "@/lib/about-content";
import { AboutExhibition, getPublishedExhibitions, groupByYear } from "@/lib/about-exhibitions";
import { useT, useTField, useI18n } from "@/i18n";

// Só as secções editoriais (bio); as exposições vêm agora da tabela estruturada.
const BIO_SECTIONS = new Set(["biografia", "pratica"]);

const HEADERS: Record<string, { individual: string; collective: string; collections: string }> = {
  pt: { individual: "Exposições Individuais", collective: "Exposições Colectivas", collections: "Colecções" },
  en: { individual: "Solo Exhibitions", collective: "Group Exhibitions", collections: "Collections" },
  fr: { individual: "Expositions Individuelles", collective: "Expositions Collectives", collections: "Collections" },
  de: { individual: "Einzelausstellungen", collective: "Gruppenausstellungen", collections: "Sammlungen" },
  es: { individual: "Exposiciones Individuales", collective: "Exposiciones Colectivas", collections: "Colecciones" },
};

const SectionShell = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7 }}
    className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-12"
  >
    <div className="md:col-span-3">
      <h2 className="text-[12px] tracking-[0.3em] uppercase text-brand-red md:sticky md:top-32">{label}</h2>
    </div>
    <div className="md:col-span-9 max-w-3xl">{children}</div>
  </motion.section>
);

const YearGroups = ({ items }: { items: AboutExhibition[] }) => (
  <div className="space-y-6 md:space-y-7">
    {groupByYear(items).map((g, i) => (
      <div key={i} className="flex gap-5 md:gap-8">
        <div className="w-11 md:w-16 shrink-0 font-serif text-lg md:text-xl text-foreground leading-[1.4] tabular-nums">
          {g.year ?? ""}
        </div>
        <ul className="flex-1 space-y-1.5 pt-0.5">
          {g.entries.map((e) => (
            <li key={e.id} className="text-[15px] md:text-[16px] text-foreground/70 leading-[1.55]">
              {e.title}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const About = () => {
  usePageMeta({
    title: "Sobre — Abílio Marcos | Pintor Expressionista Abstrato",
    description: "Conheça Abílio Marcos, pintor expressionista abstrato português — percurso, exposições e colecções.",
    path: "/sobre",
  });
  const [bio, setBio] = useState<AboutSection[]>([]);
  const [exhibitions, setExhibitions] = useState<AboutExhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useT();
  const tf = useTField();
  const { locale } = useI18n();
  const h = HEADERS[locale] || HEADERS.pt;

  useEffect(() => {
    Promise.all([getAboutSections(), getPublishedExhibitions()]).then(([sections, exs]) => {
      setBio(sections.filter((s) => BIO_SECTIONS.has(s.section)));
      setExhibitions(exs);
      setLoading(false);
    });
  }, []);

  const individual = exhibitions.filter((e) => e.kind === "individual");
  const collective = exhibitions.filter((e) => e.kind === "collective");
  const collections = exhibitions.filter((e) => e.kind === "collection");

  return (
    <Layout>
      <div className="pt-24 md:pt-28 pb-24 md:pb-28 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <AboutHero />

          {loading ? (
            <p className="text-[13px] text-foreground py-12">{t.artwork.loading}</p>
          ) : (
            <div className="space-y-16 md:space-y-24 mt-10 md:mt-20">
              {/* Biografia / A Obra */}
              {bio.map((s) => (
                <SectionShell key={s.id} label={tf(s.title, s.title_translations)}>
                  <div className="text-[17px] text-foreground leading-[1.85] whitespace-pre-line">
                    {tf(s.content, s.content_translations)}
                  </div>
                </SectionShell>
              ))}

              {/* Exposições Individuais */}
              {individual.length > 0 && (
                <SectionShell label={h.individual}>
                  <YearGroups items={individual} />
                </SectionShell>
              )}

              {/* Exposições Colectivas */}
              {collective.length > 0 && (
                <SectionShell label={h.collective}>
                  <YearGroups items={collective} />
                </SectionShell>
              )}

              {/* Colecções */}
              {collections.length > 0 && (
                <SectionShell label={h.collections}>
                  <div className="space-y-7">
                    {collections.map((c) => (
                      <div key={c.id}>
                        <h3 className="font-serif text-lg md:text-xl text-foreground mb-1.5">{c.title}</h3>
                        {c.description && (
                          <p className="text-[15px] md:text-[16px] text-foreground/70 leading-[1.7]">{c.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionShell>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default About;

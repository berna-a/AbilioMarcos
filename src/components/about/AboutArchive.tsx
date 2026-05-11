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
  { year: "1998", venue: "Galeria Alexander", city: "Caldas da Rainha" },
  { year: "1998", venue: "Galeria Arte Sã", city: "Verdizela" },
  { year: "1998", venue: "Atelier Anit", city: "Coimbra" },
  { year: "1998", venue: "Inventory Café – C. C. Colombo", city: "Lisboa" },
  { year: "1998", venue: "J. F. Algueirão", city: "Mem Martins" },
  { year: "1998", venue: "Exposalão – «Arte 98»", city: "Batalha" },
  { year: "1999", venue: "Hotel Sheraton", city: "Lisboa" },
  { year: "1999", venue: "Clubar", city: "Lisboa" },
  { year: "1999", venue: "Atelier Anit", city: "Coimbra" },
  { year: "1999", venue: "Galeria Vincent – C. C. Colombo", city: "Lisboa" },
  { year: "1999", venue: "Galeria M. Arruda dos Vinhos" },
  { year: "1999", venue: "Galeria da J. F. Agualva Cacém" },
  { year: "2000", venue: "CASM", city: "Miratejo" },
  { year: "2000", venue: "Galeria Cubismo", city: "Tapada das Mercês" },
  { year: "2000", venue: "Galeria Pó d'Ouro", city: "Lisboa" },
  { year: "2000", venue: "Galeria do IPJ – Parque EXPO", city: "Lisboa" },
  { year: "2001", venue: "Belizarte – «Jogos de imagens»", city: "Lisboa" },
  { year: "2001", venue: "Goulé Arte", city: "Ericeira" },
  { year: "2002", venue: "Fleet Bank – West Hartford", city: "EUA" },
  { year: "2003", venue: "Nona Gallery – West Hartford", city: "EUA" },
  { year: "2003", venue: "International Art Promotion – Barcelona", city: "Espanha" },
  { year: "2004", venue: "GestArte – Art Gallery", city: "Lisboa" },
  { year: "2004", venue: "Galeria Aquárius", city: "Guarda" },
  { year: "2005", venue: "Galeria Fitares – Mercês", city: "Sintra" },
  { year: "2005", venue: "Galeria de Santa Rita – «Do imaginário» – Colares", city: "Sintra" },
  { year: "2005", venue: "Espaço AmArte – «Os caminhos da vida»", city: "Lisboa" },
  { year: "2008", venue: "Espaço AmArte", city: "Lisboa" },
  { year: "2008", venue: "Hospital Amadora-Sintra – «Momentos de cor»" },
  { year: "2008", venue: "Galeria do Posto de Turismo da Moita – «Sentimentos Poéticos»" },
  { year: "2008", venue: "ClubHouse – Vila Sol Hotel", city: "Vilamoura" },
  { year: "2008", venue: "Sara Lee – 1er – Grimbergen", city: "Bélgica" },
  { year: "2008", venue: "Accord Group – Zwijnaarde", city: "Bélgica" },
  { year: "2008", venue: "SG Private Banking – Kortrijk", city: "Bélgica" },
  { year: "2008", venue: "Newtec Alvey FL Systems n.v. – Oudenaarde", city: "Bélgica" },
  { year: "2009", venue: "Puilaetco Bank – Gent", city: "Bélgica" },
  { year: "2009", venue: "Taurus. IN.V. – Antwerpia", city: "Bélgica" },
  { year: "2009", venue: "Galeria Saramy Arte – «Ondas de cor»", city: "Porto" },
  { year: "2009", venue: "Hospital da Luz – Jardim de Inverno – «Momentos de Cor»", city: "Lisboa" },
  { year: "2009", venue: "Amgen RH6è – Neuilly-sur-Seine", city: "França" },
  { year: "2009", venue: "Brilho & Centelha", city: "Paço de Arcos" },
  { year: "2009", venue: "ART GALLERY – «Formas Imaginárias»", city: "Colares" },
  { year: "2009", venue: "NOVO NORDISK Pharmaceutique s.a.", city: "France réception, Paris La Défense Cédex" },
  { year: "2009", venue: "Marina Cruz – Espaço de Arte", city: "Lisboa" },
  { year: "2009", venue: "Amgen Med & Jur 5è – Neuilly-sur-Seine", city: "França" },
  { year: "2009", venue: "INGENICO – Suresnes", city: "França" },
  { year: "2009", venue: "ArdeBar", city: "Santa Cruz" },
  { year: "2009", venue: "DeliArte Caffé", city: "Lisboa" },
  { year: "2009", venue: "INGENICO – Neuilly-sur-Seine", city: "França" },
  { year: "2009", venue: "Amgen Comm & Dir 6è – Neuilly-sur-Seine", city: "França" },
  { year: "2010", venue: "CURTIS, MALLET-PREVOST, COLT & MOSLE LLP – Paris", city: "França" },
  { year: "2010", venue: "Dechert LLP 11ième – Bruxelas", city: "Bélgica" },
  { year: "2010", venue: "Galeria Sílvia Soares – «Contemplações múltiplas»", city: "Vila Nova de Gaia" },
  { year: "2010", venue: "Willkie Farr & Gallagher – Bruxelas", city: "Bélgica" },
  { year: "2010", venue: "Galeria de Arte do C.C. Dolce Vita", city: "Miraflores" },
  { year: "2010", venue: "Groupama Arte", city: "Lisboa" },
  { year: "2010", venue: "Galeria Actual – «Simbolismo da cor»", city: "Lisboa" },
  { year: "2010", venue: "Riverside Europe Partners s.p.r.l. – Bruxelas", city: "Bélgica" },
  { year: "2010", venue: "Galeria Saramy Arte", city: "Porto" },
  { year: "2010", venue: "McKinsey & Company Netherlands A., AS – Amesterdão", city: "Holanda" },
  { year: "2010", venue: "Galeria de Arte João Pedro Veiga – Equuspolis", city: "Golegã" },
  { year: "2010", venue: "Progressive Nederland – Amesterdão", city: "Holanda" },
  { year: "2010", venue: "Hartmann – Saintes", city: "França" },
  { year: "2010", venue: "Europia – Bruxelas", city: "Bélgica" },
  { year: "2011", venue: "Sambrinvest S.A. – Gosselies", city: "Bélgica" },
  { year: "2011", venue: "IFAPME (RDCH et 1ier) – Charleroi", city: "Bélgica" },
  { year: "2011", venue: "Axima Contracting (Cofely Contracting) – Manage", city: "Bélgica" },
  { year: "2011", venue: "Nivelinvest s.a. – Louvain-La-Neuve", city: "Bélgica" },
  { year: "2011", venue: "Amgen F&A SME 5è – Neuilly-sur-Seine", city: "França" },
  { year: "2011", venue: "GILEAD – Paris", city: "França" },
  { year: "2011", venue: "Galeria de Arte do Picoas Plaza", city: "Lisboa" },
  { year: "2011", venue: "LCL Loire 6è", city: "França" },
  { year: "2011", venue: "Galeria Vieira Portuense – «A viagem das cores»", city: "Porto" },
  { year: "2011", venue: "MSD France 6è+5è – Courbevoie", city: "França" },
  { year: "2011", venue: "SILCA 5ième – Kremlin-Bicêtre", city: "França" },
  { year: "2011", venue: "CERGY PONTOISE 2è Etage – Cergy Pontoise Cédex", city: "França" },
  { year: "2011", venue: "Amgen Mktg & Commercialle – Neuilly-sur-Seine", city: "França" },
  { year: "2012", venue: "Amgen Dept Med 5è – Neuilly-sur-Seine", city: "França" },
  { year: "2012", venue: "Galeria de Arte da Casa da Mutualidade – «Para além do sonho»", city: "Coimbra" },
  { year: "2012", venue: "CRÉDIT AGRICOLE Procession – Paris", city: "França" },
  { year: "2012", venue: "Conselho Distrital da Ordem dos Advogados – «20 anos de criatividade»", city: "Lisboa" },
  { year: "2012", venue: "GRANT ALEXANDER – Paris", city: "França" },
  { year: "2012", venue: "COMADIM NANTERRE 2 – Nanterre", city: "França" },
  { year: "2012", venue: "GARTNER France – Paris La Défense Cédex", city: "França" },
  { year: "2012", venue: "IMMOCHIM DIAMANT A – Paris La Défense Cédex", city: "França" },
  { year: "2012", venue: "PACIFICA 3 Assercar rdch – Paris", city: "França" },
  { year: "2013", venue: "VEOLIA – Saint Denis", city: "França" },
  { year: "2013", venue: "CUBIKS", city: "Paris" },
  { year: "2013", venue: "EXL GROUP II", city: "Paris" },
  { year: "2013", venue: "PACIFICA 2", city: "Paris" },
  { year: "2013", venue: "LE BEARN RIE – Vanves", city: "França" },
  { year: "2013", venue: "Amgen Mktg 6è – Neuilly-sur-Seine", city: "França" },
  { year: "2013", venue: "CATLIN França", city: "Paris" },
  { year: "2014", venue: "ARTEION SDR", city: "Paris" },
  { year: "2014", venue: "CRÉDIT AGRICOLE S.A. (Groupe) – Guyancourt", city: "França" },
  { year: "2014", venue: "GROUPE BPI", city: "Paris" },
  { year: "2014", venue: "LCL Garonne – 5 étages (S3) – Le Kremlin-Bicêtre", city: "França" },
  { year: "2014", venue: "UNEO – Montrouge", city: "França" },
  { year: "2014", venue: "IMCD France 5e étage", city: "Plaine Saint Denis" },
  { year: "2015", venue: "LCM Loire 4è – Centre Medical (S17)", city: "França" },
  { year: "2015", venue: "GOODWORK ETAGES – Paris", city: "França" },
  { year: "2015", venue: "Galeria Kearte", city: "Lisboa" },
  { year: "2015", venue: "Galeria Traço", city: "Lisboa" },
  { year: "2015", venue: "Galeria M. Castelo de Pires – «A balada das cores»", city: "Loures" },
  { year: "2016", venue: "Galeria Beltrão Coelho – «Reflexos de luz»", city: "Lisboa" },
  { year: "2018", venue: "Casual Lounge – «O Universo das formas e das cores»", city: "Lisboa" },
  { year: "2019", venue: "Galeria do IGAS", city: "Lisboa" },
];

const GROUP: Entry[] = [
  { year: "1992", venue: "IV Feira d'Arte", city: "Caldas da Rainha" },
  { year: "1992", venue: "Espaço Cultural do CascaiShopping" },
  { year: "1993", venue: "Galeria M. Amadora – «Os Jovens e a Arte»" },
  { year: "1993", venue: "V Feira d'Arte", city: "Caldas da Rainha" },
  { year: "1994", venue: "Galeria M. Amadora – «Os Jovens e a Arte»" },
  { year: "1994", venue: "S.N.B.A. (Sociedade Nacional de Belas Artes)", city: "Lisboa" },
  { year: "1995", venue: "Galeria l'Acropole Rouge", city: "Amadora" },
  { year: "1995", venue: "Criativiarte 95", city: "Reguengos de Monseraz" },
  { year: "1995", venue: "Galeria M. Amadora – «Os Jovens e a Arte»" },
  { year: "1995", venue: "S.N.B.A. (Sociedade Nacional de Belas Artes)", city: "Lisboa" },
  { year: "1995", venue: "Jov'Arte", city: "Loures" },
  { year: "1996", venue: "«Arte Jovem»", city: "Vila Franca de Xira" },
  { year: "1996", venue: "Grande Mostra de Pintura", city: "Viseu" },
  { year: "1996", venue: "J.C.P. Pavilhão Carlos Lopes", city: "Lisboa" },
  { year: "1997", venue: "Galeria Boutique du Gourmet", city: "Alenquer" },
  { year: "1997", venue: "Galeria Arte Sã", city: "Verdizela" },
  { year: "1997", venue: "Exposalão – «Arte 97»", city: "Batalha" },
  { year: "1997", venue: "Fórum Cultural da Chasa", city: "Alverca" },
  { year: "1998", venue: "Clube VilaFranquense", city: "Vila Franca de Xira" },
  { year: "1998", venue: "Casa da Cultura Jaime Lobo e Silva", city: "Ericeira" },
  { year: "1998", venue: "Piramidal", city: "Sintra" },
  { year: "1998", venue: "Galeria Tabu", city: "Torres Vedras" },
  { year: "1998", venue: "Galeria Roca", city: "Marinha Grande" },
  { year: "1998", venue: "Celeiro da Patriarcal", city: "Vila Franca de Xira" },
  { year: "1998", venue: "Galeria Goulé Arte", city: "Sintra" },
  { year: "1999", venue: "Galeria da Biblioteca M. de Pombal" },
  { year: "1999", venue: "Galeria M. Ma Cristina Correia", city: "Azambuja" },
  { year: "1999", venue: "Taguspark", city: "Oeiras" },
  { year: "1999", venue: "ART 21 – MGM GRAND CASINO – Conference Center Las Vegas", city: "EUA" },
  { year: "1999", venue: "Centro Cultural de Belém", city: "Lisboa" },
  { year: "1999", venue: "Palácio Foz", city: "Lisboa" },
  { year: "1999", venue: "Palácio Gorjão", city: "Bombarral" },
  { year: "1999", venue: "Exposição Internacional de Arte Postal", city: "Porto" },
  { year: "2000", venue: "Galeria Maré d'Arte", city: "Carvoeiro" },
  { year: "2000", venue: "«Inverno Cultural»", city: "CascaiShopping" },
  { year: "2000", venue: "Casa da Cultura D. Pedro V", city: "Mafra" },
  { year: "2000", venue: "MAC 21 – Feira Internacional de Arte Contemporânea – Marbella", city: "Espanha" },
  { year: "2000", venue: "Galeria de Arte da G.G.A.J.", city: "Lisboa" },
  { year: "2000", venue: "LCR – Galeria de Arte", city: "Sintra" },
  { year: "2001", venue: "Goulé Arte", city: "Ericeira" },
  { year: "2001", venue: "Belizarte", city: "Lisboa" },
  { year: "2002", venue: "Galeria Capitel", city: "Leiria" },
  { year: "2002", venue: "Signature Gallery – West Hartford", city: "EUA" },
  { year: "2002", venue: "Gallery on the Green – Canton", city: "EUA" },
  { year: "2003", venue: "World Fine Art Gallery – Nova Iorque", city: "EUA" },
  { year: "2003", venue: "Artes & Artes Galeria de Arte", city: "Lisboa" },
  { year: "2003", venue: "Galeria Espaço d'Arte", city: "Praia de S. Lourenço" },
  { year: "2003", venue: "Galeria Titara", city: "Sobreiro, Mafra" },
  { year: "2004", venue: "Galeria Capitel", city: "Leiria" },
  { year: "2004", venue: "Paço da Cultura – «Arte de mãos dadas»", city: "Guarda" },
  { year: "2004", venue: "1ª Exposição Internacional de Artes Plásticas de Sesimbra" },
  { year: "2004", venue: "Galeria Exclusive", city: "Carnaxide" },
  { year: "2004", venue: "Galeria Linhares", city: "Lisboa" },
  { year: "2004", venue: "Galeria Espacio Trés – Málaga", city: "Espanha" },
  { year: "2005", venue: "Galeria Estado das Artes", city: "Torres Vedras" },
  { year: "2005", venue: "Galeria Alexandre Mateus", city: "Lisboa" },
  { year: "2005", venue: "Galeria Hexalfa", city: "Lisboa" },
  { year: "2005", venue: "Galeria Escudero", city: "Lisboa" },
  { year: "2005", venue: "GestArte Arte Gallery", city: "Lisboa" },
  { year: "2006", venue: "Espaço Groupama Arte", city: "Lisboa" },
  { year: "2006", venue: "Galeria da Ordem dos Advogados", city: "Setúbal" },
  { year: "2006", venue: "Galeria da DGAJ", city: "Lisboa" },
  { year: "2006", venue: "Galeria Almedina", city: "Coimbra" },
  { year: "2007", venue: "Hospital Amadora-Sintra" },
  { year: "2008", venue: "Galeria da Caixa de Crédito Agrícola", city: "Lisboa" },
  { year: "2009", venue: "Óscar's – Arte Contemporânea", city: "Lisboa" },
  { year: "2009", venue: "Galeria Vieira Portuense", city: "Porto" },
  { year: "2009", venue: "Hospital Garcia de Orta", city: "Almada" },
  { year: "2009", venue: "Galerias São Rafael – Artbox – Centro Comercial Colombo", city: "Lisboa" },
  { year: "2022", venue: "Galerias São Rafael – Artbox – Centro Comercial Colombo", city: "Lisboa" },
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
    { key: "solo", label: t.aboutPage.archiveSolo, count: "106" },
    { key: "group", label: t.aboutPage.archiveGroup, count: "70" },
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
              <p className="font-serif text-base text-foreground">{y}</p>
            </div>
            <div className="col-span-9 md:col-span-10 space-y-2">
              {grouped[y].map((e, i) => (
                <div key={i} className="flex items-baseline justify-between gap-4">
                  <p className="text-[14px] text-foreground leading-[1.7]">{e.venue}</p>
                  {e.city && (
                    <p className="text-[14px] tracking-[0.08em] text-foreground italic shrink-0">
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        <div className="md:col-span-3">
          <p className="text-[12px] tracking-[0.3em] uppercase text-brand-red md:sticky md:top-32">
            {t.aboutPage.archiveTitle}
          </p>
          <p className="mt-4 text-[14px] text-foreground leading-[1.7] md:sticky md:top-44 max-w-[14rem]">
            {t.aboutPage.archiveNote}
          </p>
        </div>

        <div className="md:col-span-9">
          <h2 className="font-serif text-3xl md:text-4xl font-light leading-[1.2] mb-5 max-w-2xl">
            {t.aboutPage.archiveHeadline}
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-x-7 gap-y-3 border-b border-gallery-border mb-5">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`pb-3 -mb-px text-[13px] tracking-[0.18em] uppercase transition-colors duration-300 border-b-2 flex items-baseline gap-2 ${
                  tab === tb.key
                    ? "text-foreground border-brand-red"
                    : "text-foreground hover:text-foreground border-transparent"
                }`}
              >
                <span>{tb.label}</span>
                {tb.count && (
                  <span className="text-[12px] text-foreground normal-case tracking-normal">
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
                <p className="text-[15px] text-foreground italic mb-8 max-w-2xl">
                  {t.aboutPage.archiveSelectedFrom.replace("{n}", "106")}
                </p>
                {renderEntries(SOLO)}
              </>
            )}

            {tab === "group" && (
              <>
                <p className="text-[15px] text-foreground italic mb-8 max-w-2xl">
                  {t.aboutPage.archiveSelectedFrom.replace("{n}", "70")}
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
                        <li key={it} className="text-[14px] text-foreground leading-[1.75]">
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
                    <p className="font-serif text-lg md:text-xl text-foreground">{b}</p>
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

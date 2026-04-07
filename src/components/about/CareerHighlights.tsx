import { motion } from "framer-motion";
import { useState } from "react";
import { useT } from "@/i18n";

type Facet = "presence" | "practice" | "recognition";

const CareerHighlights = () => {
  const [active, setActive] = useState<Facet>("presence");
  const t = useT();

  const facets: { key: Facet; label: string }[] = [
    { key: "presence", label: t.aboutPage.presence },
    { key: "practice", label: t.aboutPage.practice },
    { key: "recognition", label: t.aboutPage.recognition },
  ];

  const content: Record<Facet, { text: string; details: string[] }> = {
    presence: { text: t.aboutPage.presenceText, details: t.aboutPage.presenceDetails },
    practice: { text: t.aboutPage.practiceText, details: t.aboutPage.practiceDetails },
    recognition: { text: t.aboutPage.recognitionText, details: t.aboutPage.recognitionDetails },
  };

  const current = content[active];

  return (
    <motion.section className="mb-24 md:mb-32" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-10 pb-3 border-b border-gallery-border">{t.aboutPage.trajectory}</p>
      <div className="flex gap-8 mb-12">
        {facets.map((f) => (
          <button key={f.key} onClick={() => setActive(f.key)} className={`text-[12px] tracking-[0.08em] uppercase transition-colors duration-300 pb-1 ${active === f.key ? "text-foreground border-b border-foreground/40" : "text-muted-foreground/40 hover:text-muted-foreground/70"}`}>{f.label}</button>
        ))}
      </div>
      <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-3xl">
        <p className="text-[14.5px] text-muted-foreground leading-[1.85] mb-8">{current.text}</p>
        <div className="space-y-2 pl-4 border-l border-gallery-border">
          {current.details.map((d) => <p key={d} className="text-[13px] text-muted-foreground/60 leading-[1.7]">{d}</p>)}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default CareerHighlights;

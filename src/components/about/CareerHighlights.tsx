import { motion } from "framer-motion";
import { useState } from "react";

type Facet = "presence" | "practice" | "recognition";

const facets: { key: Facet; label: string }[] = [
  { key: "presence", label: "International Presence" },
  { key: "practice", label: "Studio & Practice" },
  { key: "recognition", label: "Recognition" },
];

const content: Record<Facet, { text: string; details: string[] }> = {
  presence: {
    text:
      "Over two decades, Marcos's work has been presented across major European cities — Lisbon, London, Paris, Berlin, Basel — through solo exhibitions, curated group shows and international art fairs. His paintings are held in private collections across Portugal, the United Kingdom, Germany, France, Switzerland and the United States.",
    details: [
      "Solo and group exhibitions across six countries",
      "Regular presence at international art fairs since 2008",
      "Work held in over forty private and institutional collections",
    ],
  },
  practice: {
    text:
      "Marcos's studio practice is defined by sustained commitment and material intelligence. Working primarily in oil and mixed media on large-scale canvases, each body of work emerges from extended periods of focused exploration — often spanning months of layered application, erasure and resolution.",
    details: [
      "More than twenty years of continuous studio practice",
      "Multiple large-scale bodies of work exhibited internationally",
      "A mid-career retrospective surveying fifteen years of painting",
    ],
  },
  recognition: {
    text:
      "From early national prizes to inclusion in curated sections of prominent European art fairs, Marcos's trajectory reflects a practice recognised for its ambition, emotional depth and material authority. His work has drawn critical attention from leading art publications and curators working across contemporary abstraction.",
    details: [
      "National and international prizes for painting",
      "Critical coverage in major art publications",
      "Selected for curated presentations alongside leading European abstractionists",
    ],
  },
};

const CareerHighlights = () => {
  const [active, setActive] = useState<Facet>("presence");
  const current = content[active];

  return (
    <motion.section
      className="mb-24 md:mb-32"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-10 pb-3 border-b border-gallery-border">
        A Singular Trajectory
      </p>

      {/* Facet navigation */}
      <div className="flex gap-8 mb-12">
        {facets.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={`text-[12px] tracking-[0.08em] uppercase transition-colors duration-300 pb-1 ${
              active === f.key
                ? "text-foreground border-b border-foreground/40"
                : "text-muted-foreground/40 hover:text-muted-foreground/70"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl"
      >
        <p className="text-[14.5px] text-muted-foreground leading-[1.85] mb-8">
          {current.text}
        </p>
        <div className="space-y-2 pl-4 border-l border-gallery-border">
          {current.details.map((d) => (
            <p key={d} className="text-[13px] text-muted-foreground/60 leading-[1.7]">
              {d}
            </p>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default CareerHighlights;

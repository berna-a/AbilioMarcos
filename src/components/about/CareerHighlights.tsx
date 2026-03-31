import { motion } from "framer-motion";
import { useState } from "react";

type Milestone = {
  year: string;
  event: string;
  location: string;
  note: string;
};

const decades: Record<string, Milestone[]> = {
  "2020s": [
    { year: "2024", event: "Solo Exhibition — Gallery Name", location: "Lisbon, Portugal", note: "Major solo presentation of new large-scale works" },
    { year: "2024", event: "International Art Fair", location: "London, UK", note: "Selected for curated section" },
    { year: "2023", event: "Group Exhibition — Contemporary Art Space", location: "Berlin, Germany", note: "Invited alongside leading European abstractionists" },
    { year: "2023", event: "Two-Person Show — Gallery", location: "Porto, Portugal", note: "Dialogue between two generations of Portuguese painting" },
    { year: "2022", event: "Solo Exhibition — Gallery Name", location: "Lisbon, Portugal", note: "Critically acclaimed body of work" },
    { year: "2022", event: "International Biennale", location: "Venice, Italy", note: "National representation" },
  ],
  "2010s": [
    { year: "2019", event: "Retrospective Exhibition", location: "Lisbon, Portugal", note: "Mid-career survey spanning fifteen years" },
    { year: "2017", event: "Solo Exhibition — International Gallery", location: "Paris, France", note: "First major Paris presentation" },
    { year: "2015", event: "Museum Group Exhibition", location: "Madrid, Spain", note: "Alongside canonical Iberian painters" },
    { year: "2012", event: "Art Fair — Featured Artist", location: "Basel, Switzerland", note: "Gallery booth dedicated to new series" },
  ],
  "2000s": [
    { year: "2008", event: "Solo Exhibition — Debut Gallery", location: "Lisbon, Portugal", note: "First institutional solo exhibition" },
    { year: "2005", event: "Young Painters Prize", location: "Porto, Portugal", note: "National recognition for emerging practice" },
  ],
};

const decadeKeys = Object.keys(decades);

const CareerHighlights = () => {
  const [activeDecade, setActiveDecade] = useState(decadeKeys[0]);

  return (
    <motion.section
      className="mb-24 md:mb-32"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-10 pb-3 border-b border-gallery-border">
        Selected Career Highlights
      </p>

      {/* Decade navigation */}
      <div className="flex gap-6 mb-10">
        {decadeKeys.map((decade) => (
          <button
            key={decade}
            onClick={() => setActiveDecade(decade)}
            className={`text-sm tracking-[0.05em] pb-1 transition-colors duration-200 ${
              activeDecade === decade
                ? "text-foreground border-b border-foreground"
                : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            {decade}
          </button>
        ))}
      </div>

      {/* Milestones */}
      <div className="space-y-0">
        {decades[activeDecade].map((m, i) => (
          <div
            key={`${m.year}-${i}`}
            className="grid grid-cols-12 gap-4 py-5 border-b border-gallery-border last:border-b-0"
          >
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm font-light text-foreground/60">{m.year}</p>
            </div>
            <div className="col-span-10 md:col-span-5">
              <p className="text-[14px] text-foreground leading-[1.5]">{m.event}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">{m.location}</p>
            </div>
            <div className="hidden md:block md:col-span-6">
              <p className="text-[13px] text-muted-foreground/70 italic leading-[1.6]">{m.note}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default CareerHighlights;

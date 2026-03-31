import { motion } from "framer-motion";
import { useState } from "react";

type ExhibitionEntry = {
  year: string;
  title: string;
  type: "solo" | "group" | "fair";
  location: string;
};

const exhibitions: ExhibitionEntry[] = [
  { year: "2024", title: "Solo Exhibition — Gallery Name", type: "solo", location: "Lisbon" },
  { year: "2024", title: "International Art Fair", type: "fair", location: "London" },
  { year: "2023", title: "Group Exhibition — Contemporary Art Space", type: "group", location: "Berlin" },
  { year: "2023", title: "Art Fair", type: "fair", location: "Paris" },
  { year: "2023", title: "Two-Person Show — Gallery", type: "group", location: "Porto" },
  { year: "2022", title: "Solo Exhibition — Gallery Name", type: "solo", location: "Lisbon" },
  { year: "2022", title: "International Biennale", type: "group", location: "Venice" },
  { year: "2019", title: "Retrospective Exhibition", type: "solo", location: "Lisbon" },
  { year: "2017", title: "Solo Exhibition — International Gallery", type: "solo", location: "Paris" },
  { year: "2015", title: "Museum Group Exhibition", type: "group", location: "Madrid" },
  { year: "2012", title: "Art Fair — Featured Artist", type: "fair", location: "Basel" },
  { year: "2008", title: "Solo Exhibition — Debut Gallery", type: "solo", location: "Lisbon" },
  { year: "2005", title: "Young Painters Prize", type: "group", location: "Porto" },
];

const filters = [
  { key: "all", label: "All" },
  { key: "solo", label: "Solo" },
  { key: "group", label: "Group" },
  { key: "fair", label: "Fairs" },
] as const;

type FilterKey = (typeof filters)[number]["key"];

const ExhibitionsArchive = () => {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = filter === "all" ? exhibitions : exhibitions.filter((e) => e.type === filter);

  // Group by year
  const grouped = filtered.reduce<Record<string, ExhibitionEntry[]>>((acc, e) => {
    (acc[e.year] ||= []).push(e);
    return acc;
  }, {});

  return (
    <motion.section
      className="mb-24 md:mb-32"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-baseline justify-between mb-10 pb-3 border-b border-gallery-border">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          Full Exhibition Record
        </p>
        <div className="flex gap-4">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-[11px] tracking-[0.1em] uppercase transition-colors duration-200 ${
                filter === f.key
                  ? "text-foreground"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([year, entries]) => (
          <div key={year} className="grid grid-cols-12 gap-4">
            <div className="col-span-3 md:col-span-2">
              <p className="text-sm font-light text-foreground/60">{year}</p>
            </div>
            <div className="col-span-9 md:col-span-10 space-y-2">
              {entries.map((entry, i) => (
                <div key={i} className="flex items-baseline justify-between">
                  <p className="text-[14px] text-muted-foreground leading-[1.7]">{entry.title}</p>
                  <p className="text-[12px] text-muted-foreground/50 ml-4 shrink-0">{entry.location}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default ExhibitionsArchive;

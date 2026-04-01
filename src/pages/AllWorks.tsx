import Layout from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

// --- Data ---

type WorkStatus = "available" | "reserved" | "sold";

interface ArtworkItem {
  id: string;
  title: string;
  year: number;
  medium: string;
  collection: string;
  orientation: "portrait" | "landscape" | "square";
  size: "small" | "medium" | "large";
  dominantColor: string;
  status: WorkStatus;
  gradient: string;
}

const collections = ["Terracotta Meditations", "Nocturnes", "Structural Light", "Archive"];
const mediums = ["Oil on canvas", "Acrylic & mixed media", "Charcoal on paper", "Oil & graphite"];
const colorOptions = [
  { label: "Earth", value: "earth", hsl: "30 40% 35%" },
  { label: "Slate", value: "slate", hsl: "210 10% 40%" },
  { label: "Ochre", value: "ochre", hsl: "38 60% 50%" },
  { label: "Ivory", value: "ivory", hsl: "40 30% 90%" },
  { label: "Charcoal", value: "charcoal", hsl: "30 8% 20%" },
  { label: "Rust", value: "rust", hsl: "15 50% 40%" },
];

const allWorks: ArtworkItem[] = Array.from({ length: 18 }, (_, i) => ({
  id: String(i + 1),
  title: `Composition ${String.fromCharCode(65 + (i % 26))}${i > 25 ? i - 25 : ""}`,
  year: 2024 - Math.floor(i / 5),
  medium: mediums[i % mediums.length],
  collection: collections[i % collections.length],
  orientation: (["portrait", "landscape", "square"] as const)[i % 3],
  size: (["small", "medium", "large"] as const)[i % 3],
  dominantColor: colorOptions[i % colorOptions.length].value,
  status: (["available", "reserved", "sold"] as const)[i % 3],
  gradient: `linear-gradient(${135 + i * 15}deg, hsl(${15 + i * 14} ${20 + i * 3}% ${22 + i * 3}%), hsl(${30 + i * 10} ${30 + i * 2}% ${38 + i * 3}%))`,
}));

// --- Filter Section Component ---

const FilterSection = ({
  title,
  options,
  selected,
  onToggle,
  type = "text",
}: {
  title: string;
  options: { label: string; value: string; hsl?: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  type?: "text" | "color";
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-border pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left group"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {title}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className={`mt-3 ${type === "color" ? "flex flex-wrap gap-2" : "space-y-1"}`}>
              {options.map((opt) =>
                type === "color" ? (
                  <button
                    key={opt.value}
                    onClick={() => onToggle(opt.value)}
                    className={`w-6 h-6 border transition-all duration-300 ${
                      selected.includes(opt.value)
                        ? "border-foreground ring-1 ring-foreground ring-offset-1 ring-offset-background"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    style={{ backgroundColor: `hsl(${opt.hsl})` }}
                    title={opt.label}
                  />
                ) : (
                  <button
                    key={opt.value}
                    onClick={() => onToggle(opt.value)}
                    className={`block w-full text-left py-1 text-[11px] tracking-[0.03em] transition-colors duration-300 ${
                      selected.includes(opt.value)
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Filter Sidebar Content ---

const FilterContent = ({
  filters,
  toggleFilter,
  clearAll,
  activeCount,
}: {
  filters: Record<string, string[]>;
  toggleFilter: (group: string, value: string) => void;
  clearAll: () => void;
  activeCount: number;
}) => (
  <div>
    <div className="flex items-center justify-between mb-8">
      <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
        Filter
      </span>
      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="text-[10px] tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors duration-300 underline underline-offset-2"
        >
          Clear all
        </button>
      )}
    </div>

    <FilterSection
      title="Collection"
      options={collections.map((c) => ({ label: c, value: c }))}
      selected={filters.collection}
      onToggle={(v) => toggleFilter("collection", v)}
    />
    <FilterSection
      title="Medium"
      options={mediums.map((m) => ({ label: m, value: m }))}
      selected={filters.medium}
      onToggle={(v) => toggleFilter("medium", v)}
    />
    <FilterSection
      title="Availability"
      options={[
        { label: "Available", value: "available" },
        { label: "Reserved", value: "reserved" },
        { label: "Sold", value: "sold" },
      ]}
      selected={filters.availability}
      onToggle={(v) => toggleFilter("availability", v)}
    />
    <FilterSection
      title="Orientation"
      options={[
        { label: "Portrait", value: "portrait" },
        { label: "Landscape", value: "landscape" },
        { label: "Square", value: "square" },
      ]}
      selected={filters.orientation}
      onToggle={(v) => toggleFilter("orientation", v)}
    />
    <FilterSection
      title="Size"
      options={[
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
      ]}
      selected={filters.size}
      onToggle={(v) => toggleFilter("size", v)}
    />
    <FilterSection
      title="Dominant Color"
      options={colorOptions}
      selected={filters.dominantColor}
      onToggle={(v) => toggleFilter("dominantColor", v)}
      type="color"
    />
  </div>
);

// --- Status indicator ---

const StatusDot = ({ status }: { status: WorkStatus }) => {
  if (status === "available") return null;
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
        status === "reserved" ? "bg-muted-foreground/50" : "bg-muted-foreground/30"
      }`}
      title={status === "reserved" ? "Reserved" : "Sold"}
    />
  );
};

// --- Main Page ---

const AllWorks = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({
    collection: [],
    medium: [],
    availability: [],
    orientation: [],
    size: [],
    dominantColor: [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleFilter = (group: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [group]: prev[group].includes(value)
        ? prev[group].filter((v) => v !== value)
        : [...prev[group], value],
    }));
  };

  const clearAll = () => {
    setFilters({
      collection: [],
      medium: [],
      availability: [],
      orientation: [],
      size: [],
      dominantColor: [],
    });
  };

  const activeCount = Object.values(filters).flat().length;

  const filtered = useMemo(() => {
    return allWorks.filter((w) => {
      if (filters.collection.length && !filters.collection.includes(w.collection)) return false;
      if (filters.medium.length && !filters.medium.includes(w.medium)) return false;
      if (filters.availability.length && !filters.availability.includes(w.status)) return false;
      if (filters.orientation.length && !filters.orientation.includes(w.orientation)) return false;
      if (filters.size.length && !filters.size.includes(w.size)) return false;
      if (filters.dominantColor.length && !filters.dominantColor.includes(w.dominantColor)) return false;
      return true;
    });
  }, [filters]);

  return (
    <Layout>
      <div className="pt-28 md:pt-36 pb-24 md:pb-36 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-12 md:mb-16"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5">
              Complete Archive
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">
              All Works
            </h1>
            <p className="mt-4 text-[11px] md:text-xs tracking-[0.04em] text-muted-foreground max-w-md">
              A comprehensive view of the body of work — paintings, drawings and mixed media spanning two decades.
            </p>
          </motion.div>

          {/* Mobile filter toggle */}
          <div className="md:hidden mb-8">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 border border-border px-4 py-2.5"
            >
              <SlidersHorizontal className="w-3 h-3" />
              Filter{activeCount > 0 && ` (${activeCount})`}
            </button>
          </div>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-foreground/20 z-40 md:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "tween", duration: 0.35 }}
                  className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border max-h-[80vh] overflow-y-auto px-6 py-6 md:hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                      Filter
                    </span>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <FilterContent
                    filters={filters}
                    toggleFilter={toggleFilter}
                    clearAll={clearAll}
                    activeCount={activeCount}
                  />
                  <div className="mt-6 pt-4 border-t border-border">
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full text-center text-[10px] tracking-[0.2em] uppercase bg-foreground text-background py-3 hover:bg-foreground/90 transition-colors duration-300"
                    >
                      Show {filtered.length} {filtered.length === 1 ? "work" : "works"}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Desktop: sidebar + grid */}
          <div className="flex gap-12 lg:gap-16">
            {/* Desktop sidebar */}
            <aside className="hidden md:block w-[200px] lg:w-[220px] flex-shrink-0 sticky top-36 self-start max-h-[calc(100vh-10rem)] overflow-y-auto pr-4">
              <FilterContent
                filters={filters}
                toggleFilter={toggleFilter}
                clearAll={clearAll}
                activeCount={activeCount}
              />
            </aside>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {/* Result count */}
              <div className="mb-8 flex items-baseline justify-between">
                <p className="text-[10px] tracking-[0.15em] text-muted-foreground">
                  {filtered.length} {filtered.length === 1 ? "work" : "works"}
                </p>
              </div>

              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-sm text-muted-foreground">No works match the current filters.</p>
                  <button
                    onClick={clearAll}
                    className="mt-4 text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
                  {filtered.map((work, i) => (
                    <motion.div
                      key={work.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.45, delay: 0.04 * (i % 3) }}
                    >
                      <Link to={`/works/${work.id}`} className="group block">
                        <div
                          className={`w-full transition-opacity duration-500 group-hover:opacity-90 ${
                            work.orientation === "landscape"
                              ? "aspect-[5/4]"
                              : work.orientation === "square"
                              ? "aspect-square"
                              : "aspect-[4/5]"
                          }`}
                          style={{ background: work.gradient }}
                        />
                        <div className="mt-3.5">
                          <div className="flex items-baseline gap-1">
                            <StatusDot status={work.status} />
                            <p className="font-serif text-sm md:text-base tracking-[0.01em] group-hover:text-foreground/70 transition-colors duration-300">
                              {work.title}
                            </p>
                          </div>
                          <p className="text-[9px] md:text-[10px] tracking-[0.06em] text-muted-foreground mt-1.5">
                            {work.medium}, {work.year}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllWorks;

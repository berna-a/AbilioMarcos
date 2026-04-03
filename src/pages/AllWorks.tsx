import Layout from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { getPublishedArtworks } from "@/lib/artworks";
import { Artwork } from "@/lib/types";

const FilterSection = ({
  title, options, selected, onToggle,
}: {
  title: string;
  options: { label: string; value: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left group">
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground group-hover:text-foreground transition-colors duration-300">{title}</span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="mt-3 space-y-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onToggle(opt.value)}
                  className={`block w-full text-left py-1 text-[11px] tracking-[0.03em] transition-colors duration-300 ${selected.includes(opt.value) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AllWorks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string[]>>({ medium: [], availability: [] });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    getPublishedArtworks().then((data) => {
      setArtworks(data);
      setLoading(false);
    });
  }, []);

  const toggleFilter = (group: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [group]: prev[group].includes(value) ? prev[group].filter((v) => v !== value) : [...prev[group], value],
    }));
  };

  const clearAll = () => setFilters({ medium: [], availability: [] });
  const activeCount = Object.values(filters).flat().length;

  const mediums = useMemo(() => [...new Set(artworks.map((a) => a.medium).filter(Boolean))], [artworks]);

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      if (filters.medium.length && !filters.medium.includes(a.medium)) return false;
      if (filters.availability.length && !filters.availability.includes(a.availability)) return false;
      return true;
    });
  }, [artworks, filters]);

  const filterContent = (
    <div>
      <div className="flex items-center justify-between mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Filter</span>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-[10px] tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors duration-300 underline underline-offset-2">Clear all</button>
        )}
      </div>
      {mediums.length > 0 && (
        <FilterSection
          title="Medium"
          options={mediums.map((m) => ({ label: m, value: m }))}
          selected={filters.medium}
          onToggle={(v) => toggleFilter("medium", v)}
        />
      )}
      <FilterSection
        title="Availability"
        options={[
          { label: "Available", value: "available" },
          { label: "Sold", value: "sold" },
          { label: "Not for Sale", value: "not_for_sale" },
        ]}
        selected={filters.availability}
        onToggle={(v) => toggleFilter("availability", v)}
      />
    </div>
  );

  return (
    <Layout>
      <div className="pt-28 md:pt-36 pb-24 md:pb-36 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12 md:mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5">Complete Archive</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">All Works</h1>
            <p className="mt-4 text-[11px] md:text-xs tracking-[0.04em] text-muted-foreground max-w-md">
              A comprehensive view of the body of work — paintings, drawings and mixed media spanning two decades.
            </p>
          </motion.div>

          {/* Mobile filter toggle */}
          <div className="md:hidden mb-8">
            <button onClick={() => setMobileFiltersOpen(true)} className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 border border-border px-4 py-2.5">
              <SlidersHorizontal className="w-3 h-3" />
              Filter{activeCount > 0 && ` (${activeCount})`}
            </button>
          </div>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/20 z-40 md:hidden" onClick={() => setMobileFiltersOpen(false)} />
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "tween", duration: 0.35 }} className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border max-h-[80vh] overflow-y-auto px-6 py-6 md:hidden">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Filter</span>
                    <button onClick={() => setMobileFiltersOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                  {filterContent}
                  <div className="mt-6 pt-4 border-t border-border">
                    <button onClick={() => setMobileFiltersOpen(false)} className="w-full text-center text-[10px] tracking-[0.2em] uppercase bg-foreground text-background py-3 hover:bg-foreground/90 transition-colors duration-300">
                      Show {filtered.length} {filtered.length === 1 ? "work" : "works"}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="flex gap-12 lg:gap-16">
            <aside className="hidden md:block w-[200px] lg:w-[220px] flex-shrink-0 sticky top-36 self-start max-h-[calc(100vh-10rem)] overflow-y-auto pr-4">
              {filterContent}
            </aside>

            <div className="flex-1 min-w-0">
              <div className="mb-8 flex items-baseline justify-between">
                <p className="text-[10px] tracking-[0.15em] text-muted-foreground">
                  {loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "work" : "works"}`}
                </p>
              </div>

              {!loading && filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-sm text-muted-foreground">No works match the current filters.</p>
                  {activeCount > 0 && (
                    <button onClick={clearAll} className="mt-4 text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">Clear filters</button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
                  {filtered.map((work, i) => (
                    <motion.div key={work.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.45, delay: 0.04 * (i % 3) }}>
                      <Link to={`/artwork/${work.slug}`} className="group block">
                        {work.primary_image_url ? (
                          <img src={work.primary_image_url} alt={work.title} className="w-full aspect-[4/5] object-cover transition-opacity duration-500 group-hover:opacity-90" />
                        ) : (
                          <div className="w-full aspect-[4/5] bg-muted transition-opacity duration-500 group-hover:opacity-90" />
                        )}
                        <div className="mt-3.5">
                          <p className="font-serif text-sm md:text-base tracking-[0.01em] group-hover:text-foreground/70 transition-colors duration-300">{work.title}</p>
                          <p className="text-[9px] md:text-[10px] tracking-[0.06em] text-muted-foreground mt-1.5">{work.medium}, {work.year}</p>
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

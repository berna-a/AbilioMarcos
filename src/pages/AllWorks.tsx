import Layout from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { getPublishedArtworks } from "@/lib/artworks";
import { Artwork, formatPrice, getSizeBucket, getFormat } from "@/lib/types";
import { useT, techniqueLabel } from "@/i18n";
import { track, trackArtwork } from "@/lib/analytics";

type SortOption = 'newest' | 'price_asc' | 'price_desc';

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
        <span className="text-[12px] tracking-[0.25em] uppercase text-muted-foreground group-hover:text-foreground transition-colors duration-300">{title}</span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="mt-3 space-y-1">
              {options.map((opt) => (
                <button key={opt.value} onClick={() => onToggle(opt.value)} className={`block w-full text-left py-1 text-[13px] tracking-[0.03em] transition-colors duration-300 ${selected.includes(opt.value) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
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
  const [filters, setFilters] = useState<Record<string, string[]>>({ technique: [], format: [], size: [], price: [] });
  const [sort, setSort] = useState<SortOption>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const t = useT();

  useEffect(() => {
    track('all_works_view');
    getPublishedArtworks().then((data) => {
      setArtworks(data);
      setLoading(false);
    });
  }, []);

  const toggleFilter = (group: string, value: string) => {
    track('filter_used', { filter_group: group, filter_value: value });
    setFilters((prev) => ({
      ...prev,
      [group]: prev[group].includes(value) ? prev[group].filter((v) => v !== value) : [...prev[group], value],
    }));
  };

  const clearAll = () => setFilters({ technique: [], format: [], size: [], price: [] });
  const activeCount = Object.values(filters).flat().length;

  // Probe intrinsic image ratios across all artworks so the format filter
  // works even when DB dimensions are missing.
  const ratios = useArtworkRatios(artworks);

  /** Resolve format from real cm dimensions OR from the image aspect ratio.
   *  Square tolerance ±5%. */
  const resolveFormat = (a: Artwork): 'vertical' | 'square' | 'horizontal' | null => {
    const dbFmt = getFormat(a);
    if (dbFmt) return dbFmt;
    const r = ratios[a.id];
    if (!r || !Number.isFinite(r)) return null;
    if (Math.abs(r - 1) <= 0.05) return 'square';
    return r < 1 ? 'vertical' : 'horizontal';
  };

  const filtered = useMemo(() => {
    let result = artworks.filter((a) => {
      if (filters.technique.length) {
        const tech = (a.technique || 'Óleo sobre tela').toString();
        if (!filters.technique.includes(tech)) return false;
      }
      if (filters.format.length) {
        const fmt = resolveFormat(a);
        if (!fmt || !filters.format.includes(fmt)) return false;
      }
      if (filters.size.length) {
        const bucket = getSizeBucket(a);
        if (!bucket || !filters.size.includes(bucket)) return false;
      }
      if (filters.price.length) {
        const match = filters.price.some((p) => {
          if (p === 'under1000') return a.price != null && a.price < 1000;
          if (p === '1000to3000') return a.price != null && a.price >= 1000 && a.price <= 3000;
          if (p === 'above3000') return a.price != null && a.price > 3000;
          if (p === 'on_request') return a.price == null;
          return true;
        });
        if (!match) return false;
      }
      return true;
    });

    // Sort
    result = [...result].sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === 'price_asc') return (a.price ?? Infinity) - (b.price ?? Infinity);
      if (sort === 'price_desc') return (b.price ?? -1) - (a.price ?? -1);
      return 0;
    });

    return result;
  }, [artworks, filters, sort, ratios]);

  const filterContent = (
    <div>
      <div className="flex items-center justify-between mb-8">
        <span className="text-[12px] tracking-[0.3em] uppercase text-muted-foreground">{t.allWorks.filter}</span>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-[12px] tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors duration-300 underline underline-offset-2">{t.allWorks.clearAll}</button>
        )}
      </div>
      <FilterSection
        title={t.allWorks.technique}
        options={[
          { label: t.allWorks.techniqueOil, value: "Óleo sobre tela" },
          { label: t.allWorks.techniqueAcrylic, value: "Acrílico sobre tela" },
          { label: t.allWorks.techniqueMixed, value: "Técnica mista" },
        ]}
        selected={filters.technique}
        onToggle={(v) => toggleFilter("technique", v)}
      />
      <FilterSection
        title={t.allWorks.format}
        options={[
          { label: t.allWorks.vertical, value: "vertical" },
          { label: t.allWorks.square, value: "square" },
          { label: t.allWorks.horizontal, value: "horizontal" },
        ]}
        selected={filters.format}
        onToggle={(v) => toggleFilter("format", v)}
      />
      <FilterSection
        title={t.allWorks.size}
        options={[
          { label: t.allWorks.small, value: "small" },
          { label: t.allWorks.medium, value: "medium" },
          { label: t.allWorks.large, value: "large" },
        ]}
        selected={filters.size}
        onToggle={(v) => toggleFilter("size", v)}
      />
      <FilterSection
        title={t.allWorks.priceRange}
        options={[
          { label: t.allWorks.under1000, value: "under1000" },
          { label: t.allWorks.from1000to3000, value: "1000to3000" },
          { label: t.allWorks.above3000, value: "above3000" },
          { label: t.allWorks.priceOnRequest, value: "on_request" },
        ]}
        selected={filters.price}
        onToggle={(v) => toggleFilter("price", v)}
      />
    </div>
  );

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: t.allWorks.sortNewest, value: 'newest' },
    { label: t.allWorks.sortPriceLow, value: 'price_asc' },
    { label: t.allWorks.sortPriceHigh, value: 'price_desc' },
  ];

  return (
    <Layout>
      <div className="pt-28 md:pt-36 pb-24 md:pb-36 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12 md:mb-16">
            <p className="text-[12px] tracking-[0.3em] uppercase text-muted-foreground mb-5">{t.allWorks.label}</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">{t.allWorks.title}</h1>
            <p className="mt-4 text-[13px] md:text-xs tracking-[0.04em] text-muted-foreground max-w-md">{t.allWorks.description}</p>
          </motion.div>

          <div className="md:hidden mb-8">
            <button onClick={() => setMobileFiltersOpen(true)} className="flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 border border-border px-4 py-2.5">
              <SlidersHorizontal className="w-3 h-3" />
              {t.allWorks.filter}{activeCount > 0 && ` (${activeCount})`}
            </button>
          </div>

          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/20 z-40 md:hidden" onClick={() => setMobileFiltersOpen(false)} />
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "tween", duration: 0.35 }} className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border max-h-[80vh] overflow-y-auto px-6 py-6 md:hidden">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[12px] tracking-[0.3em] uppercase text-muted-foreground">{t.allWorks.filter}</span>
                    <button onClick={() => setMobileFiltersOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                  {filterContent}
                  <div className="mt-6 pt-4 border-t border-border">
                    <button onClick={() => setMobileFiltersOpen(false)} className="w-full text-center text-[12px] tracking-[0.2em] uppercase bg-foreground text-background py-3 hover:bg-foreground/90 transition-colors duration-300">
                      {t.allWorks.show} {filtered.length} {filtered.length === 1 ? t.allWorks.work : t.allWorks.works}
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
              <div className="mb-8 flex items-center justify-between">
                <p className="text-[12px] tracking-[0.15em] text-muted-foreground">
                  {loading ? t.allWorks.loading : `${filtered.length} ${filtered.length === 1 ? t.allWorks.work : t.allWorks.works}`}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] tracking-[0.15em] text-muted-foreground hidden sm:inline">{t.allWorks.sort}</span>
                  <select
                    value={sort}
                    onChange={(e) => { const v = e.target.value as SortOption; track('sort_used', { sort_value: v }); setSort(v); }}
                    className="text-[12px] tracking-[0.05em] text-muted-foreground bg-transparent border border-border px-3 py-1.5 focus:outline-none cursor-pointer hover:text-foreground transition-colors"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!loading && filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-sm text-muted-foreground">{t.allWorks.noMatch}</p>
                  {activeCount > 0 && (
                    <button onClick={clearAll} className="mt-4 text-[12px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">{t.allWorks.clearFilters}</button>
                  )}
                </div>
              ) : (
                <MasonryGrid
                  columns={{ base: 2, md: 2, lg: 3, xl: 3 }}
                  gapX={32}
                  gapY={56}
                  items={filtered.map((work, i) => ({
                    key: work.id,
                    ratio: ratios[work.id],
                    render: () => (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ duration: 0.4, delay: 0.03 * (i % 3) }}
                      >
                        <Link
                          to={`/obra/${work.slug}`}
                          className="group block"
                          onClick={() => trackArtwork('artwork_card_click', work)}
                        >
                          <ArtworkPreviewImage artwork={work} hoverZoom />
                          <div className="mt-4 space-y-1">
                            <div className="flex items-baseline justify-between gap-3">
                              <p className="font-serif text-lg md:text-xl tracking-[0.01em] text-brand-brown group-hover:text-brand-red transition-colors duration-300 truncate">
                                {work.title}
                              </p>
                              {formatPrice(work.price) && (
                                <p className="text-[12px] tracking-[0.04em] text-muted-foreground whitespace-nowrap tabular-nums">
                                  {formatPrice(work.price)}
                                </p>
                              )}
                            </div>
                            <p className="text-[12px] tracking-[0.05em] text-muted-foreground/90 truncate">
                              {techniqueLabel(t, work.technique)}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ),
                  }))}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllWorks;

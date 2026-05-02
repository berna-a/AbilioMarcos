import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecentArtworks } from "@/lib/artworks";
import { useT, techniqueLabel } from "@/i18n";
import { Artwork, formatPrice } from "@/lib/types";

const placeholderWorks: Partial<Artwork>[] = [
  { id: "1", title: "Erosion of Light", slug: "erosion-of-light", primary_image_url: null, technique: null },
  { id: "2", title: "Meridian", slug: "meridian", primary_image_url: null, technique: null },
  { id: "3", title: "Residual Warmth", slug: "residual-warmth", primary_image_url: null, technique: null },
];

const placeholderGradients = [
  "linear-gradient(145deg, hsl(15 35% 35%), hsl(30 45% 55%))",
  "linear-gradient(145deg, hsl(200 25% 30%), hsl(180 20% 50%))",
  "linear-gradient(145deg, hsl(35 50% 40%), hsl(25 40% 60%))",
];

const FeaturedWorks = () => {
  const [works, setWorks] = useState<Partial<Artwork>[]>(placeholderWorks);
  const [hasReal, setHasReal] = useState(false);
  const t = useT();

  useEffect(() => {
    getRecentArtworks(6).then((data) => {
      if (data.length > 0) {
        setWorks(data);
        setHasReal(true);
      }
    });
  }, []);

  const getLink = (work: Partial<Artwork>) =>
    work.slug ? `/obra/${work.slug}` : `/obra/${work.id}`;

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mb-12 md:mb-16 flex items-end justify-between gap-6"
      >
        <div>
          <p className="text-[12px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
            {t.featured.label}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-tight">
            {t.featured.title}
          </h2>
        </div>
        <Link
          to="/obras"
          className="hidden md:inline-block text-[12px] tracking-[0.25em] uppercase text-foreground/60 hover:text-foreground border-b border-foreground/20 hover:border-foreground/50 pb-1 transition-all duration-300 whitespace-nowrap"
        >
          {t.featured.viewAll}
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {works.map((work, i) => (
          <motion.div
            key={String(work.id ?? i)}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.05 * (i % 3) }}
          >
            <Link to={getLink(work)} className="group block">
              <div className="relative w-full overflow-hidden bg-muted" style={{ aspectRatio: "4 / 5" }}>
                {hasReal && work.primary_image_url ? (
                  <img
                    src={work.primary_image_url}
                    alt={work.title || ""}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: placeholderGradients[i % placeholderGradients.length] }}
                  />
                )}
              </div>
              <div className="mt-3 space-y-0.5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-serif text-[17px] tracking-[0.01em] text-brand-red truncate">
                    {work.title}
                  </p>
                  {hasReal && formatPrice((work as Artwork).price) && (
                    <p className="text-[12px] tracking-[0.04em] text-muted-foreground whitespace-nowrap tabular-nums">
                      {formatPrice((work as Artwork).price)}
                    </p>
                  )}
                </div>
                {hasReal && (
                  <p className="text-[12px] tracking-[0.05em] text-muted-foreground/90 truncate">
                    {techniqueLabel(t, work.technique)}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-16 md:mt-20 text-center md:hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Link
          to="/obras"
          className="inline-block text-[13px] tracking-[0.25em] uppercase text-foreground/60 hover:text-foreground border-b border-foreground/20 hover:border-foreground/50 pb-1 transition-all duration-300"
        >
          {t.featured.viewAll}
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturedWorks;

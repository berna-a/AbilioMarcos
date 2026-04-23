import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecentArtworks } from "@/lib/artworks";
import { useT, techniqueLabel } from "@/i18n";
import { Artwork } from "@/lib/types";
import ArtworkPreviewImage from "@/components/ArtworkPreviewImage";

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
    getRecentArtworks(3).then((data) => {
      if (data.length > 0) { setWorks(data); setHasReal(true); }
    });
  }, []);

  const getLink = (work: Partial<Artwork>) => work.slug ? `/artwork/${work.slug}` : `/artwork/${work.id}`;

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mb-14 md:mb-18"
      >
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">{t.featured.label}</p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-tight">{t.featured.title}</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
        {works[0] && (
          <motion.div className="md:col-span-7" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7 }}>
            <Link to={getLink(works[0])} className="group block">
              {works[0].primary_image_url ? (
                <img src={works[0].primary_image_url} alt={works[0].title} className="w-full object-cover" style={{ aspectRatio: getRatio(works[0], "4 / 5") }} />
              ) : (
                <div className="w-full" style={{ background: placeholderGradients[0], aspectRatio: "4 / 5" }} />
              )}
              <div className="mt-5">
                <p className="font-serif text-lg md:text-xl tracking-[0.01em] text-brand-brown group-hover:text-brand-red transition-colors duration-300">{works[0].title}</p>
                {hasReal && <p className="text-[11px] tracking-[0.05em] text-muted-foreground mt-1.5">{techniqueLabel(t, works[0].technique)}</p>}
              </div>
            </Link>
          </motion.div>
        )}

        <div className="md:col-span-5 flex flex-col gap-8 md:gap-10">
          {works.slice(1).map((work, i) => (
            <motion.div key={work.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7, delay: 0.1 * (i + 1) }}>
              <Link to={getLink(work)} className="group block">
                {work.primary_image_url ? (
                  <img src={work.primary_image_url} alt={work.title} className="w-full object-cover" style={{ aspectRatio: getRatio(work, "3 / 2") }} />
                ) : (
                  <div className="w-full" style={{ background: placeholderGradients[i + 1] || placeholderGradients[0], aspectRatio: "3 / 2" }} />
                )}
                <div className="mt-5">
                  <p className="font-serif text-lg tracking-[0.01em] text-brand-brown group-hover:text-brand-red transition-colors duration-300">{work.title}</p>
                  {hasReal && <p className="text-[11px] tracking-[0.05em] text-muted-foreground mt-1.5">{techniqueLabel(t, work.technique)}</p>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div className="mt-20 md:mt-24 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
        <Link to="/works" className="inline-block text-[11px] tracking-[0.25em] uppercase text-foreground/60 hover:text-foreground border-b border-foreground/20 hover:border-foreground/50 pb-1 transition-all duration-300">
          {t.featured.viewAll}
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturedWorks;

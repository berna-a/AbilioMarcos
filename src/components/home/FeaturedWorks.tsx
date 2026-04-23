import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFeaturedArtworks } from "@/lib/artworks";
import { useT, techniqueLabel } from "@/i18n";

const placeholderWorks = [
  { id: "1", title: "Erosion of Light", slug: "erosion-of-light", gradient: "linear-gradient(145deg, hsl(15 35% 35%), hsl(30 45% 55%))", primary_image_url: null, technique: null },
  { id: "2", title: "Meridian", slug: "meridian", gradient: "linear-gradient(145deg, hsl(200 25% 30%), hsl(180 20% 50%))", primary_image_url: null, technique: null },
  { id: "3", title: "Residual Warmth", slug: "residual-warmth", gradient: "linear-gradient(145deg, hsl(35 50% 40%), hsl(25 40% 60%))", primary_image_url: null, technique: null },
];

const FeaturedWorks = () => {
  const [works, setWorks] = useState<any[]>(placeholderWorks);
  const t = useT();

  useEffect(() => {
    getFeaturedArtworks().then((data) => {
      if (data.length > 0) setWorks(data.slice(0, 3));
    });
  }, []);

  const getLink = (work: any) => work.slug ? `/artwork/${work.slug}` : `/artwork/${work.id}`;
  const getImage = (work: any) => work.primary_image_url;
  const getGradient = (work: any) => work.gradient || "linear-gradient(145deg, hsl(30 20% 30%), hsl(35 25% 45%))";

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
        {works[0] && (() => {
          const w = works[0].width_cm ?? works[0].custom_width_cm;
          const h = works[0].height_cm ?? works[0].custom_height_cm;
          const ratio = w && h ? `${Number(w)} / ${Number(h)}` : "4 / 5";
          return (
            <motion.div className="md:col-span-7" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7 }}>
              <Link to={getLink(works[0])} className="group block">
                {getImage(works[0]) ? (
                  <img src={getImage(works[0])} alt={works[0].title} className="w-full object-cover" style={{ aspectRatio: ratio }} />
                ) : (
                  <div className="w-full" style={{ background: getGradient(works[0]), aspectRatio: ratio }} />
                )}
                <div className="mt-5">
                  <p className="font-serif text-lg md:text-xl tracking-[0.01em] text-brand-brown group-hover:text-brand-red transition-colors duration-300">{works[0].title}</p>
                  <p className="text-[11px] tracking-[0.05em] text-muted-foreground mt-1.5">{techniqueLabel(t, works[0].technique)}</p>
                </div>
              </Link>
            </motion.div>
          );
        })()}

        <div className="md:col-span-5 flex flex-col gap-8 md:gap-10">
          {works.slice(1).map((work, i) => {
            const w = work.width_cm ?? work.custom_width_cm;
            const h = work.height_cm ?? work.custom_height_cm;
            const ratio = w && h ? `${Number(w)} / ${Number(h)}` : "3 / 2";
            return (
              <motion.div key={work.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7, delay: 0.1 * (i + 1) }}>
                <Link to={getLink(work)} className="group block">
                  {getImage(work) ? (
                    <img src={getImage(work)} alt={work.title} className="w-full object-cover" style={{ aspectRatio: ratio }} />
                  ) : (
                    <div className="w-full" style={{ background: getGradient(work), aspectRatio: ratio }} />
                  )}
                  <div className="mt-5">
                    <p className="font-serif text-lg tracking-[0.01em] text-brand-brown group-hover:text-brand-red transition-colors duration-300">{work.title}</p>
                    <p className="text-[11px] tracking-[0.05em] text-muted-foreground mt-1.5">{techniqueLabel(t, work.technique)}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div className="mt-20 md:mt-24 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
        <Link to="/selected-works" className="inline-block text-[11px] tracking-[0.25em] uppercase text-foreground/60 hover:text-foreground border-b border-foreground/20 hover:border-foreground/50 pb-1 transition-all duration-300">
          {t.featured.viewSelected}
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturedWorks;

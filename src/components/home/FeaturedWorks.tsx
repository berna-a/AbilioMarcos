import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFeaturedArtworks } from "@/lib/artworks";
import { MEDIUM_DISPLAY } from "@/lib/types";
import { useT } from "@/i18n";

const placeholderWorks = [
  { id: "1", title: "Erosion of Light", year: 2024, slug: "erosion-of-light", gradient: "linear-gradient(145deg, hsl(15 35% 35%), hsl(30 45% 55%))", primary_image_url: null },
  { id: "2", title: "Meridian", year: 2023, slug: "meridian", gradient: "linear-gradient(145deg, hsl(200 25% 30%), hsl(180 20% 50%))", primary_image_url: null },
  { id: "3", title: "Residual Warmth", year: 2024, slug: "residual-warmth", gradient: "linear-gradient(145deg, hsl(35 50% 40%), hsl(25 40% 60%))", primary_image_url: null },
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
        {works[0] && (
          <motion.div className="md:col-span-7" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7 }}>
            <Link to={getLink(works[0])} className="group block">
              {getImage(works[0]) ? (
                <img src={getImage(works[0])} alt={works[0].title} className="aspect-[4/5] w-full object-cover" />
              ) : (
                <div className="aspect-[4/5] w-full" style={{ background: getGradient(works[0]) }} />
              )}
              <div className="mt-5 flex justify-between items-baseline">
                <div>
                  <p className="font-serif text-lg md:text-xl tracking-[0.01em]">{works[0].title}</p>
                  <p className="text-[11px] tracking-[0.05em] text-muted-foreground mt-1.5">{MEDIUM_DISPLAY}</p>
                </div>
                <p className="text-[11px] tracking-[0.05em] text-muted-foreground">{works[0].year}</p>
              </div>
            </Link>
          </motion.div>
        )}

        <div className="md:col-span-5 flex flex-col gap-8 md:gap-10">
          {works.slice(1).map((work, i) => (
            <motion.div key={work.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7, delay: 0.1 * (i + 1) }}>
              <Link to={getLink(work)} className="group block">
                {getImage(work) ? (
                  <img src={getImage(work)} alt={work.title} className="aspect-[3/2] w-full object-cover" />
                ) : (
                  <div className="aspect-[3/2] w-full" style={{ background: getGradient(work) }} />
                )}
                <div className="mt-5 flex justify-between items-baseline">
                  <div>
                    <p className="font-serif text-lg tracking-[0.01em]">{work.title}</p>
                    <p className="text-[11px] tracking-[0.05em] text-muted-foreground mt-1.5">{MEDIUM_DISPLAY}</p>
                  </div>
                  <p className="text-[11px] tracking-[0.05em] text-muted-foreground">{work.year}</p>
                </div>
              </Link>
            </motion.div>
          ))}
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

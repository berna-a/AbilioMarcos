import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSelectedArtworks } from "@/lib/artworks";
import { Artwork, formatPrice } from "@/lib/types";
import { useT, techniqueLabel } from "@/i18n";
import ArtworkHoverZoom from "@/components/ArtworkHoverZoom";
import { track, trackArtwork } from "@/lib/analytics";

const SelectedWorks = () => {
  const [works, setWorks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useT();

  useEffect(() => {
    track('selected_works_view');
    getSelectedArtworks().then((data) => {
      setWorks(data);
      setLoading(false);
    });
  }, []);

  const naturalRatio = (work: Artwork): string | undefined => {
    const w = work.width_cm ?? work.custom_width_cm;
    const h = work.height_cm ?? work.custom_height_cm;
    return w && h ? `${Number(w)} / ${Number(h)}` : undefined;
  };

  const WorkCard = ({ work, aspect }: { work: Artwork; aspect: string }) => {
    const ratio = naturalRatio(work) || aspect.replace("/", " / ");
    return (
      <Link to={`/artwork/${work.slug}`} className="group block" onClick={() => trackArtwork('artwork_card_click', work)}>
        {work.primary_image_url ? (
          <ArtworkHoverZoom src={work.primary_image_url} alt={work.title} ratio={ratio} />
        ) : (
          <div className="w-full bg-muted" style={{ aspectRatio: ratio }} />
        )}
        <div className="mt-4 md:mt-5 flex justify-between items-baseline gap-4">
          <div>
            <p className="font-serif text-base md:text-lg tracking-[0.01em] text-brand-brown group-hover:text-brand-red transition-colors duration-300">{work.title}</p>
            <p className="text-[10px] md:text-[11px] tracking-[0.06em] text-muted-foreground mt-1.5">{techniqueLabel(t, work.technique)}</p>
          </div>
          {formatPrice(work.price) && (
            <p className="text-[10px] md:text-[11px] tracking-[0.08em] text-muted-foreground/70 whitespace-nowrap font-light">{formatPrice(work.price)}</p>
          )}
        </div>
      </Link>
    );
  };

  return (
    <Layout>
      <div className="pt-28 md:pt-36 pb-24 md:pb-36 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-20 md:mb-28 max-w-2xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5">{t.selectedWorks.label}</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-[1.15]">{t.selectedWorks.title}</h1>
            <p className="mt-6 text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-lg font-light">{t.selectedWorks.description}</p>
          </motion.div>

          {loading ? (
            <p className="text-[13px] text-muted-foreground text-center py-20">{t.selectedWorks.loading}</p>
          ) : works.length === 0 ? (
            <p className="text-[13px] text-muted-foreground text-center py-20">{t.selectedWorks.empty}</p>
          ) : (
            <>
              {works[0] && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                  <motion.div className="md:col-span-8" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
                    <WorkCard work={works[0]} aspect="4/5" />
                  </motion.div>
                  {works.length > 1 && (
                    <div className="md:col-span-4 flex flex-col gap-6 md:gap-8 md:pt-16">
                      {works.slice(1, 3).map((work, i) => (
                        <motion.div key={work.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}>
                          <WorkCard work={work} aspect={i === 0 ? "3/4" : "1/1"} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {works[3] && (
                <>
                  <div className="my-20 md:my-32" />
                  <motion.div className="max-w-[1100px] mx-auto" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
                    <WorkCard work={works[3]} aspect="16/9" />
                  </motion.div>
                </>
              )}

              {works.length > 4 && (
                <>
                  <div className="my-20 md:my-32" />
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                    {works.slice(4, 6).map((work, i) => (
                      <motion.div key={work.id} className={i === 0 ? "md:col-span-5 md:col-start-2" : "md:col-span-5 md:pt-24"} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.1 * i }}>
                        <WorkCard work={work} aspect={i === 0 ? "4/5" : "3/2"} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {works.length > 6 && (
                <>
                  <div className="my-20 md:my-32" />
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                    {works.slice(6, 8).map((work, i) => (
                      <motion.div key={work.id} className={i === 0 ? "md:col-span-7" : "md:col-span-4 md:col-start-9 flex items-end"} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.1 * i }}>
                        <WorkCard work={work} aspect={i === 0 ? "4/5" : "3/4"} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          <motion.div className="mt-24 md:mt-36 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
            <Link to="/works" className="inline-block text-[10px] tracking-[0.25em] uppercase text-foreground/50 hover:text-foreground border-b border-foreground/15 hover:border-foreground/40 pb-1 transition-all duration-300">
              {t.selectedWorks.viewAll}
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectedWorks;

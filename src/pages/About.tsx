import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";

const exhibitions = [
  {
    year: "2024",
    entries: [
      "Solo Exhibition — Gallery Name, Lisbon",
      "International Art Fair, London",
    ],
  },
  {
    year: "2023",
    entries: [
      "Group Exhibition — Contemporary Art Space, Berlin",
      "Art Fair, Paris",
      "Two-Person Show — Gallery, Porto",
    ],
  },
  {
    year: "2022",
    entries: [
      "Solo Exhibition — Gallery Name, Lisbon",
      "International Biennale, Location",
    ],
  },
];

const About = () => {
  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-24 md:pb-36 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-24"
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
              About the Artist
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1]">
              Abílio Marcos
            </h1>
          </motion.div>

          {/* ── Biography ── */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-24 md:mb-32">
            <motion.div
              className="md:col-span-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div
                className="aspect-[3/4] w-full"
                style={{
                  background:
                    "linear-gradient(145deg, hsl(30 15% 40%), hsl(35 20% 55%))",
                }}
              />
              <p className="mt-3 text-[11px] text-muted-foreground">
                Abílio Marcos in his studio, Lisbon.
              </p>
            </motion.div>

            <motion.div
              className="md:col-span-7"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-6 pb-3 border-b border-gallery-border">
                Biography
              </p>
              <div className="space-y-6 text-[14px] text-muted-foreground leading-[1.85] max-w-xl">
                <p>
                  Abílio Marcos is a Portuguese abstract-expressionist painter whose work explores the
                  intersection of gesture, memory, and chromatic intensity. Working primarily in oil and
                  mixed media on large-scale canvases, his practice is rooted in the belief that painting
                  is an act of both discipline and surrender.
                </p>
                <p>
                  Born in Portugal, Marcos developed his visual language through years of sustained studio
                  practice, drawing influence from the emotional directness of Abstract Expressionism and
                  the material richness of European painting traditions.
                </p>
                <p>
                  His work has been exhibited internationally across galleries and art fairs in Lisbon,
                  London, Berlin, and beyond. Paintings by Marcos are held in private collections across
                  Europe and North America.
                </p>
                <p>
                  Marcos lives and works between Lisbon and his rural studio in the Portuguese countryside,
                  where the landscape, light, and solitude inform the emotional core of his paintings.
                </p>
              </div>
            </motion.div>
          </section>

          {/* ── Artist Statement ── */}
          <motion.section
            className="mb-24 md:mb-32 max-w-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-6 pb-3 border-b border-gallery-border">
              Artist Statement
            </p>
            <blockquote className="font-serif text-xl md:text-2xl lg:text-[1.7rem] font-light leading-[1.6] text-foreground/80 italic">
              "Each painting begins as an argument between control and chaos. I am interested in the
              moment when the surface takes over — when the work decides its own resolution. The
              canvas remembers what the hand forgets."
            </blockquote>
            <p className="mt-6 text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
              — Abílio Marcos
            </p>
          </motion.section>

          {/* ── Press & Recognition ── */}
          <motion.section
            className="mb-24 md:mb-32 max-w-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-6 pb-3 border-b border-gallery-border">
              Press &amp; Recognition
            </p>
            <div className="space-y-5">
              {[
                {
                  source: "Art Review",
                  quote:
                    '"Marcos brings a rare emotional intelligence to contemporary abstraction."',
                },
                {
                  source: "Contemporânea Magazine",
                  quote:
                    '"A painter whose work demands physical presence — reproductions cannot capture the scale of feeling."',
                },
              ].map((item) => (
                <div key={item.source}>
                  <p className="text-[14px] text-muted-foreground leading-[1.7] italic">
                    {item.quote}
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.1em] uppercase text-muted-foreground/60">
                    {item.source}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Exhibitions / CV ── */}
          <motion.section
            className="mb-24 md:mb-32 max-w-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8 pb-3 border-b border-gallery-border">
              Selected Exhibitions
            </p>
            <div className="space-y-10">
              {exhibitions.map((group) => (
                <div key={group.year} className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 md:col-span-2">
                    <p className="text-sm font-light text-foreground/70">
                      {group.year}
                    </p>
                  </div>
                  <div className="col-span-9 md:col-span-10 space-y-2">
                    {group.entries.map((entry) => (
                      <p
                        key={entry}
                        className="text-[14px] text-muted-foreground leading-[1.7]"
                      >
                        {entry}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Collections ── */}
          <motion.section
            className="max-w-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-6 pb-3 border-b border-gallery-border">
              Selected Collections
            </p>
            <p className="text-[14px] text-muted-foreground leading-[1.7]">
              Private collections in Portugal, United Kingdom, Germany, and the
              United States.
            </p>
          </motion.section>

        </div>
      </div>
    </Layout>
  );
};

export default About;
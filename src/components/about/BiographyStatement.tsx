import { motion } from "framer-motion";

const BiographyStatement = () => (
  <motion.section
    className="mb-24 md:mb-32"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-24 md:mb-32">
      {/* Portrait */}
      <div className="md:col-span-5">
        <div
          className="aspect-[3/4] w-full"
          style={{
            background: "linear-gradient(145deg, hsl(30 15% 40%), hsl(35 20% 55%))",
          }}
        />
        <p className="mt-3 text-[11px] text-muted-foreground">
          Abílio Marcos in his studio, Lisbon.
        </p>
      </div>

      {/* Biography */}
      <div className="md:col-span-7">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6 pb-3 border-b border-gallery-border">
          Biography
        </p>
        <div className="space-y-5 text-[14px] text-muted-foreground leading-[1.85] max-w-xl">
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
      </div>
    </div>

    {/* Artist Statement */}
    <div className="max-w-3xl">
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6 pb-3 border-b border-gallery-border">
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
    </div>
  </motion.section>
);

export default BiographyStatement;

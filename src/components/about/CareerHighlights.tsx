import { motion } from "framer-motion";

const CareerHighlights = () => (
  <motion.section
    className="mb-24 md:mb-32"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.25 }}
  >
    <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-10 pb-3 border-b border-gallery-border">
      A Practice Shaped Over Decades
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-4xl">
      <div>
        <p className="text-[14px] text-muted-foreground leading-[1.85]">
          Marcos's trajectory spans more than twenty years of continuous studio practice.
          From early exhibitions in Lisbon and Porto, his work quickly gained recognition
          within the Portuguese art scene — earning national prizes and the attention of
          curators and collectors who recognised the ambition and emotional depth of
          his painting.
        </p>
      </div>

      <div>
        <p className="text-[14px] text-muted-foreground leading-[1.85]">
          By the mid-2010s, his presence had extended across European capitals — Paris,
          Berlin, London, Basel — through solo presentations, curated group exhibitions
          and international art fairs. His work entered private collections in Switzerland,
          Germany, the United Kingdom and the United States, establishing a quiet but
          consistent international presence.
        </p>
      </div>

      <div>
        <p className="text-[14px] text-muted-foreground leading-[1.85]">
          A mid-career retrospective in 2019 offered a critical survey of fifteen years
          of work, reaffirming Marcos's position as one of the most compelling voices in
          contemporary Portuguese painting. The exhibition was noted for the coherence
          and ambition of a practice built on deep material knowledge and emotional risk.
        </p>
      </div>

      <div>
        <p className="text-[14px] text-muted-foreground leading-[1.85]">
          In recent years, Marcos has continued to expand his visual language through
          new large-scale bodies of work exhibited internationally. His paintings have
          been presented alongside leading European abstractionists and selected for
          curated sections of prominent art fairs, further consolidating a career defined
          by artistic integrity and sustained creative momentum.
        </p>
      </div>
    </div>
  </motion.section>
);

export default CareerHighlights;

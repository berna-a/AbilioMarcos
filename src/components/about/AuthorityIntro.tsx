import { motion } from "framer-motion";

const AuthorityIntro = () => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="mb-20 md:mb-28"
  >
    <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5">
      About the Artist
    </p>
    <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-10">
      Abílio Marcos
    </h1>
    <div className="max-w-3xl space-y-5">
      <p className="font-serif text-lg md:text-xl lg:text-[1.35rem] font-light leading-[1.6] text-foreground/70">
        For over two decades, Abílio Marcos has pursued a singular and uncompromising vision
        within contemporary abstract painting. His work — expansive in scale, visceral in
        gesture, and rooted in deep chromatic intelligence — has placed him among the most
        respected voices in Portuguese contemporary art.
      </p>
      <p className="font-serif text-lg md:text-xl lg:text-[1.35rem] font-light leading-[1.6] text-foreground/55">
        Exhibited across Europe and collected internationally, Marcos brings to the canvas a rare
        combination of physical intensity and meditative restraint — a practice shaped by decades
        of sustained commitment to the act of painting itself.
      </p>
    </div>
  </motion.section>
);

export default AuthorityIntro;

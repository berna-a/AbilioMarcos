import { motion } from "framer-motion";

const AuthorityIntro = () => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="mb-20 md:mb-28"
  >
    {/* Artist statement as poetic opening — no label */}
    <blockquote className="font-serif text-xl md:text-2xl lg:text-[1.65rem] font-light leading-[1.55] text-foreground/60 italic max-w-3xl mb-12">
      "Each painting begins as an argument between control and chaos. I am interested in the
      moment when the surface takes over — when the work decides its own resolution. The
      canvas remembers what the hand forgets."
    </blockquote>

    {/* Artist name */}
    <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5">
      About the Artist
    </p>
    <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05]">
      Abílio Marcos
    </h1>
  </motion.section>
);

export default AuthorityIntro;

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
    <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-8">
      Abílio Marcos
    </h1>
    <p className="font-serif text-lg md:text-xl lg:text-[1.35rem] font-light leading-[1.6] text-foreground/70 max-w-2xl">
      Portuguese abstract-expressionist painter with over two decades of international exhibition
      history, whose work is held in private collections across Europe and North America.
    </p>
  </motion.section>
);

export default AuthorityIntro;

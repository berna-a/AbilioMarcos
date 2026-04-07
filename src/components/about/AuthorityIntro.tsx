import { motion } from "framer-motion";
import { useT } from "@/i18n";

const AuthorityIntro = () => {
  const t = useT();
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-20 md:mb-28">
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5">{t.aboutPage.aboutArtist}</p>
      <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-12">Abílio Marcos</h1>
      <blockquote className="font-serif text-xl md:text-2xl lg:text-[1.65rem] font-light leading-[1.55] text-foreground/60 italic max-w-3xl">{t.aboutPage.quote}</blockquote>
    </motion.section>
  );
};

export default AuthorityIntro;

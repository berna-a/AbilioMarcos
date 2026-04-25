import { motion } from "framer-motion";
import { useT } from "@/i18n";

const StatementSection = () => {
  const t = useT();

  return (
    <section className="py-28 md:py-36 px-6 md:px-10 border-t border-gallery-border">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div className="mb-10 md:mb-12 flex justify-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
          <div className="w-8 h-px bg-foreground/15" />
        </motion.div>

        <motion.blockquote
          className="font-serif text-[1.65rem] md:text-[2rem] lg:text-[2.4rem] font-light leading-[1.5] italic text-foreground/90"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
        >
          {t.statement.quote}
        </motion.blockquote>

        <motion.p className="mt-10 md:mt-12 text-[12px] tracking-[0.35em] uppercase text-muted-foreground" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}>
          Abílio Marcos
        </motion.p>
      </div>
    </section>
  );
};

export default StatementSection;

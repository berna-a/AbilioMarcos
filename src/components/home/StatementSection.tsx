import { motion } from "framer-motion";

const StatementSection = () => {
  return (
    <section className="py-20 md:py-30 px-6 md:px-10 border-t border-gallery-border">
      <div className="max-w-3xl mx-auto text-center">
        <motion.blockquote
          className="font-serif text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed italic text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          "I paint to make visible what lives beneath the surface — 
          the tension between control and surrender, between what we remember and what we feel."
        </motion.blockquote>

        <motion.p
          className="mt-8 text-xs tracking-[0.2em] uppercase text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          — Abílio Marcos
        </motion.p>
      </div>
    </section>
  );
};

export default StatementSection;
import { motion } from "framer-motion";

const authorityItems = [
  "Private Collections, Lisbon",
  "Contemporary Art Fair, London",
  "Gallery Exhibition, Berlin",
  "International Art Biennale",
];

const AuthorityStrip = () => {
  return (
    <section className="py-16 md:py-20 px-6 md:px-10 border-t border-gallery-border">
      <div className="max-w-[1400px] mx-auto">
        <motion.p
          className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-8 md:mb-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          In Collections & Exhibitions
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-x-12 md:gap-x-16 gap-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {authorityItems.map((item) => (
            <span
              key={item}
              className="text-[13px] md:text-sm text-foreground/45 font-light tracking-[0.02em]"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AuthorityStrip;

import { motion } from "framer-motion";

const authorityItems = [
  "Private Collections, Lisbon",
  "Contemporary Art Fair, London",
  "Gallery Exhibition, Berlin",
  "International Art Biennale",
];

const AuthorityStrip = () => {
  return (
    <section className="py-12 md:py-16 px-6 md:px-10 border-t border-gallery-border">
      <div className="max-w-[1400px] mx-auto">
        <motion.p
          className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          In Collections & Exhibitions
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-x-10 gap-y-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {authorityItems.map((item) => (
            <span
              key={item}
              className="text-sm text-muted-foreground font-light"
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
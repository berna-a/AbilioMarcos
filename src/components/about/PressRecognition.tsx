import { motion } from "framer-motion";

const press = [
  {
    source: "Art Review",
    quote: "Marcos brings a rare emotional intelligence to contemporary abstraction.",
  },
  {
    source: "Contemporânea Magazine",
    quote:
      "A painter whose work demands physical presence — reproductions cannot capture the scale of feeling.",
  },
  {
    source: "Frieze",
    quote:
      "Among the most compelling voices in contemporary Portuguese painting.",
  },
];

const PressRecognition = () => (
  <motion.section
    className="mb-24 md:mb-32 max-w-3xl"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.35 }}
  >
    <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-12 pb-3 border-b border-gallery-border">
      Press &amp; Critical Recognition
    </p>
    <div className="space-y-12">
      {press.map((item) => (
        <div key={item.source}>
          <blockquote className="font-serif text-xl md:text-2xl font-light leading-[1.55] text-foreground/75 italic">
            "{item.quote}"
          </blockquote>
          <p className="mt-4 text-[11px] tracking-[0.2em] uppercase text-muted-foreground/50">
            — {item.source}
          </p>
        </div>
      ))}
    </div>
  </motion.section>
);

export default PressRecognition;

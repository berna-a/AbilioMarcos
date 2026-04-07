import { motion } from "framer-motion";
import { useT } from "@/i18n";

const press = [
  { source: "Art Review", quote: "Marcos brings a rare emotional intelligence to contemporary abstraction." },
  { source: "Contemporânea Magazine", quote: "A painter whose work demands physical presence — reproductions cannot capture the scale of feeling." },
  { source: "Frieze", quote: "Among the most compelling voices in contemporary Portuguese painting." },
];

const PressRecognition = () => {
  const t = useT();
  return (
    <motion.section className="mb-24 md:mb-32 max-w-3xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-14 pb-3 border-b border-gallery-border">{t.aboutPage.pressTitle}</p>
      <div className="space-y-14">
        {press.map((item) => (
          <div key={item.source}>
            <blockquote className="font-serif text-[1.35rem] md:text-2xl font-light leading-[1.5] text-foreground/80 italic">"{item.quote}"</blockquote>
            <p className="mt-5 text-[11px] tracking-[0.2em] uppercase text-muted-foreground/50">— {item.source}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default PressRecognition;

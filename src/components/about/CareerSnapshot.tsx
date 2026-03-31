import { motion } from "framer-motion";

const indicators = [
  { label: "Years of Practice", value: "20+" },
  { label: "Solo Exhibitions", value: "12" },
  { label: "Group Exhibitions", value: "30+" },
  { label: "Countries Exhibited", value: "8" },
  { label: "Private Collections", value: "40+" },
];

const CareerSnapshot = () => (
  <motion.section
    className="mb-24 md:mb-32"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6, delay: 0.15 }}
  >
    <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-10 pb-3 border-b border-gallery-border">
      Career Overview
    </p>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-6">
      {indicators.map((item) => (
        <div key={item.label}>
          <p className="font-serif text-3xl md:text-4xl font-light text-foreground leading-none mb-2">
            {item.value}
          </p>
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  </motion.section>
);

export default CareerSnapshot;

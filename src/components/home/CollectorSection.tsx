import { motion } from "framer-motion";
import CollectorSignup from "@/components/CollectorSignup";
import { useT } from "@/i18n";

const CollectorSection = () => {
  const t = useT();

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 border-t border-gallery-border">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-20">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }} className="flex-1">
          <CollectorSignup variant="inline" />
        </motion.div>

        <motion.div className="flex-1 max-w-sm" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: 0.15 }}>
          <p className="text-[13px] text-muted-foreground leading-[1.8]">
            {t.collector.sideNote}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CollectorSection;

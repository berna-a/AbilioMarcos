import { motion } from "framer-motion";
import CollectorSignup from "@/components/CollectorSignup";

const CollectorSection = () => {
  return (
    <section className="py-20 md:py-30 px-6 md:px-10 bg-gallery-warm">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <CollectorSignup variant="inline" />
        </motion.div>

        <motion.div
          className="flex-1 max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            Collectors receive advance previews of new bodies of work, 
            studio notes on process and inspiration, and priority access 
            to available pieces before public release.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CollectorSection;
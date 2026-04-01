import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const allWorks = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  title: `Work ${i + 1}`,
  year: 2024 - Math.floor(i / 4),
  medium: i % 2 === 0 ? "Oil on canvas" : "Acrylic & mixed media",
  gradient: `linear-gradient(${135 + i * 12}deg, hsl(${15 + i * 18} ${25 + i * 4}% ${25 + i * 3}%), hsl(${30 + i * 12} ${35 + i * 3}% ${40 + i * 3}%))`,
}));

const AllWorks = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-36 pb-24 md:pb-36 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16 md:mb-20"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5">
              Archive
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">
              All Works
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {allWorks.map((work, i) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.05 * (i % 3) }}
              >
                <Link to={`/works/${work.id}`} className="group block">
                  <div
                    className="w-full aspect-[4/5] transition-opacity duration-500 group-hover:opacity-90"
                    style={{ background: work.gradient }}
                  />
                  <div className="mt-4 flex justify-between items-baseline gap-4">
                    <div>
                      <p className="font-serif text-base md:text-lg tracking-[0.01em] group-hover:text-foreground/70 transition-colors duration-300">
                        {work.title}
                      </p>
                      <p className="text-[10px] md:text-[11px] tracking-[0.06em] text-muted-foreground mt-1.5">
                        {work.medium}
                      </p>
                    </div>
                    <p className="text-[10px] md:text-[11px] tracking-[0.06em] text-muted-foreground whitespace-nowrap">
                      {work.year}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllWorks;

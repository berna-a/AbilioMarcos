import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const placeholder = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  title: `Work ${i + 1}`,
  year: 2024 - Math.floor(i / 3),
  medium: i % 2 === 0 ? "Oil on canvas" : "Acrylic & mixed media",
  gradient: `linear-gradient(${135 + i * 15}deg, hsl(${15 + i * 20} ${30 + i * 5}% ${25 + i * 4}%), hsl(${30 + i * 15} ${40 + i * 3}% ${45 + i * 3}%))`,
}));

const SelectedWorks = () => {
  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-20 md:pb-30 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Curated</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">Selected Works</h1>
          </motion.div>

          {/* Asymmetric editorial grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {placeholder.map((work, i) => {
              // Vary grid spans for editorial feel
              const spans = [7, 5, 5, 7, 12, 6, 6, 7];
              const aspects = ["4/5", "3/4", "3/2", "4/5", "16/9", "1/1", "3/4", "3/2"];
              const span = spans[i % spans.length];
              const aspect = aspects[i % aspects.length];

              return (
                <motion.div
                  key={work.id}
                  className={`md:col-span-${span}`}
                  style={{ gridColumn: `span ${span}` }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.05 * i }}
                >
                  <Link to={`/works/${work.id}`} className="group block">
                    <div
                      className="w-full"
                      style={{ background: work.gradient, aspectRatio: aspect }}
                    />
                    <div className="mt-4 flex justify-between items-baseline">
                      <div>
                        <p className="font-serif text-base md:text-lg">{work.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{work.medium}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{work.year}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectedWorks;
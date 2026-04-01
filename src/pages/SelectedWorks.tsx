import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const works = [
  { id: "1", title: "Erosion of Light", year: 2024, medium: "Oil on canvas, 195 × 260 cm", gradient: "linear-gradient(145deg, hsl(15 35% 30%), hsl(30 40% 50%))", role: "anchor" as const },
  { id: "2", title: "Meridian", year: 2023, medium: "Acrylic & mixed media on linen, 130 × 97 cm", gradient: "linear-gradient(155deg, hsl(200 25% 28%), hsl(180 18% 48%))", role: "secondary" as const },
  { id: "3", title: "Residual Warmth", year: 2024, medium: "Oil on linen, 146 × 114 cm", gradient: "linear-gradient(140deg, hsl(35 45% 35%), hsl(25 35% 55%))", role: "secondary" as const },
  { id: "4", title: "Nocturne VII", year: 2023, medium: "Oil on canvas, 200 × 200 cm", gradient: "linear-gradient(160deg, hsl(240 15% 22%), hsl(220 12% 38%))", role: "anchor" as const },
  { id: "5", title: "Território Interior", year: 2022, medium: "Acrylic on canvas, 162 × 130 cm", gradient: "linear-gradient(135deg, hsl(25 30% 32%), hsl(40 25% 48%))", role: "quiet" as const },
  { id: "6", title: "Substrato", year: 2022, medium: "Mixed media on linen, 130 × 162 cm", gradient: "linear-gradient(150deg, hsl(10 20% 28%), hsl(20 30% 45%))", role: "quiet" as const },
  { id: "7", title: "Permanência", year: 2021, medium: "Oil on canvas, 250 × 190 cm", gradient: "linear-gradient(145deg, hsl(45 25% 30%), hsl(35 20% 50%))", role: "anchor" as const },
  { id: "8", title: "Limiar", year: 2021, medium: "Acrylic & pigment on canvas, 114 × 146 cm", gradient: "linear-gradient(130deg, hsl(180 15% 25%), hsl(160 12% 42%))", role: "secondary" as const },
];

const WorkCard = ({ work, aspect, className = "" }: { work: typeof works[0]; aspect: string; className?: string }) => (
  <Link to={`/works/${work.id}`} className="group block">
    <div
      className="w-full transition-opacity duration-500 group-hover:opacity-90"
      style={{ background: work.gradient, aspectRatio: aspect }}
    />
    <div className="mt-4 md:mt-5 flex justify-between items-baseline gap-4">
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
);

const SelectedWorks = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-36 pb-24 md:pb-36 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">

          {/* Page opening */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-20 md:mb-28 max-w-2xl"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5">
              Curated Selection
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-[1.15]">
              Selected Works
            </h1>
            <p className="mt-6 text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-lg font-light">
              A curated body of recent and significant works, tracing the evolving concerns of the practice.
            </p>
          </motion.div>

          {/* --- Cluster 1: Hero anchor + two secondary --- */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <motion.div
              className="md:col-span-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              <WorkCard work={works[0]} aspect="4/5" />
            </motion.div>

            <div className="md:col-span-4 flex flex-col gap-6 md:gap-8 md:pt-16">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <WorkCard work={works[1]} aspect="3/4" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <WorkCard work={works[2]} aspect="1/1" />
              </motion.div>
            </div>
          </div>

          {/* --- Breathing pause --- */}
          <div className="my-20 md:my-32" />

          {/* --- Cluster 2: Full-width anchor --- */}
          <motion.div
            className="max-w-[1100px] mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <WorkCard work={works[3]} aspect="16/9" />
          </motion.div>

          {/* --- Breathing pause --- */}
          <div className="my-20 md:my-32" />

          {/* --- Cluster 3: Two quiet works, offset --- */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <motion.div
              className="md:col-span-5 md:col-start-2"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              <WorkCard work={works[4]} aspect="4/5" />
            </motion.div>
            <motion.div
              className="md:col-span-5 md:pt-24"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <WorkCard work={works[5]} aspect="3/2" />
            </motion.div>
          </div>

          {/* --- Breathing pause --- */}
          <div className="my-20 md:my-32" />

          {/* --- Cluster 4: Final anchor + coda --- */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <motion.div
              className="md:col-span-7"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              <WorkCard work={works[6]} aspect="4/5" />
            </motion.div>
            <motion.div
              className="md:col-span-4 md:col-start-9 flex items-end"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <WorkCard work={works[7]} aspect="3/4" />
            </motion.div>
          </div>

          {/* --- Closing link --- */}
          <motion.div
            className="mt-24 md:mt-36 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <Link
              to="/works"
              className="inline-block text-[10px] tracking-[0.25em] uppercase text-foreground/50 hover:text-foreground border-b border-foreground/15 hover:border-foreground/40 pb-1 transition-all duration-300"
            >
              View All Works
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectedWorks;

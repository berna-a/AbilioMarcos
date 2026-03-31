import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * Placeholder featured works — will be replaced with real artwork data.
 */
const featuredWorks = [
  { id: "1", title: "Erosion of Light", year: 2024, medium: "Oil on canvas", gradient: "linear-gradient(145deg, hsl(15 35% 35%), hsl(30 45% 55%))" },
  { id: "2", title: "Meridian", year: 2023, medium: "Acrylic & mixed media", gradient: "linear-gradient(145deg, hsl(200 25% 30%), hsl(180 20% 50%))" },
  { id: "3", title: "Residual Warmth", year: 2024, medium: "Oil on linen", gradient: "linear-gradient(145deg, hsl(35 50% 40%), hsl(25 40% 60%))" },
];

const FeaturedWorks = () => {
  return (
    <section className="py-20 md:py-30 px-6 md:px-10 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Featured</p>
        <h2 className="font-serif text-3xl md:text-4xl font-light">Selected Works</h2>
      </motion.div>

      {/* Asymmetric editorial grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Large featured piece */}
        <motion.div
          className="md:col-span-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <Link to={`/works/${featuredWorks[0].id}`} className="group block">
            <div
              className="aspect-[4/5] w-full"
              style={{ background: featuredWorks[0].gradient }}
            />
            <div className="mt-4 flex justify-between items-baseline">
              <div>
                <p className="font-serif text-lg">{featuredWorks[0].title}</p>
                <p className="text-xs text-muted-foreground mt-1">{featuredWorks[0].medium}</p>
              </div>
              <p className="text-xs text-muted-foreground">{featuredWorks[0].year}</p>
            </div>
          </Link>
        </motion.div>

        {/* Two smaller pieces stacked */}
        <div className="md:col-span-5 flex flex-col gap-6 md:gap-8">
          {featuredWorks.slice(1).map((work, i) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
            >
              <Link to={`/works/${work.id}`} className="group block">
                <div
                  className="aspect-[3/2] w-full"
                  style={{ background: work.gradient }}
                />
                <div className="mt-4 flex justify-between items-baseline">
                  <div>
                    <p className="font-serif text-lg">{work.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{work.medium}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{work.year}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View all link */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Link
          to="/selected-works"
          className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors"
        >
          View Selected Works
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturedWorks;
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const featuredWorks = [
  { id: "1", title: "Erosion of Light", year: 2024, medium: "Oil on canvas", gradient: "linear-gradient(145deg, hsl(15 35% 35%), hsl(30 45% 55%))" },
  { id: "2", title: "Meridian", year: 2023, medium: "Acrylic & mixed media", gradient: "linear-gradient(145deg, hsl(200 25% 30%), hsl(180 20% 50%))" },
  { id: "3", title: "Residual Warmth", year: 2024, medium: "Oil on linen", gradient: "linear-gradient(145deg, hsl(35 50% 40%), hsl(25 40% 60%))" },
];

const FeaturedWorks = () => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-10 max-w-[1400px] mx-auto">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mb-14 md:mb-18"
      >
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
          Featured
        </p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-tight">
          Selected Works
        </h2>
      </motion.div>

      {/* Asymmetric editorial grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
        {/* Hero piece — dominant */}
        <motion.div
          className="md:col-span-7"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          <Link to={`/works/${featuredWorks[0].id}`} className="group block">
            <div
              className="aspect-[4/5] w-full"
              style={{ background: featuredWorks[0].gradient }}
            />
            <div className="mt-5 flex justify-between items-baseline">
              <div>
                <p className="font-serif text-lg md:text-xl tracking-[0.01em]">
                  {featuredWorks[0].title}
                </p>
                <p className="text-[11px] tracking-[0.05em] text-muted-foreground mt-1.5">
                  {featuredWorks[0].medium}
                </p>
              </div>
              <p className="text-[11px] tracking-[0.05em] text-muted-foreground">
                {featuredWorks[0].year}
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Secondary pieces — stacked */}
        <div className="md:col-span-5 flex flex-col gap-8 md:gap-10">
          {featuredWorks.slice(1).map((work, i) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.1 * (i + 1) }}
            >
              <Link to={`/works/${work.id}`} className="group block">
                <div
                  className="aspect-[3/2] w-full"
                  style={{ background: work.gradient }}
                />
                <div className="mt-5 flex justify-between items-baseline">
                  <div>
                    <p className="font-serif text-lg tracking-[0.01em]">
                      {work.title}
                    </p>
                    <p className="text-[11px] tracking-[0.05em] text-muted-foreground mt-1.5">
                      {work.medium}
                    </p>
                  </div>
                  <p className="text-[11px] tracking-[0.05em] text-muted-foreground">
                    {work.year}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View all — refined link */}
      <motion.div
        className="mt-20 md:mt-24 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Link
          to="/selected-works"
          className="inline-block text-[11px] tracking-[0.25em] uppercase text-foreground/60 hover:text-foreground border-b border-foreground/20 hover:border-foreground/50 pb-1 transition-all duration-300"
        >
          View Selected Works
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturedWorks;

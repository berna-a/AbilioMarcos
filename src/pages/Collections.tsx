import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useT } from "@/i18n";

const placeholderCollections = [
  { id: "1", title: "Chromatic Tensions", count: 12, year: "2023–2024", gradient: "linear-gradient(145deg, hsl(15 40% 30%), hsl(35 50% 55%))" },
  { id: "2", title: "Silent Landscapes", count: 8, year: "2022–2023", gradient: "linear-gradient(145deg, hsl(200 20% 35%), hsl(180 15% 50%))" },
  { id: "3", title: "Gestural Studies", count: 15, year: "2021–2024", gradient: "linear-gradient(145deg, hsl(30 30% 25%), hsl(40 40% 50%))" },
];

const Collections = () => {
  const t = useT();

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
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">{t.collectionsPage.label}</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">{t.collectionsPage.title}</h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {placeholderCollections.map((collection, i) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/collections/${collection.id}`} className="group block">
                  <div
                    className="aspect-[3/2] w-full"
                    style={{ background: collection.gradient }}
                  />
                  <div className="mt-4">
                    <p className="font-serif text-xl md:text-2xl">{collection.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {collection.count} {t.collectionsPage.worksCount} · {collection.year}
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

export default Collections;

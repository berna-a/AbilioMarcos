import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";

const exhibitions = [
  { year: "2024", entries: [
    "Solo Exhibition — Gallery Name, Lisbon",
    "International Art Fair, London",
  ]},
  { year: "2023", entries: [
    "Group Exhibition — Contemporary Art Space, Berlin",
    "Art Fair, Paris",
    "Two-Person Show — Gallery, Porto",
  ]},
  { year: "2022", entries: [
    "Solo Exhibition — Gallery Name, Lisbon",
    "International Biennale, Location",
  ]},
];

const education = [
  { year: "Year", entry: "Education details to be added" },
];

const CV = () => {
  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-20 md:pb-30 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Curriculum Vitae</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-16">Abílio Marcos</h1>
          </motion.div>

          {/* Exhibitions */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-8 pb-3 border-b border-gallery-border">
              Selected Exhibitions
            </h2>

            <div className="space-y-10">
              {exhibitions.map((group) => (
                <div key={group.year} className="grid grid-cols-12 gap-4">
                  <div className="col-span-2">
                    <p className="text-sm font-light">{group.year}</p>
                  </div>
                  <div className="col-span-10 space-y-2">
                    {group.entries.map((entry) => (
                      <p key={entry} className="text-sm text-muted-foreground">{entry}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Education */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-8 pb-3 border-b border-gallery-border">
              Education
            </h2>

            <div className="space-y-4">
              {education.map((item) => (
                <div key={item.entry} className="grid grid-cols-12 gap-4">
                  <div className="col-span-2">
                    <p className="text-sm font-light">{item.year}</p>
                  </div>
                  <div className="col-span-10">
                    <p className="text-sm text-muted-foreground">{item.entry}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Collections */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-8 pb-3 border-b border-gallery-border">
              Selected Collections
            </h2>
            <p className="text-sm text-muted-foreground">
              Private collections in Portugal, United Kingdom, Germany, and the United States.
            </p>
          </motion.section>
        </div>
      </div>
    </Layout>
  );
};

export default CV;
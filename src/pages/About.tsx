import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";

const About = () => {
  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-20 md:pb-30 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            {/* Portrait placeholder */}
            <motion.div
              className="md:col-span-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="aspect-[3/4] w-full"
                style={{ background: "linear-gradient(145deg, hsl(30 15% 40%), hsl(35 20% 55%))" }}
              />
              <p className="mt-3 text-xs text-muted-foreground">
                Abílio Marcos in his studio, Lisbon.
              </p>
            </motion.div>

            {/* Bio text */}
            <motion.div
              className="md:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">About the Artist</p>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-8">Abílio Marcos</h1>

              <div className="space-y-6 text-sm text-muted-foreground leading-relaxed max-w-xl">
                <p>
                  Abílio Marcos is a Portuguese abstract-expressionist painter whose work explores the 
                  intersection of gesture, memory, and chromatic intensity. Working primarily in oil and 
                  mixed media on large-scale canvases, his practice is rooted in the belief that painting 
                  is an act of both discipline and surrender.
                </p>
                <p>
                  Born in Portugal, Marcos developed his visual language through years of sustained studio 
                  practice, drawing influence from the emotional directness of Abstract Expressionism and 
                  the material richness of European painting traditions.
                </p>
                <p>
                  His work has been exhibited internationally across galleries and art fairs in Lisbon, 
                  London, Berlin, and beyond. Paintings by Marcos are held in private collections across 
                  Europe and North America.
                </p>
                <p>
                  Marcos lives and works between Lisbon and his rural studio in the Portuguese countryside, 
                  where the landscape, light, and solitude inform the emotional core of his paintings.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
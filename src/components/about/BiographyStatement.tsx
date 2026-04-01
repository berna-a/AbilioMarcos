import { motion } from "framer-motion";
import artistPortrait from "@/assets/abilio-marcos.png";

const BiographyStatement = () => (
  <motion.section
    className="mb-24 md:mb-32"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
      {/* Biography — left */}
      <div className="md:col-span-7 order-2 md:order-1">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6 pb-3 border-b border-gallery-border">
          Biography
        </p>
        <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.85] max-w-xl">
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
      </div>

      {/* Portrait — right */}
      <div className="md:col-span-5 order-1 md:order-2">
        <div className="aspect-[3/4] w-full overflow-hidden">
          <img
            src={artistPortrait}
            alt="Abílio Marcos"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground/60">
          Abílio Marcos in his studio, Lisbon.
        </p>
      </div>
    </div>
  </motion.section>
);

export default BiographyStatement;

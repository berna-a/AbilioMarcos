import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import CollectorSignup from "@/components/CollectorSignup";

const studioContent = [
  {
    type: "text" as const,
    quote: "The studio is where negotiation happens — between what I intend and what the paint decides. I've learned to listen to the canvas.",
  },
  {
    type: "image" as const,
    caption: "Close-up texture detail — oil on canvas, 2024.",
    gradient: "linear-gradient(145deg, hsl(25 50% 35%), hsl(35 45% 55%), hsl(15 40% 25%))",
  },
  {
    type: "image" as const,
    caption: "Scale reference — working on a large-format piece in the studio.",
    gradient: "linear-gradient(145deg, hsl(35 20% 45%), hsl(30 15% 60%))",
    aspect: "16/9",
  },
  {
    type: "text" as const,
    quote: "Color is never decoration. It's emotional architecture. Every hue carries weight, every tone shifts the conversation.",
  },
  {
    type: "image" as const,
    caption: "Detail — gestural marks and layered pigment.",
    gradient: "linear-gradient(145deg, hsl(10 40% 30%), hsl(30 55% 50%), hsl(350 30% 25%))",
  },
];

const Studio = () => {
  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-20 md:pb-30">
        {/* Header */}
        <div className="px-6 md:px-10 max-w-[1400px] mx-auto mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Process</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6">The Studio</h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              A space of intention and instinct — where gesture meets material, 
              and each painting emerges through layers of decision, accident, and resolve.
            </p>
          </motion.div>
        </div>

        {/* Studio content blocks */}
        <div className="space-y-20 md:space-y-30">
          {studioContent.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              {item.type === "text" ? (
                <div className="px-6 md:px-10 max-w-3xl mx-auto text-center">
                  <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl font-light leading-relaxed italic">
                    "{item.quote}"
                  </blockquote>
                </div>
              ) : (
                <div className="px-6 md:px-0">
                  <div className="max-w-[1400px] mx-auto">
                    <div
                      className="w-full"
                      style={{
                        background: item.gradient,
                        aspectRatio: item.aspect || "3/2",
                      }}
                    />
                    {item.caption && (
                      <p className="mt-4 text-xs text-muted-foreground px-0 md:px-10">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Collector signup */}
        <div className="mt-20 md:mt-30 px-6 md:px-10">
          <div className="max-w-[1400px] mx-auto py-16 md:py-20 border-t border-gallery-border">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <CollectorSignup variant="inline" />
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Studio;
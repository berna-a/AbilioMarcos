import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Placeholder data — will be replaced by backend
const artworksData: Record<string, {
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  status: "available" | "reserved" | "sold";
  collection: string;
  price?: string;
  processNote?: string;
  provenance?: string[];
  gradients: string[];
  relatedIds: string[];
}> = {
  "1": {
    title: "Composition A",
    year: 2024,
    medium: "Oil on canvas",
    dimensions: "120 × 150 cm",
    status: "available",
    collection: "Terracotta Meditations",
    price: "Price on Request",
    processNote: "This work emerged from a sustained period of studio inquiry into the weight and warmth of earth pigments. The surface was built over several months, layering translucent washes with denser passages of impasto to create a tension between depth and surface.",
    provenance: [
      "Private Collection, Lisbon (2022–2024)",
      "Acquired directly from the artist's studio",
    ],
    gradients: [
      "linear-gradient(135deg, hsl(15 30% 25%), hsl(30 35% 40%))",
      "linear-gradient(160deg, hsl(20 25% 30%), hsl(35 30% 45%))",
      "linear-gradient(180deg, hsl(25 20% 28%), hsl(40 25% 38%))",
      "linear-gradient(200deg, hsl(18 28% 22%), hsl(32 32% 36%))",
    ],
    relatedIds: ["2", "3", "5"],
  },
  "2": {
    title: "Composition B",
    year: 2024,
    medium: "Acrylic & mixed media",
    dimensions: "90 × 110 cm",
    status: "reserved",
    collection: "Nocturnes",
    processNote: "An exploration of nocturnal light and shadow, this piece uses layered acrylic washes to evoke the liminal space between dusk and darkness.",
    gradients: [
      "linear-gradient(135deg, hsl(29 23% 27%), hsl(44 25% 43%))",
      "linear-gradient(160deg, hsl(34 20% 32%), hsl(49 22% 48%))",
      "linear-gradient(180deg, hsl(39 18% 30%), hsl(54 20% 40%))",
    ],
    relatedIds: ["1", "4", "6"],
  },
  "3": {
    title: "Composition C",
    year: 2023,
    medium: "Charcoal on paper",
    dimensions: "76 × 56 cm",
    status: "sold",
    collection: "Structural Light",
    provenance: [
      "Private Collection, London",
      "Galeria Moderna, Porto (2023)",
    ],
    gradients: [
      "linear-gradient(135deg, hsl(43 26% 29%), hsl(58 28% 45%))",
      "linear-gradient(160deg, hsl(48 23% 34%), hsl(63 25% 50%))",
    ],
    relatedIds: ["1", "5"],
  },
};

// Generate fallback entries for IDs not explicitly defined
const getArtwork = (id: string) => {
  if (artworksData[id]) return artworksData[id];
  const num = parseInt(id) || 1;
  return {
    title: `Composition ${String.fromCharCode(64 + num)}`,
    year: 2024 - Math.floor(num / 5),
    medium: ["Oil on canvas", "Acrylic & mixed media", "Charcoal on paper", "Oil & graphite"][num % 4],
    dimensions: `${80 + num * 5} × ${100 + num * 5} cm`,
    status: (["available", "reserved", "sold"] as const)[num % 3],
    collection: ["Terracotta Meditations", "Nocturnes", "Structural Light", "Archive"][num % 4],
    price: num % 3 === 0 ? undefined : "Price on Request",
    gradients: [
      `linear-gradient(${135 + num * 15}deg, hsl(${15 + num * 14} ${20 + num * 3}% ${22 + num * 3}%), hsl(${30 + num * 10} ${30 + num * 2}% ${38 + num * 3}%))`,
    ],
    relatedIds: [String((num % 18) + 1), String(((num + 1) % 18) + 1), String(((num + 2) % 18) + 1)],
  };
};

const statusLabel: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const artwork = getArtwork(id || "1");

  return (
    <Layout>
      <div className="pt-28 md:pt-36 pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10 md:mb-14"
          >
            <Link
              to="/works"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Works
            </Link>
          </motion.div>

          {/* Primary image + Metadata */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20 md:mb-32">

            {/* Primary image */}
            <motion.div
              className="lg:col-span-7 xl:col-span-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div
                className="w-full aspect-[4/5] md:aspect-[3/4]"
                style={{ background: artwork.gradients[0] }}
              />
            </motion.div>

            {/* Metadata column */}
            <motion.div
              className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div>
                {/* Collection label */}
                <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                  {artwork.collection}
                </span>

                {/* Title */}
                <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-light text-foreground mt-4 mb-6 leading-[1.1]">
                  {artwork.title}
                </h1>

                {/* Year */}
                <p className="text-sm text-muted-foreground mb-8">
                  {artwork.year}
                </p>

                {/* Divider */}
                <div className="h-px bg-border mb-8" />

                {/* Details */}
                <div className="space-y-4 mb-10">
                  <DetailRow label="Medium" value={artwork.medium} />
                  <DetailRow label="Dimensions" value={artwork.dimensions} />
                  <DetailRow
                    label="Status"
                    value={statusLabel[artwork.status]}
                    valueClass={
                      artwork.status === "available"
                        ? "text-foreground"
                        : artwork.status === "reserved"
                          ? "text-muted-foreground italic"
                          : "text-muted-foreground"
                    }
                  />
                  {artwork.price && (
                    <DetailRow label="Price" value={artwork.price} />
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-border mb-8" />

                {/* CTAs */}
                <div className="space-y-3">
                  {artwork.status === "available" && (
                    <Link
                      to="/contact"
                      className="block w-full py-3.5 text-center text-[11px] tracking-[0.2em] uppercase bg-foreground text-background hover:bg-foreground/90 transition-colors duration-300"
                    >
                      Acquire This Work
                    </Link>
                  )}
                  <Link
                    to="/contact"
                    className="block w-full py-3.5 text-center text-[11px] tracking-[0.2em] uppercase border border-border text-foreground hover:bg-accent/50 transition-colors duration-300"
                  >
                    Inquire
                  </Link>
                  <Link
                    to="/contact"
                    className="block w-full py-3 text-center text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    Request a Commission
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Secondary images / detail views */}
          {artwork.gradients.length > 1 && (
            <motion.section
              className="mb-20 md:mb-32"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">
                Detail Views
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {artwork.gradients.slice(1).map((grad, i) => (
                  <div
                    key={i}
                    className="aspect-square hover:opacity-90 transition-opacity duration-500 cursor-pointer"
                    style={{ background: grad }}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Process note */}
          {artwork.processNote && (
            <motion.section
              className="mb-20 md:mb-32 max-w-2xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-6">
                Artist's Note
              </h2>
              <p className="font-serif text-lg md:text-xl leading-relaxed text-foreground/80">
                {artwork.processNote}
              </p>
            </motion.section>
          )}

          {/* Provenance */}
          {artwork.provenance && artwork.provenance.length > 0 && (
            <motion.section
              className="mb-20 md:mb-32 max-w-2xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-6">
                Provenance
              </h2>
              <ul className="space-y-2">
                {artwork.provenance.map((entry, i) => (
                  <li key={i} className="text-sm text-foreground/70 leading-relaxed">
                    {entry}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Related works */}
          {artwork.relatedIds && artwork.relatedIds.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="h-px bg-border mb-14" />
              <h2 className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-10">
                Related Works
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {artwork.relatedIds.slice(0, 3).map((relId) => {
                  const rel = getArtwork(relId);
                  return (
                    <Link
                      key={relId}
                      to={`/artwork/${relId}`}
                      className="group"
                    >
                      <div
                        className="aspect-[4/5] mb-3 group-hover:opacity-90 transition-opacity duration-500"
                        style={{ background: rel.gradients[0] }}
                      />
                      <p className="font-serif text-base text-foreground group-hover:text-foreground/80 transition-colors duration-300">
                        {rel.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {rel.medium}, {rel.year}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </Layout>
  );
};

// Small helper
const DetailRow = ({
  label,
  value,
  valueClass = "text-foreground",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="flex justify-between items-baseline">
    <span className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
      {label}
    </span>
    <span className={`text-sm ${valueClass}`}>{value}</span>
  </div>
);

export default ArtworkDetail;

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

const statusDisplay: Record<string, { label: string; className: string }> = {
  available: { label: "Available", className: "text-foreground" },
  reserved: { label: "Reserved", className: "text-muted-foreground italic" },
  sold: { label: "Sold", className: "text-muted-foreground" },
};

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const artwork = getArtwork(id || "1");
  const status = statusDisplay[artwork.status];

  return (
    <Layout>
      <div className="pt-28 md:pt-40 pb-24 md:pb-40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-14 md:mb-24"
          >
            <Link
              to="/works"
              className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Archive
            </Link>
          </motion.div>

          {/* Primary image + Information */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 mb-32 md:mb-48">

            {/* Primary image */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div
                className="w-full aspect-[4/5] md:aspect-[3/4]"
                style={{ background: artwork.gradients[0] }}
              />
            </motion.div>

            {/* Information column */}
            <motion.div
              className="lg:col-span-5 flex flex-col lg:py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              {/* Collection label */}
              <span className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-8">
                {artwork.collection}
              </span>

              {/* Title — larger, more authoritative */}
              <h1 className="font-serif text-[3rem] md:text-[3.5rem] lg:text-[3.75rem] font-light text-foreground leading-[1.02] mb-2">
                {artwork.title}
              </h1>

              {/* Year */}
              <p className="font-serif text-xl md:text-2xl text-muted-foreground italic mb-14 lg:mb-16">
                {artwork.year}
              </p>

              {/* Metadata */}
              <div className="space-y-6 mb-14 lg:mb-16">
                <MetadataLine label="Medium" value={artwork.medium} />
                <MetadataLine label="Dimensions" value={artwork.dimensions} />
                <MetadataLine
                  label="Status"
                  value={status.label}
                  valueClassName={status.className}
                />
                {artwork.price && (
                  <MetadataLine label="Price" value={artwork.price} />
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-border mb-14 lg:mb-16" />

              {/* Actions — editorial text links, not buttons */}
              <nav className="space-y-6 mt-auto" aria-label="Artwork actions">
                {artwork.status === "available" && (
                  <Link
                    to="/contact"
                    className="block text-[11px] tracking-[0.2em] uppercase text-foreground hover:text-foreground/60 transition-colors duration-500"
                  >
                    Acquire This Work
                  </Link>
                )}
                <Link
                  to="/contact"
                  className="block text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500"
                >
                  Inquire
                </Link>
                <Link
                  to="/contact"
                  className="block text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500"
                >
                  Request a Commission
                </Link>
              </nav>
            </motion.div>
          </div>

          {/* Detail views */}
          {artwork.gradients.length > 1 && (
            <motion.section
              className="mb-32 md:mb-48"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <SectionLabel>Detail Views</SectionLabel>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {artwork.gradients.slice(1).map((grad, i) => (
                  <div
                    key={i}
                    className="aspect-[5/4] hover:opacity-90 transition-opacity duration-700 cursor-pointer"
                    style={{ background: grad }}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Artist's note */}
          {artwork.processNote && (
            <motion.section
              className="mb-32 md:mb-48"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="max-w-2xl">
                <SectionLabel className="mb-10 md:mb-12">Artist's Note</SectionLabel>
                <p className="font-serif text-2xl md:text-[1.75rem] leading-[1.7] text-foreground/80 tracking-[-0.005em]">
                  {artwork.processNote}
                </p>
              </div>
            </motion.section>
          )}

          {/* Provenance */}
          {artwork.provenance && artwork.provenance.length > 0 && (
            <motion.section
              className="mb-32 md:mb-48"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="max-w-2xl">
                <SectionLabel className="mb-10 md:mb-12">Provenance</SectionLabel>
                <ul className="space-y-4">
                  {artwork.provenance.map((entry, i) => (
                    <li key={i} className="text-sm md:text-[0.938rem] text-foreground/65 leading-[1.7] tracking-wide">
                      {entry}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>
          )}

          {/* Related works */}
          {artwork.relatedIds && artwork.relatedIds.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="h-px bg-border mb-20 md:mb-24" />
              <SectionLabel className="mb-14 md:mb-16">Further Viewing</SectionLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
                {artwork.relatedIds.slice(0, 3).map((relId) => {
                  const rel = getArtwork(relId);
                  return (
                    <Link
                      key={relId}
                      to={`/artwork/${relId}`}
                      className="group"
                    >
                      <div
                        className="aspect-[4/5] mb-5 group-hover:opacity-85 transition-opacity duration-700"
                        style={{ background: rel.gradients[0] }}
                      />
                      <p className="font-serif text-lg md:text-xl text-foreground group-hover:text-foreground/70 transition-colors duration-500 leading-tight">
                        {rel.title}
                      </p>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-2">
                        {rel.medium}
                      </p>
                      <p className="font-serif text-sm text-muted-foreground italic mt-1">
                        {rel.year}
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

/* ── Helpers ── */

const SectionLabel = ({
  children,
  className = "mb-8 md:mb-10",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h2 className={`text-[11px] tracking-[0.3em] uppercase text-muted-foreground ${className}`}>
    {children}
  </h2>
);

const MetadataLine = ({
  label,
  value,
  valueClassName = "text-foreground",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <div className="flex justify-between items-baseline">
    <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
      {label}
    </span>
    <span className={`text-sm md:text-[0.938rem] tracking-wide ${valueClassName}`}>
      {value}
    </span>
  </div>
);

export default ArtworkDetail;

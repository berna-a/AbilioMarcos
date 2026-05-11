import Layout from "@/components/layout/Layout";
import AboutHero from "@/components/about/AboutHero";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AboutSection, getAboutSections } from "@/lib/about-content";

const About = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAboutSections().then((data) => {
      setSections(data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="pt-28 md:pt-36 pb-24 md:pb-36 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <AboutHero />

          {loading ? (
            <p className="text-[13px] text-foreground/60 py-12">A carregar…</p>
          ) : (
            <div className="space-y-14 md:space-y-18">
              {sections.map((s) => (
                <motion.section
                  key={s.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16"
                >
                  <div className="md:col-span-3">
                    <p className="text-[12px] tracking-[0.3em] uppercase text-brand-red md:sticky md:top-32">
                      {s.title}
                    </p>
                  </div>
                  <div className="md:col-span-9 max-w-3xl">
                    <div className="text-[17px] text-foreground leading-[1.85] whitespace-pre-line">
                      {s.content}
                    </div>
                  </div>
                </motion.section>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default About;

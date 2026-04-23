import Layout from "@/components/layout/Layout";
import AboutHero from "@/components/about/AboutHero";
import AboutBiography from "@/components/about/AboutBiography";
import AboutPractice from "@/components/about/AboutPractice";
import AboutHighlights from "@/components/about/AboutHighlights";
import AboutCollections from "@/components/about/AboutCollections";
import AboutBibliography from "@/components/about/AboutBibliography";
import AboutArchive from "@/components/about/AboutArchive";

const About = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-36 pb-24 md:pb-36 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <AboutHero />
          <AboutBiography />
          <AboutPractice />
          <AboutHighlights />
          <AboutCollections />
          <AboutBibliography />
          <AboutArchive />
        </div>
      </div>
    </Layout>
  );
};

export default About;

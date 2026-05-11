import Layout from "@/components/layout/Layout";
import AboutHero from "@/components/about/AboutHero";
import AboutBiography from "@/components/about/AboutBiography";
import AboutPractice from "@/components/about/AboutPractice";
import AboutArchive from "@/components/about/AboutArchive";

const About = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-36 pb-24 md:pb-36 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <AboutHero />
          <AboutBiography />
          <AboutPractice />
          <AboutArchive />
        </div>
      </div>
    </Layout>
  );
};

export default About;

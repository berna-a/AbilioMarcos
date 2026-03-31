import Layout from "@/components/layout/Layout";
import AuthorityIntro from "@/components/about/AuthorityIntro";
import CareerSnapshot from "@/components/about/CareerSnapshot";
import BiographyStatement from "@/components/about/BiographyStatement";
import CareerHighlights from "@/components/about/CareerHighlights";
import ExhibitionsArchive from "@/components/about/ExhibitionsArchive";
import PressRecognition from "@/components/about/PressRecognition";
import CollectionsRecognition from "@/components/about/CollectionsRecognition";

const About = () => {
  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-24 md:pb-36 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <AuthorityIntro />
          <CareerSnapshot />
          <BiographyStatement />
          <CareerHighlights />
          <ExhibitionsArchive />
          <PressRecognition />
          <CollectionsRecognition />
        </div>
      </div>
    </Layout>
  );
};

export default About;

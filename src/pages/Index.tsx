import { useState, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import IntroAnimation from "@/components/IntroAnimation";
import HeroSection from "@/components/home/HeroSection";
import FeaturedWorks from "@/components/home/FeaturedWorks";
import StatementSection from "@/components/home/StatementSection";
import CollectorSection from "@/components/home/CollectorSection";
import AuthorityStrip from "@/components/home/AuthorityStrip";

const Index = () => {
  const [showIntro, setShowIntro] = useState(() => {
    // Only show intro once per session
    if (sessionStorage.getItem("intro_seen")) return false;
    return true;
  });

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem("intro_seen", "true");
    setShowIntro(false);
  }, []);

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <Layout>
        <HeroSection />
        <FeaturedWorks />
        <StatementSection />
        <AuthorityStrip />
        <CollectorSection />
      </Layout>
    </>
  );
};

export default Index;
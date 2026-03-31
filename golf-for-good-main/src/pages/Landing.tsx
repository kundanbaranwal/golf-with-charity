import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import CharitySpotlight from "@/components/landing/CharitySpotlight";
import DrawExplainer from "@/components/landing/DrawExplainer";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <DrawExplainer />
      <CharitySpotlight />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Landing;

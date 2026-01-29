import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowToUse } from "@/components/home/HowToUse";
import { SafetyNote } from "@/components/home/SafetyNote";
import { FAQSection } from "@/components/home/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <HowToUse />
        <SafetyNote />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { UseCasesSection } from "@/components/home/UseCasesSection";
import { TechSection } from "@/components/home/TechSection";
import { HowToUse } from "@/components/home/HowToUse";
import { SafetyNote } from "@/components/home/SafetyNote";
import { FAQSection } from "@/components/home/FAQSection";
import { ParticleBackground } from "@/components/home/ParticleBackground";
import { CustomCursor } from "@/components/home/CustomCursor";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #0a0e27 0%, #0d1230 50%, #0a0e27 100%)"
        }}
      />
      
      {/* Particle background */}
      <ParticleBackground />
      
      {/* Custom cursor */}
      <CustomCursor />
      
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <HowItWorks />
          <FeaturesSection />
          <UseCasesSection />
          <TechSection />
          <HowToUse />
          <SafetyNote />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;

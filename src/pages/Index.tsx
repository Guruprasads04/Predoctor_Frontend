import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutSepsis } from "@/components/AboutSepsis";
import { Stats } from "@/components/Stats";
import { Features } from "@/components/Features";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Explainability } from "@/components/Explainability";
import { Workflow } from "@/components/Workflow";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <AboutSepsis />
      <Stats />
      <Features />
      <DashboardPreview />
      <Explainability />
      <Workflow />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;

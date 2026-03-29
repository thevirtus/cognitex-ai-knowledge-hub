import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { BrandStrip } from "@/components/BrandStrip";
import { Products } from "@/components/Products";
import { CommercialSection } from "@/components/CommercialSection";
import { EducationSection } from "@/components/EducationSection";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { WarrantyTrust } from "@/components/WarrantyTrust";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Products />
        <BrandStrip />
        <CommercialSection />
        <EducationSection />
        <About />
        <Testimonials />
        <Contact />
        <WarrantyTrust />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

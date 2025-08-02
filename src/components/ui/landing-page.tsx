import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { FeaturesSection } from "./features-section";
import { SecuritySection } from "./security-section";
import { TestimonialsSection } from "./testimonials-section";
import { PricingSection } from "./pricing-section";

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <SecuritySection />
      <TestimonialsSection />
      <PricingSection />
    </div>
  );
};
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const PrivacyPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p className="text-sm text-muted-foreground/70">Last updated: March 31, 2026</p>

            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>We collect personal information you provide when placing an order (name, email, shipping address, payment details) and automatically collected data such as IP address, browser type, and browsing behavior through cookies.</p>

            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>Your information is used to process orders, communicate about your purchases, improve our website, send marketing communications (with your consent), and comply with legal obligations.</p>

            <h2 className="text-xl font-semibold text-foreground">3. Information Sharing</h2>
            <p>We do not sell your personal information. We share data only with service providers necessary to fulfill orders (payment processors, shipping carriers) and when required by law.</p>

            <h2 className="text-xl font-semibold text-foreground">4. Cookies</h2>
            <p>Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings.</p>

            <h2 className="text-xl font-semibold text-foreground">5. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>

            <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
            <p>You may request access to, correction, or deletion of your personal data by contacting us. California residents have additional rights under the CCPA.</p>

            <h2 className="text-xl font-semibold text-foreground">7. Third-Party Links</h2>
            <p>Our site may contain links to third-party websites. We are not responsible for their privacy practices.</p>

            <h2 className="text-xl font-semibold text-foreground">8. Changes to This Policy</h2>
            <p>We may update this policy periodically. Changes will be posted on this page with an updated revision date.</p>

            <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
            <p>For privacy inquiries, contact us at <a href="mailto:info@frosthaventubs.com" className="text-primary hover:underline">info@frosthaventubs.com</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;

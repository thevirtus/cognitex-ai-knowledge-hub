import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const TermsPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p className="text-sm text-muted-foreground/70">Last updated: March 31, 2026</p>

            <h2 className="text-xl font-semibold text-foreground">1. Agreement to Terms</h2>
            <p>By accessing or using the Frosthaven Tubs website and purchasing our products, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

            <h2 className="text-xl font-semibold text-foreground">2. Products &amp; Pricing</h2>
            <p>All product descriptions, images, and pricing are subject to change without notice. We reserve the right to modify or discontinue any product at any time. Prices are displayed in USD unless otherwise indicated.</p>

            <h2 className="text-xl font-semibold text-foreground">3. Orders &amp; Payment</h2>
            <p>By placing an order, you represent that the information you provide is accurate and that you are authorized to use the payment method. We reserve the right to refuse or cancel any order for any reason, including suspected fraud.</p>

            <h2 className="text-xl font-semibold text-foreground">4. Shipping &amp; Delivery</h2>
            <p>Shipping timelines are estimates and not guaranteed. Frosthaven Tubs is not responsible for delays caused by carriers, weather, or other factors beyond our control. Please refer to our Shipping Policy for full details.</p>

            <h2 className="text-xl font-semibold text-foreground">5. Intellectual Property</h2>
            <p>All content on this website — including text, graphics, logos, images, and software — is the property of Frosthaven Tubs and is protected by intellectual property laws. Unauthorized use is prohibited.</p>

            <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Frosthaven Tubs shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or services.</p>

            <h2 className="text-xl font-semibold text-foreground">7. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.</p>

            <h2 className="text-xl font-semibold text-foreground">8. Changes to Terms</h2>
            <p>We reserve the right to update these terms at any time. Continued use of the site after changes constitutes acceptance of the revised terms.</p>

            <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
            <p>For questions about these Terms, please contact us at <a href="mailto:info@frosthaventubs.com" className="text-primary hover:underline">info@frosthaventubs.com</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;

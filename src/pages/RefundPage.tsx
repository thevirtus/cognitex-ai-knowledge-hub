import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const RefundPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Return &amp; Refund Policy</h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p className="text-sm text-muted-foreground/70">Last updated: March 31, 2026</p>

            <h2 className="text-xl font-semibold text-foreground">1. Return Eligibility</h2>
            <p>Items may be returned within 30 days of delivery. Products must be unused, in original packaging, and in the same condition as received. Custom or modified products are not eligible for return.</p>

            <h2 className="text-xl font-semibold text-foreground">2. How to Initiate a Return</h2>
            <p>Contact our support team at <a href="mailto:info@frosthaventubs.com" className="text-primary hover:underline">info@frosthaventubs.com</a> with your order number and reason for return. We will provide a Return Merchandise Authorization (RMA) number and return instructions.</p>

            <h2 className="text-xl font-semibold text-foreground">3. Return Shipping</h2>
            <p>Return shipping costs are the responsibility of the customer unless the return is due to a defect or shipping error on our part. We recommend using a trackable shipping method.</p>

            <h2 className="text-xl font-semibold text-foreground">4. Refund Process</h2>
            <p>Once we receive and inspect your return, we will notify you of approval or rejection. Approved refunds are processed to the original payment method within 5–10 business days.</p>

            <h2 className="text-xl font-semibold text-foreground">5. Damaged or Defective Items</h2>
            <p>If your product arrives damaged or defective, contact us within 48 hours of delivery with photos. We will arrange a replacement or full refund at no additional cost.</p>

            <h2 className="text-xl font-semibold text-foreground">6. Exchanges</h2>
            <p>We offer exchanges for the same product in a different configuration, subject to availability. Contact our support team to arrange an exchange.</p>

            <h2 className="text-xl font-semibold text-foreground">7. Non-Refundable Items</h2>
            <p>Shipping fees, installation services, and accessories that have been used or opened are non-refundable.</p>

            <h2 className="text-xl font-semibold text-foreground">8. Contact</h2>
            <p>For return or refund questions, reach us at <a href="mailto:info@frosthaventubs.com" className="text-primary hover:underline">info@frosthaventubs.com</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPage;

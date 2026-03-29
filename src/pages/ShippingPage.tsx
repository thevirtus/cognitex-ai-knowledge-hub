import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Truck } from "lucide-react";

const ShippingPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Truck className="h-12 w-12 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-5xl font-bold text-foreground text-center mb-4">Freight Delivery Information</h1>
            <div className="prose prose-lg text-muted-foreground mx-auto">
              <p>Most cold plunge tubs ship via insured freight carriers to ensure safe delivery of oversized equipment.</p>
              <div className="frost-card p-8 mt-8 not-prose">
                <h3 className="font-semibold text-foreground mb-4">What to Expect</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Free freight shipping on all large equipment orders within the continental United States</li>
                  <li>• Typical delivery timeframe: 5–10 business days after processing</li>
                  <li>• Curbside delivery with lift-gate service included</li>
                  <li>• Tracking information provided via email upon shipment</li>
                  <li>• White-glove delivery available for an additional fee</li>
                  <li>• All shipments are fully insured during transit</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPage;

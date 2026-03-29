import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShieldCheck } from "lucide-react";

const WarrantyPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-5xl font-bold text-foreground text-center mb-4">Warranty & Equipment Protection</h1>
            <div className="space-y-8 mt-10">
              <div className="frost-card p-8">
                <h3 className="font-semibold text-foreground mb-3">Manufacturer-Backed Warranties</h3>
                <p className="text-muted-foreground text-sm">All cold plunge equipment sold through FrostHaven Tubs includes the full manufacturer warranty. Warranty terms vary by product and manufacturer. Specific warranty details are provided with each product listing and included in your order confirmation.</p>
              </div>
              <div className="frost-card p-8">
                <h3 className="font-semibold text-foreground mb-3">Support Coordination Assistance</h3>
                <p className="text-muted-foreground text-sm">If you experience an issue with your equipment, our support team will help coordinate with the manufacturer on your behalf. We act as your advocate to ensure warranty claims are handled efficiently and that you receive the service you deserve.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WarrantyPage;

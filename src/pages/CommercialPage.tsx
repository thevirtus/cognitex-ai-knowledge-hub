import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

const CommercialPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Commercial Cold Plunge Solutions</h1>
            <p className="text-muted-foreground mb-8">
              Cold plunge systems designed for gyms, wellness studios, athletic training facilities, and recovery centers. Our commercial team works directly with facility owners to specify the right equipment, manage freight delivery, and coordinate installation support.
            </p>
            <div className="frost-card p-8 text-left mb-8">
              <h3 className="font-semibold text-foreground mb-4">Request a Commercial Quote</h3>
              <p className="text-muted-foreground text-sm mb-6">Please contact our commercial team to discuss your facility requirements, volume pricing, and delivery logistics.</p>
              <Button variant="default" size="lg" onClick={() => window.location.href = "mailto:commercial@frosthaventubs.com"}>
                Contact Commercial Team
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommercialPage;

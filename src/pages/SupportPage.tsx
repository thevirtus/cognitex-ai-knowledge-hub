import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeadphonesIcon, Mail, Clock } from "lucide-react";

const SupportPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <HeadphonesIcon className="h-12 w-12 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Customer Support</h1>
            <p className="text-muted-foreground mb-10">We're here to help with product questions, order status, warranty claims, and technical support.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="frost-card p-6 text-center">
              <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Email</h3>
              <p className="text-sm text-muted-foreground">info@frosthaventubs.com</p>
            </div>
            <div className="frost-card p-6 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Hours</h3>
              <p className="text-sm text-muted-foreground">Monday – Friday<br />9:00 AM – 6:00 PM EST</p>
            </div>
            <div className="frost-card p-6 text-center">
              <HeadphonesIcon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Response Time</h3>
              <p className="text-sm text-muted-foreground">We respond within 24 business hours</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SupportPage;

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CommercialSection = () => {
  const navigate = useNavigate();
  return (
    <section className="frost-section bg-secondary/30">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Building2 className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Commercial Cold Plunge Solutions
          </h2>
          <p className="text-muted-foreground mb-8">
            Cold plunge systems designed for gyms, wellness studios, athletic training facilities, and recovery centers.
          </p>
          <Button variant="default" size="lg" onClick={() => navigate("/commercial")}>
            Request Commercial Quote
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

import { motion } from "framer-motion";
import { ShieldCheck, HeadphonesIcon, Handshake } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Manufacturer-Backed Warranties", text: "Every product includes the full manufacturer warranty for your peace of mind." },
  { icon: HeadphonesIcon, title: "Responsive Support Assistance", text: "Our team is available to help with setup, troubleshooting, and product questions." },
  { icon: Handshake, title: "Carefully Selected Partners", text: "We work only with reputable recovery equipment manufacturers and suppliers." },
];

export const WarrantyTrust = () => (
  <section className="frost-section bg-secondary/30">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Equipment You Can Trust
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <item.icon className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

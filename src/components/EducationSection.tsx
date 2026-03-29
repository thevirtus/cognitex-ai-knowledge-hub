import { motion } from "framer-motion";
import { Zap, Brain, HeartPulse } from "lucide-react";

const columns = [
  { icon: Zap, title: "Muscle Recovery Support", text: "Cold immersion helps reduce inflammation and accelerates muscle repair after intense training sessions." },
  { icon: Brain, title: "Mental Performance Routines", text: "Regular cold exposure builds mental resilience and supports focus, clarity, and stress management practices." },
  { icon: HeartPulse, title: "Circulation Response Benefits", text: "Cold therapy stimulates vascular activity, supporting healthy circulation and immune system function." },
];

export const EducationSection = () => (
  <section className="frost-section bg-background">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <span className="text-primary font-medium text-sm uppercase tracking-wider">Science-Backed</span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
          Why Cold Plunge Therapy?
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8">
        {columns.map((col, i) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="frost-card p-8 text-center"
          >
            <col.icon className="h-10 w-10 text-primary mx-auto mb-5" />
            <h3 className="text-lg font-semibold text-foreground mb-3">{col.title}</h3>
            <p className="text-muted-foreground text-sm">{col.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

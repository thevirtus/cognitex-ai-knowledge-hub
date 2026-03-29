import { motion } from "framer-motion";

export const BrandStrip = () => (
  <section className="frost-section bg-background">
    <div className="container mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-primary font-medium text-sm uppercase tracking-wider">
          Partners
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3 mb-10">
          Shop Leading Cold Plunge Brands
        </h2>
      </motion.div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="aspect-[3/2] rounded-lg border border-border bg-muted/40 flex items-center justify-center"
          >
            <span className="text-xs text-muted-foreground">Brand Logo</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/catalog";

const featured = products.slice(0, 3);

export const Products = () => {
  return (
    <section id="products" className="frost-section bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Our Collection
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Premium Cold Plunge Tubs
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our range of expertly crafted cold plunge tubs, designed to
            deliver the ultimate cold therapy experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/products">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

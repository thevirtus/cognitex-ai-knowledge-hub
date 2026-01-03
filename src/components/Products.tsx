import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Timer, ShoppingCart } from "lucide-react";
import productArctic from "@/assets/product-arctic-pro.jpg";
import productGlacier from "@/assets/product-glacier-elite.jpg";
import productPolar from "@/assets/product-polar-compact.jpg";

const products = [
  {
    id: 1,
    name: "Arctic Pro",
    description: "Advanced cooling technology with premium build quality for serious enthusiasts.",
    price: "$4,995",
    image: productArctic,
    specs: {
      temp: "39-60°F",
      capacity: "100 gal",
      time: "2hr cool",
    },
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Glacier Elite",
    description: "Sleek white design with chrome accents for a luxury wellness experience.",
    price: "$6,495",
    image: productGlacier,
    specs: {
      temp: "37-55°F",
      capacity: "120 gal",
      time: "1.5hr cool",
    },
    badge: "Premium",
  },
  {
    id: 3,
    name: "Polar Compact",
    description: "Perfect for home use with a smaller footprint and efficient cooling.",
    price: "$2,995",
    image: productPolar,
    specs: {
      temp: "42-65°F",
      capacity: "60 gal",
      time: "3hr cool",
    },
    badge: null,
  },
];

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
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group frost-card overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {product.name}
                  </h3>
                  <span className="text-lg font-bold text-primary">
                    {product.price}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm mb-4">
                  {product.description}
                </p>

                <div className="flex gap-4 mb-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4 text-primary" />
                    {product.specs.temp}
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-primary" />
                    {product.specs.capacity}
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer className="h-4 w-4 text-primary" />
                    {product.specs.time}
                  </div>
                </div>

                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

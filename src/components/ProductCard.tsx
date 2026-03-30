import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Timer, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/catalog";

interface Props {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: Props) => {
  const { addItem } = useCart();
  return (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    className="group frost-card overflow-hidden"
  >
    <Link to={`/product/${product.id}`} className="block">
      <div className="relative overflow-hidden">
        <div className="w-full aspect-square bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Image Coming Soon</span>
        </div>
        {product.badge && (
          <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-4 right-4 bg-muted text-muted-foreground text-xs font-medium px-3 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </div>
    </Link>

    <div className="p-6">
      <p className="text-xs text-muted-foreground mb-1">{product.vendor}</p>
      <div className="flex justify-between items-start mb-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <span className="text-lg font-bold text-primary ml-3 shrink-0">{product.price}</span>
      </div>

      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>

      {product.specs.temp !== "N/A" && (
        <div className="flex gap-4 mb-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Thermometer className="h-3.5 w-3.5 text-primary" />
            {product.specs.temp}
          </div>
          <div className="flex items-center gap-1">
            <Droplets className="h-3.5 w-3.5 text-primary" />
            {product.specs.capacity}
          </div>
          {product.specs.coolTime !== "N/A" && (
            <div className="flex items-center gap-1">
              <Timer className="h-3.5 w-3.5 text-primary" />
              {product.specs.coolTime}
            </div>
          )}
        </div>
      )}

      <Button variant="default" className="w-full" disabled={!product.inStock}>
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </Button>
    </div>
  </motion.div>
);

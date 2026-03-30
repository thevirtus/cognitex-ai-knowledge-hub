import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

interface Props {
  product: ShopifyProduct;
  index?: number;
}

export const ShopifyProductCard = ({ product, index = 0 }: Props) => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const p = product.node;
  const variant = p.variants.edges[0]?.node;
  const image = p.images.edges[0]?.node;
  const price = parseFloat(p.priceRange.minVariantPrice.amount);
  const available = variant?.availableForSale ?? false;

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group frost-card overflow-hidden"
    >
      <Link to={`/product/${p.handle}`} className="block">
        <div className="relative overflow-hidden">
          <div className="w-full aspect-square bg-muted flex items-center justify-center">
            {image ? (
              <img
                src={image.url}
                alt={image.altText || p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <span className="text-muted-foreground text-sm">Image Coming Soon</span>
            )}
          </div>
          {!available && (
            <span className="absolute top-4 right-4 bg-muted text-muted-foreground text-xs font-medium px-3 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </Link>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Link to={`/product/${p.handle}`}>
            <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
              {p.title}
            </h3>
          </Link>
          <span className="text-lg font-bold text-primary ml-3 shrink-0">
            ${price.toLocaleString()}
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-5 line-clamp-2">{p.description}</p>

        <Button variant="default" className="w-full" disabled={!available || isLoading} onClick={handleAddToCart}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

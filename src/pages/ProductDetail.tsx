import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useShopifyProduct } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";
import { ProductTabs } from "@/components/ProductTabs";
import { ReviewSystem } from "@/components/ReviewSystem";
import { EstimatedDelivery } from "@/components/EstimatedDelivery";
import { ShoppingCart, Truck, ShieldCheck, RotateCcw, Lock, ChevronLeft, Loader2 } from "lucide-react";

const ProductDetail = () => {
  const { id: handle } = useParams<{ id: string }>();
  const { data: product, isLoading: productLoading } = useShopifyProduct(handle || "");
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, [handle]);

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 container mx-auto flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 container mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/products"><Button variant="outline">Back to Products</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.images.edges;
  const variant = product.variants.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const available = variant?.availableForSale ?? false;

  const trust = [
    { icon: Truck, label: "Free Freight Shipping" },
    { icon: ShieldCheck, label: "Price Match Support" },
    { icon: RotateCcw, label: "30-Day Satisfaction Promise" },
    { icon: Lock, label: "Secure Checkout Protection" },
  ];

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto">
          <Link to="/products" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-8">
            <ChevronLeft className="h-4 w-4" /> Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image gallery */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="aspect-square bg-muted rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                {images[selectedImageIdx]?.node ? (
                  <img
                    src={images[selectedImageIdx].node.url}
                    alt={images[selectedImageIdx].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground">Image Coming Soon</span>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === selectedImageIdx ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img.node.url} alt={img.node.altText || ""} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{product.title}</h1>
              <p className="text-3xl font-bold text-primary mb-2">${price.toLocaleString()}</p>
              <p className={`text-sm mb-4 ${available ? "text-green-600" : "text-destructive"}`}>
                {available ? "● In Stock" : "● Out of Stock"}
              </p>

              {/* Estimated Delivery */}
              <div className="mb-5">
                <EstimatedDelivery />
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {trust.map((t) => (
                  <div key={t.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <t.icon className="h-4 w-4 text-primary shrink-0" />
                    {t.label}
                  </div>
                ))}
              </div>

              <Button variant="default" size="lg" className="w-full mb-4" disabled={!available || isLoading} onClick={handleAddToCart}>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Tabs */}
          <ProductTabs description={product.description} handle={product.handle} />

          {/* Reviews */}
          <ReviewSystem productId={product.id} productTitle={product.title} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;

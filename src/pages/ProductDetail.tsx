import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/data/catalog";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Truck, ShieldCheck, RotateCcw, Lock, ChevronLeft } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProduct(id || "");
  const { addItem } = useCart();

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

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

  const trust = [
    { icon: Truck, label: "Free Freight Shipping" },
    { icon: ShieldCheck, label: "Price Match Support" },
    { icon: RotateCcw, label: "30-Day Satisfaction Promise" },
    { icon: Lock, label: "Secure Checkout Protection" },
  ];

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
              <div className="aspect-square bg-muted rounded-xl flex items-center justify-center mb-4">
                <span className="text-muted-foreground">Image Coming Soon</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">{n}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              {product.badge && (
                <span className="inline-block bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full mb-4">{product.badge}</span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-xs text-muted-foreground mb-4">{product.vendor}</p>
              <p className="text-3xl font-bold text-primary mb-2">{product.price}</p>
              <p className={`text-sm mb-6 ${product.inStock ? "text-green-600" : "text-destructive"}`}>
                {product.inStock ? "● In Stock" : "● Out of Stock"}
              </p>

              {/* Trust indicators */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {trust.map((t) => (
                  <div key={t.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <t.icon className="h-4 w-4 text-primary shrink-0" />
                    {t.label}
                  </div>
                ))}
              </div>

              <p className="text-muted-foreground mb-6">{product.description}</p>

              {/* Specs */}
              <div className="border border-border rounded-lg overflow-hidden mb-8">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).filter(([, v]) => v && v !== "N/A").map(([key, value]) => (
                      <tr key={key} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-medium text-foreground capitalize bg-muted/40 w-1/3">{key.replace(/([A-Z])/g, " $1")}</td>
                        <td className="px-4 py-3 text-muted-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button variant="default" size="lg" className="w-full" disabled={!product.inStock} onClick={() => addItem(product)}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;

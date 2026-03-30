import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShopifyProductCard } from "@/components/ShopifyProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Search, Loader2 } from "lucide-react";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Live search with debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const searchQuery = debouncedSearch ? `title:*${debouncedSearch}*` : undefined;
  const { data: products, isLoading } = useShopifyProducts(searchQuery);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Our Products</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover our range of expertly crafted cold plunge tubs, designed to deliver the ultimate cold therapy experience.</p>
          </motion.div>

          {/* Search */}
          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (products?.length ?? 0) === 0 ? (
            <p className="text-center text-muted-foreground py-16">No products match your search.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products!.map((product, i) => (
                <ShopifyProductCard key={product.node.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;

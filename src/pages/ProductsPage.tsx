import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/catalog";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductsPage = () => {
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [availFilter, setAvailFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = products.filter((p) => {
    if (availFilter === "instock" && !p.inStock) return false;
    if (priceFilter === "under1000" && p.priceNum >= 1000) return false;
    if (priceFilter === "1000-5000" && (p.priceNum < 1000 || p.priceNum > 5000)) return false;
    if (priceFilter === "over5000" && p.priceNum <= 5000) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Our Products</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover our range of expertly crafted cold plunge tubs, designed to deliver the ultimate cold therapy experience.</p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10 items-center justify-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-56"
              />
            </div>
            <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="all">All Prices</option>
              <option value="under1000">Under $1,000</option>
              <option value="1000-5000">$1,000 – $5,000</option>
              <option value="over5000">Over $5,000</option>
            </select>
            <select value={availFilter} onChange={(e) => setAvailFilter(e.target.value)} className="text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="all">All Availability</option>
              <option value="instock">In Stock</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-16">No products match your filters.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;

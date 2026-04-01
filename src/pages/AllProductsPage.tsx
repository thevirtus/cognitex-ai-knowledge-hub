import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { categories } from "@/data/categories";
import { products as catalogProducts } from "@/data/catalog";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/data/catalog";

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $500", min: 0, max: 499 },
  { label: "$500 – $2,000", min: 500, max: 2000 },
  { label: "$2,000 – $5,000", min: 2000, max: 5000 },
  { label: "$5,000 – $10,000", min: 5000, max: 10000 },
  { label: "$10,000+", min: 10000, max: Infinity },
];

const categoryFilters = [
  { label: "All Categories", value: "all" },
  { label: "Cold Plunge Tubs", value: "cold-plunge-tubs" },
  { label: "Commercial", value: "commercial" },
  { label: "Accessories", value: "accessories" },
  { label: "Outdoor", value: "outdoor" },
  { label: "Recovery", value: "recovery" },
];

const AllProductsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Gather all unique products from catalog + categories
  const allProducts = useMemo(() => {
    const map = new Map<string, Product>();
    catalogProducts.forEach((p) => map.set(p.id, p));
    categories.forEach((cat) => cat.products.forEach((p) => map.set(p.id, p)));
    return Array.from(map.values());
  }, []);

  const filtered = useMemo(() => {
    let result = allProducts;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.vendor.toLowerCase().includes(q)
      );
    }

    // Price range
    const range = priceRanges[selectedPrice];
    if (range) {
      result = result.filter((p) => p.priceNum >= range.min && p.priceNum <= range.max);
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter((p) => {
        if (selectedCategory === "cold-plunge-tubs") return p.collection === "cold-plunge-tubs";
        if (selectedCategory === "commercial") return p.collection === "commercial-systems";
        if (selectedCategory === "accessories") return p.collection === "accessories";
        if (selectedCategory === "outdoor") return p.collection === "outdoor-units";
        if (selectedCategory === "recovery") return p.collection === "recovery-equipment";
        return true;
      });
    }

    return result.sort((a, b) => a.priceNum - b.priceNum);
  }, [allProducts, search, selectedPrice, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">All Cold Plunges</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Browse our full range of cold plunge systems for home, recovery, and commercial environments.</p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10 items-stretch sm:items-center justify-center flex-wrap">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50"
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(Number(e.target.value))}
                className="w-full sm:w-48 pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 appearance-none cursor-pointer"
              >
                {priceRanges.map((r, i) => (
                  <option key={i} value={i}>{r.label}</option>
                ))}
              </select>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 appearance-none cursor-pointer"
            >
              {categoryFilters.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No products match your filters.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllProductsPage;

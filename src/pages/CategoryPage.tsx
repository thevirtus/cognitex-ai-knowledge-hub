import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShopifyProductCard } from "@/components/ShopifyProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { getCategoryMapping } from "@/data/categoryMappings";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const CategoryPage = () => {
  const { parent, slug } = useParams<{ parent: string; slug: string }>();
  const category = getCategoryMapping(parent || "", slug || "");
  const { data: allProducts, isLoading } = useShopifyProducts();

  useEffect(() => { window.scrollTo(0, 0); }, [parent, slug]);

  const filtered = useMemo(() => {
    if (!allProducts || !category) return [];
    const keywords = category.filterKeywords.map(k => k.toLowerCase());
    return allProducts.filter((p) => {
      const title = p.node.title.toLowerCase();
      const desc = p.node.description.toLowerCase();
      return keywords.some(kw => title.includes(kw) || desc.includes(kw));
    });
  }, [allProducts, category]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 container mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Category Not Found</h1>
          <Link to="/products"><Button variant="outline">Back to Products</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <Link to="/products" className="text-primary text-sm hover:underline">← All Products</Link>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">{category.name}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No products found in this category.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p, i) => (
                <ShopifyProductCard key={p.node.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;

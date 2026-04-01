import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShopifyProductCard } from "@/components/ShopifyProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const collectionMeta: Record<string, { name: string; description: string; keywords: string[] }> = {
  "cold-plunge-tubs": {
    name: "Cold Plunge Tubs",
    description: "Our complete lineup of cold plunge tubs for residential, portable, and indoor use.",
    keywords: ["plunge", "tub", "cold", "bath", "ice"],
  },
  "commercial-systems": {
    name: "Commercial Systems",
    description: "Enterprise-grade cold plunge systems for gyms, spas, and sports facilities.",
    keywords: ["commercial", "gym", "spa", "sports", "team", "facility", "enterprise"],
  },
  accessories: {
    name: "Accessories",
    description: "Chillers, covers, filters, and water treatment products for your cold plunge setup.",
    keywords: ["chiller", "cover", "filter", "water", "ozone", "uv", "valve", "accessory"],
  },
  "outdoor-units": {
    name: "Outdoor Units",
    description: "Cold plunge systems designed for outdoor installation and all-weather use.",
    keywords: ["outdoor", "weather", "patio", "deck"],
  },
  "recovery-equipment": {
    name: "Recovery Equipment",
    description: "Specialized recovery tools and equipment for athletes and wellness enthusiasts.",
    keywords: ["recovery", "athlete", "performance", "therapy"],
  },
};

const CollectionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const collection = slug ? collectionMeta[slug] : undefined;
  const { data: allProducts, isLoading } = useShopifyProducts();

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const filtered = useMemo(() => {
    if (!allProducts || !collection) return [];
    const keywords = collection.keywords.map(k => k.toLowerCase());
    return allProducts.filter((p) => {
      const title = p.node.title.toLowerCase();
      const desc = p.node.description.toLowerCase();
      return keywords.some(kw => title.includes(kw) || desc.includes(kw));
    });
  }, [allProducts, collection]);

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 container mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Collection Not Found</h1>
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
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">{collection.name}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{collection.description}</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No products found in this collection.</p>
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

export default CollectionPage;

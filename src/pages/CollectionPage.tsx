import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { collections, getProductsByCollection } from "@/data/catalog";
import { Button } from "@/components/ui/button";

const CollectionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const collection = collections.find((c) => c.slug === slug);
  const collectionProducts = getProductsByCollection(slug || "");

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collectionProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionPage;

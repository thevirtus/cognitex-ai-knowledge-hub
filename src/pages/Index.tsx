import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Products } from "@/components/Products";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Products />
        <About />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

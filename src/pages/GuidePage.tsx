import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookOpen, Home, Building2, Wrench, Zap, Brain, HeartPulse } from "lucide-react";

const GuidePage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const benefits = [
    { icon: Zap, title: "Accelerated Recovery", text: "Cold immersion reduces inflammation and muscle soreness after workouts, speeding up the body's natural repair processes." },
    { icon: Brain, title: "Mental Clarity & Focus", text: "Cold exposure triggers norepinephrine release, enhancing alertness, mood, and cognitive performance." },
    { icon: HeartPulse, title: "Improved Circulation", text: "The cold stimulates blood flow and supports cardiovascular health through vascular constriction and dilation cycles." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Cold Plunge Buying Guide</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to know before investing in a cold plunge system for your home or facility.</p>
          </motion.div>

          {/* Benefits */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Benefits Overview</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((b, i) => (
                <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="frost-card p-6 text-center">
                  <b.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-muted-foreground text-sm">{b.text}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Home vs Commercial */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Home vs. Commercial Considerations</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="frost-card p-8">
                <Home className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-3">Home Use</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 60–120 gallon capacity is typically sufficient</li>
                  <li>• Standard 110V electrical outlet compatible</li>
                  <li>• Indoor or covered outdoor placement recommended</li>
                  <li>• Budget range: $2,000 – $7,000</li>
                </ul>
              </div>
              <div className="frost-card p-8">
                <Building2 className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-3">Commercial Use</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 150–300+ gallon capacity for multi-user environments</li>
                  <li>• 220V dedicated circuit typically required</li>
                  <li>• Auto-filtration and sanitation systems recommended</li>
                  <li>• Budget range: $8,000 – $20,000+</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Installation */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Installation Expectations</h2>
            <div className="frost-card p-8">
              <Wrench className="h-8 w-8 text-primary mb-4" />
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• <strong className="text-foreground">Location:</strong> Level surface with adequate drainage access. Indoor setups need ventilation.</li>
                <li>• <strong className="text-foreground">Electrical:</strong> Most home units use a standard outlet. Commercial units may require a dedicated 220V circuit.</li>
                <li>• <strong className="text-foreground">Water Supply:</strong> Garden hose connection for initial fill. Filtration systems handle ongoing water quality.</li>
                <li>• <strong className="text-foreground">Delivery:</strong> Large equipment arrives via freight carrier with curbside delivery. White-glove placement available.</li>
                <li>• <strong className="text-foreground">Timeline:</strong> Most units can be filled and operational within 4–8 hours of delivery.</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuidePage;

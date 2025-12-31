import { motion } from "framer-motion";
import { Award, Leaf, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Zap,
    title: "Rapid Cooling",
    description: "Reach target temperature in under 2 hours with our advanced cooling system.",
  },
  {
    icon: Shield,
    title: "Built to Last",
    description: "Premium materials and 10-year warranty ensure lasting performance.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Energy-efficient design with sustainable materials and low power consumption.",
  },
  {
    icon: Award,
    title: "Award-Winning",
    description: "Recognized by wellness experts for excellence in cold therapy innovation.",
  },
];

export const About = () => {
  return (
    <section id="about" className="frost-section bg-secondary/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
              Pioneering Cold Therapy Excellence
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Founded in 2019, Frosthaven was born from a simple belief: everyone
              deserves access to the transformative power of cold therapy. What
              started as a quest for the perfect cold plunge has evolved into a
              mission to bring premium wellness experiences to homes worldwide.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our team of engineers, wellness experts, and athletes work together
              to design tubs that don't just meet expectations—they redefine them.
              Every Frosthaven tub is a testament to our commitment to quality,
              innovation, and your well-being.
            </p>
            <Button variant="default" size="lg">
              Learn Our Story
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-card rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

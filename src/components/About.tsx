import { motion } from "framer-motion";
import { Heart, Leaf, Shield, Truck } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Wellness First",
    description: "Cold therapy supports recovery, reduces inflammation, and boosts mental clarity.",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Every tub we offer is carefully selected for durability and performance.",
  },
  {
    icon: Leaf,
    title: "Eco-Conscious",
    description: "Energy-efficient models that minimize environmental impact.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Free shipping with quick, reliable delivery right to your door.",
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
              Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
              Making Cold Therapy Accessible
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              At Frosthaven Tubs, we believe everyone deserves access to the
              transformative benefits of cold plunge therapy. We've partnered
              with top manufacturers to bring you premium cold plunge tubs at
              accessible prices.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Whether you're an athlete seeking faster recovery, a wellness
              enthusiast exploring new routines, or simply curious about cold
              therapy—we're here to help you find the perfect tub for your
              lifestyle.
            </p>
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

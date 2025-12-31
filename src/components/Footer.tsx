import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import logo from "@/assets/frosthaven-logo.png";

export const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-primary-foreground">
      {/* CTA Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Wellness?
            </h2>
            <p className="text-primary-foreground/70 mb-8">
              Join thousands who have discovered the power of cold therapy with
              Frosthaven. Get started today with free shipping on all orders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Shop Now
              </Button>
              <Button variant="heroOutline" size="lg">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto py-16 px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <img src={logo} alt="Frosthaven" className="h-10 w-auto mb-6 brightness-0 invert" />
            <p className="text-primary-foreground/60 text-sm mb-6">
              Premium cold plunge tubs engineered for performance and designed
              for luxury.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              {["Products", "About Us", "Testimonials", "FAQ", "Blog"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-primary-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              {[
                "Shipping & Returns",
                "Warranty",
                "Installation Guide",
                "Maintenance Tips",
                "Contact Support",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/60">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                hello@frosthaven.com
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                1-800-FROST-TUB
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>123 Glacier Way<br />Denver, CO 80202</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
          <p>&copy; 2025 Frosthaven Tubs. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/frosthaven-logo.png";

const navLinks = [
  { name: "Products", href: "/products", isRoute: true },
  { name: "About", href: "#about", isRoute: false },
  { name: "Testimonials", href: "#testimonials", isRoute: false },
  { name: "Contact", href: "#contact", isRoute: false },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if header should use dark text (on products page or when scrolled)
  const useDarkText = !isHomePage || isScrolled;

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.isRoute) {
      navigate(link.href);
    } else {
      // If we're not on the home page, navigate there first then scroll
      if (!isHomePage) {
        const sectionId = link.href.replace("#", "");
        navigate("/");
        // Use setTimeout to wait for navigation, then scroll
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById(link.href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        useDarkText
          ? "frost-glass shadow-soft py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Frosthaven" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className={`text-sm font-medium transition-colors ${
                useDarkText ? "text-foreground hover:text-primary" : "text-white hover:text-white/80"
              }`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" className={useDarkText ? "" : "text-white hover:text-white/80 hover:bg-white/10"}>
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button 
            variant="default"
            onClick={() => navigate("/products")}
          >
            Shop Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className={`h-6 w-6 ${useDarkText ? "text-foreground" : "text-white"}`} />
          ) : (
            <Menu className={`h-6 w-6 ${useDarkText ? "text-foreground" : "text-white"}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden frost-glass border-t border-border"
          >
            <nav className="container mx-auto py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavClick(link);
                  }}
                  className="text-foreground font-medium py-2 hover:text-primary transition-colors text-left"
                >
                  {link.name}
                </button>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Button variant="outline" className="w-full">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart
                </Button>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/products");
                  }}
                >
                  Shop Now
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

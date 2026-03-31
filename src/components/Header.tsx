import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { LiveSearch } from "@/components/LiveSearch";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import logo from "@/assets/frosthaven-logo.png";

const mainNav = [
  { name: "Products", href: "/products", isRoute: true },
  { name: "Commercial", href: "/commercial", isRoute: true },
  { name: "Brands", href: "/brands", isRoute: true },
  { name: "About", href: "#about", isRoute: false },
  { name: "Contact", href: "#contact", isRoute: false },
];

const secondaryNav = [
  { name: "Shipping", href: "/shipping" },
  { name: "Warranty", href: "/warranty" },
  { name: "Support", href: "/support" },
  { name: "Cold Plunge Guide", href: "/guide" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore(state => state.items.reduce((s, i) => s + i.quantity, 0));
  const setIsOpen = useCartStore(state => state.setIsOpen);
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

  const useDarkText = !isHomePage || isScrolled;

  const handleNavClick = (link: { href: string; isRoute: boolean }) => {
    setIsMobileMenuOpen(false);
    if (link.isRoute) {
      navigate(link.href);
    } else if (!isHomePage) {
      navigate("/");
      setTimeout(() => document.getElementById(link.href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      document.getElementById(link.href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
    <>
      {/* Secondary nav bar */}
      <div className={`fixed top-0 left-0 right-0 z-[51] transition-all duration-300 ${useDarkText || isMobileMenuOpen ? "bg-foreground text-primary-foreground" : "bg-foreground/40 backdrop-blur-sm text-primary-foreground/80"}`}>
        <div className="container mx-auto flex items-center justify-end gap-6 py-1.5 px-4">
          {secondaryNav.map((link) => (
            <Link key={link.name} to={link.href} className="text-[11px] hover:text-primary transition-colors hidden md:block">
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <header
        className={`fixed top-7 left-0 right-0 z-50 transition-all duration-300 ${
          useDarkText || isMobileMenuOpen ? "frost-glass shadow-soft py-3" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="Frosthaven" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {mainNav.map((link) => (
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

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-3">
            <LiveSearch useDarkText={useDarkText} />
            <Button variant="ghost" size="icon" className={`relative ${useDarkText ? "" : "text-white hover:text-white/80 hover:bg-white/10"}`} onClick={() => setIsOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            <Button variant="default" onClick={() => navigate("/products")}>
              Shop Now
            </Button>
          </div>

          {/* Mobile: cart + menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button variant="ghost" size="icon" className={`relative ${useDarkText ? "" : "text-white hover:text-white/80 hover:bg-white/10"}`} onClick={() => setIsOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            <button
              className="p-2"
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
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden bg-background border-t border-border absolute inset-x-0 top-full z-50 h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain"
              >
                <nav className="container mx-auto min-h-full py-6 px-4 flex flex-col gap-3">
                  {mainNav.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link)}
                      className="text-foreground font-medium py-2 hover:text-primary transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  ))}
                  <div className="border-t border-border pt-3 mt-2 flex flex-col gap-2">
                    {secondaryNav.map((link) => (
                      <Link key={link.name} to={link.href} className="text-sm text-muted-foreground py-1.5 hover:text-primary transition-colors">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 pt-4 border-t border-border">
                    <LiveSearch useDarkText={true} mobile onClose={() => setIsMobileMenuOpen(false)} />
                    <Button variant="default" className="w-full" onClick={() => navigate("/products")}>
                      Shop Now
                    </Button>
                  </div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const useDarkText = !isHomePage || isScrolled;

  const handleNavClick = (link: { href: string; isRoute: boolean }) => {
    if (link.isRoute) {
      navigate(link.href);
    } else if (!isHomePage) {
      navigate("/");
      setTimeout(() => document.getElementById(link.href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      document.getElementById(link.href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Secondary nav bar */}
      <div className={`fixed top-0 left-0 right-0 z-[51] transition-all duration-300 ${useDarkText ? "bg-foreground text-primary-foreground" : "bg-foreground/40 backdrop-blur-sm text-primary-foreground/80"}`}>
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
          useDarkText ? "frost-glass shadow-soft py-3" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
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

          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSearch}
                  className="overflow-hidden"
                >
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
                    onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              className={useDarkText ? "" : "text-white hover:text-white/80 hover:bg-white/10"}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className={useDarkText ? "" : "text-white hover:text-white/80 hover:bg-white/10"}>
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="default" onClick={() => navigate("/products")}>
              Shop Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
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
              className="lg:hidden frost-glass border-t border-border"
            >
              <nav className="container mx-auto py-6 flex flex-col gap-3">
                {mainNav.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => { setIsMobileMenuOpen(false); handleNavClick(link); }}
                    className="text-foreground font-medium py-2 hover:text-primary transition-colors text-left"
                  >
                    {link.name}
                  </button>
                ))}
                <div className="border-t border-border pt-3 mt-2 flex flex-col gap-2">
                  {secondaryNav.map((link) => (
                    <Link key={link.name} to={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-muted-foreground py-1.5 hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                  <form onSubmit={handleSearch}>
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What are you looking for?"
                      className="w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </form>
                  <Button variant="default" className="w-full" onClick={() => { setIsMobileMenuOpen(false); navigate("/products"); }}>
                    Shop Now
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

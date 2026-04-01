import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MegaMenuCategory {
  title: string;
  links: Array<{ name: string; href: string }>;
}

const megaMenuData: MegaMenuCategory[] = [
  {
    title: "Cold Plunge Tubs",
    links: [
      { name: "All Cold Plunges", href: "/products" },
      { name: "Residential Units", href: "/products?q=residential" },
      { name: "Portable Systems", href: "/products?q=portable" },
      { name: "Indoor Models", href: "/products?q=indoor" },
    ],
  },
  {
    title: "Commercial",
    links: [
      { name: "Commercial Systems", href: "/commercial" },
      { name: "Gym & Fitness", href: "/products?q=gym" },
      { name: "Spa & Wellness", href: "/products?q=spa" },
      { name: "Sports Recovery", href: "/products?q=recovery" },
    ],
  },
  {
    title: "Accessories",
    links: [
      { name: "Chillers", href: "/products?q=chiller" },
      { name: "Covers & Lids", href: "/products?q=cover" },
      { name: "Filters & Parts", href: "/products?q=filter" },
      { name: "Water Treatment", href: "/products?q=treatment" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Cold Plunge Guide", href: "/guide" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Warranty", href: "/warranty" },
      { name: "Support", href: "/support" },
    ],
  },
];

interface MegaMenuProps {
  useDarkText: boolean;
}

export const MegaMenu = ({ useDarkText }: MegaMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
          useDarkText ? "text-foreground hover:text-primary" : "text-white hover:text-white/80"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Shop
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[600px] max-w-[calc(100vw-2rem)] bg-popover border border-border rounded-xl shadow-medium p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 z-[60]"
          >
            {megaMenuData.map((category) => (
              <div key={category.title}>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                  {category.title}
                </h4>
                <ul className="space-y-2">
                  {category.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

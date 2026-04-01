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
      { name: "Residential Units", href: "/cold-plunge-tubs/residential-units" },
      { name: "Portable Systems", href: "/cold-plunge-tubs/portable-systems" },
      { name: "Indoor Models", href: "/cold-plunge-tubs/indoor-models" },
    ],
  },
  {
    title: "Commercial",
    links: [
      { name: "Commercial Systems", href: "/commercial" },
      { name: "Gym & Fitness", href: "/commercial/gym-fitness" },
      { name: "Spa & Wellness", href: "/commercial/spa-wellness" },
      { name: "Sports Recovery", href: "/commercial/sports-recovery" },
    ],
  },
  {
    title: "Accessories",
    links: [
      { name: "Chillers", href: "/accessories/chillers" },
      { name: "Covers & Lids", href: "/accessories/covers-lids" },
      { name: "Filters & Parts", href: "/accessories/filters-parts" },
      { name: "Water Treatment", href: "/accessories/water-treatment" },
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

export { megaMenuData };
export type { MegaMenuCategory };

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

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

interface LiveSearchProps {
  useDarkText: boolean;
  onClose?: () => void;
  mobile?: boolean;
}

export const LiveSearch = ({ useDarkText, onClose, mobile }: LiveSearchProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(!!mobile);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const searchQuery = debouncedQuery.length >= 2 ? `title:*${debouncedQuery}*` : undefined;
  const { data: products, isLoading } = useShopifyProducts(searchQuery);

  useEffect(() => {
    setShowResults(debouncedQuery.length >= 2);
  }, [debouncedQuery]);

  useEffect(() => {
    if (mobile) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, mobile]);

  const handleSelect = (handle: string) => {
    navigate(`/product/${handle}`);
    setOpen(false);
    setQuery("");
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery("");
      onClose?.();
    }
  };

  if (mobile) {
    return (
      <div ref={wrapperRef} className="relative">
        <form onSubmit={handleSubmit}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </form>
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-2 w-full bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-[100]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : !products?.length ? (
                <p className="text-sm text-muted-foreground text-center py-4">No results found</p>
              ) : (
                <ul className="max-h-48 overflow-y-auto">
                  {products.slice(0, 5).map((p) => (
                    <li key={p.node.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(p.node.handle)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent transition-colors"
                      >
                        {p.node.images.edges[0]?.node.url && (
                          <img src={p.node.images.edges[0].node.url} alt={p.node.title} className="w-8 h-8 rounded object-cover bg-muted" />
                        )}
                        <span className="text-sm text-foreground truncate">{p.node.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative flex items-center">
      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50"
            />
          </motion.form>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-md transition-colors ${
          useDarkText ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10"
        }`}
      >
        <Search className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && showResults && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-full mt-2 w-72 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-[100]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : !products?.length ? (
              <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
            ) : (
              <ul className="max-h-64 overflow-y-auto">
                {products.slice(0, 6).map((p) => (
                  <li key={p.node.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(p.node.handle)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-accent transition-colors"
                    >
                      {p.node.images.edges[0]?.node.url && (
                        <img src={p.node.images.edges[0].node.url} alt={p.node.title} className="w-10 h-10 rounded object-cover bg-muted" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.node.title}</p>
                        <p className="text-xs text-muted-foreground">
                          ${parseFloat(p.node.priceRange.minVariantPrice.amount).toFixed(2)}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={handleSubmit as any}
                    className="w-full text-center text-xs text-primary font-medium py-2 hover:bg-accent transition-colors"
                  >
                    View all results →
                  </button>
                </li>
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

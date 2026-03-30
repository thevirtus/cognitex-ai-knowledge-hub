import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import CollectionPage from "./pages/CollectionPage";
import CommercialPage from "./pages/CommercialPage";
import BrandsPage from "./pages/BrandsPage";
import ShippingPage from "./pages/ShippingPage";
import WarrantyPage from "./pages/WarrantyPage";
import SupportPage from "./pages/SupportPage";
import GuidePage from "./pages/GuidePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
      <Toaster />
      <Sonner />
      <CartDrawer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/collection/:slug" element={<CollectionPage />} />
          <Route path="/commercial" element={<CommercialPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/warranty" element={<WarrantyPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/guide" element={<GuidePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

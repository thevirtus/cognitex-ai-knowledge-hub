import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartDrawer } from "@/components/CartDrawer";
import { LiveChatWidget } from "@/components/LiveChatWidget";
import { useCartSync } from "@/hooks/useCartSync";
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
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPage from "./pages/RefundPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  return (
    <>
      <CartDrawer />
      <LiveChatWidget />
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
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund" element={<RefundPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

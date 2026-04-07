import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/i18n";
import Index from "./pages/Index";
import About from "./pages/About";
import Studio from "./pages/Studio";
import Contact from "./pages/Contact";
import SelectedWorks from "./pages/SelectedWorks";
import AllWorks from "./pages/AllWorks";
import ArtworkDetail from "./pages/ArtworkDetail";
import Collections from "./pages/Collections";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import NotFound from "./pages/NotFound";
import LegalPage from "./pages/legal/LegalPage";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminArtworks from "./pages/admin/Artworks";
import ArtworkForm from "./pages/admin/ArtworkForm";
import Inquiries from "./pages/admin/Inquiries";
import Commissions from "./pages/admin/Commissions";
import SiteSettings from "./pages/admin/SiteSettings";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <I18nProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/cv" element={<About />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/selected-works" element={<SelectedWorks />} />
              <Route path="/works" element={<AllWorks />} />
              <Route path="/artwork/:slug" element={<ArtworkDetail />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel" element={<CheckoutCancel />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/artworks" element={<ProtectedRoute><AdminArtworks /></ProtectedRoute>} />
              <Route path="/admin/artworks/new" element={<ProtectedRoute><ArtworkForm /></ProtectedRoute>} />
              <Route path="/admin/artworks/:id" element={<ProtectedRoute><ArtworkForm /></ProtectedRoute>} />
              <Route path="/admin/inquiries" element={<ProtectedRoute><Inquiries /></ProtectedRoute>} />
              <Route path="/admin/commissions" element={<ProtectedRoute><Commissions /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><SiteSettings /></ProtectedRoute>} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

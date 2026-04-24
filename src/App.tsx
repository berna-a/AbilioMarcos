import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/i18n";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import Index from "./pages/Index";
import About from "./pages/About";
// Studio page intentionally not imported in V1 — preserved at src/pages/Studio.tsx for V2
import Contact from "./pages/Contact";
// SelectedWorks page intentionally not imported in V1 — `/selected-works` redirects to `/works`
import AllWorks from "./pages/AllWorks";
import ArtworkDetail from "./pages/ArtworkDetail";
import Collections from "./pages/Collections";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import NotFound from "./pages/NotFound";
import LegalPage from "./pages/legal/LegalPage";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import CookiePolicy from "./pages/legal/CookiePolicy";
import DisputeResolution from "./pages/legal/DisputeResolution";
import TermsConditions from "./pages/legal/TermsConditions";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminArtworks from "./pages/admin/Artworks";
import ArtworkForm from "./pages/admin/ArtworkForm";
import Inquiries from "./pages/admin/Inquiries";
import Commissions from "./pages/admin/Commissions";
import SiteSettings from "./pages/admin/SiteSettings";
import AdminAnalytics from "./pages/admin/Analytics";
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
            <AnalyticsProvider />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/cv" element={<About />} />
              <Route path="/studio" element={<Navigate to="/" replace />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/selected-works" element={<Navigate to="/works" replace />} />
              <Route path="/works" element={<AllWorks />} />
              <Route path="/artwork/:slug" element={<ArtworkDetail />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel" element={<CheckoutCancel />} />

              {/* Legal pages */}
              <Route path="/legal/privacy" element={<PrivacyPolicy />} />
              <Route path="/legal/cookies" element={<CookiePolicy />} />
              <Route path="/legal/terms" element={<TermsConditions />} />
              <Route path="/legal/disputes" element={<DisputeResolution />} />
              <Route path="/legal/complaints" element={<LegalPage titleKey="complaintsTitle" />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/artworks" element={<ProtectedRoute><AdminArtworks /></ProtectedRoute>} />
              <Route path="/admin/artworks/new" element={<ProtectedRoute><ArtworkForm /></ProtectedRoute>} />
              <Route path="/admin/artworks/:id" element={<ProtectedRoute><ArtworkForm /></ProtectedRoute>} />
              <Route path="/admin/inquiries" element={<ProtectedRoute><Inquiries /></ProtectedRoute>} />
              <Route path="/admin/commissions" element={<ProtectedRoute><Commissions /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
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

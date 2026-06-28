import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/i18n";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Páginas CRÍTICAS (SEO + performance) — carregadas no bundle inicial.
import Index from "./pages/Index";
import AllWorks from "./pages/AllWorks";
import ArtworkDetail from "./pages/ArtworkDetail";

// Restantes rotas — code-split (lazy) para aliviar o bundle inicial.
// Studio/SelectedWorks intencionalmente não usados em V1 (preservados em src/pages).
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const LinksPage = lazy(() => import("./pages/LinksPage"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutCancel = lazy(() => import("./pages/CheckoutCancel"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ComplaintsPage = lazy(() => import("./pages/legal/ComplaintsPage"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy"));
const DisputeResolution = lazy(() => import("./pages/legal/DisputeResolution"));
const TermsConditions = lazy(() => import("./pages/legal/TermsConditions"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminArtworks = lazy(() => import("./pages/admin/Artworks"));
const ArtworkForm = lazy(() => import("./pages/admin/ArtworkForm"));
const Inquiries = lazy(() => import("./pages/admin/Inquiries"));
const Commissions = lazy(() => import("./pages/admin/Commissions"));
const SiteSettings = lazy(() => import("./pages/admin/SiteSettings"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminAboutContent = lazy(() => import("./pages/admin/AboutContent"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ObrasDisponiveis = lazy(() => import("./pages/ObrasDisponiveis"));

const queryClient = new QueryClient();

/** Fallback minimalista enquanto a rota lazy carrega — sem flash, evita layout shift. */
const PageFallback = () => <div className="min-h-screen" aria-hidden="true" />;

/** Redirect /artwork/:slug → /obra/:slug (legacy URL preservation). */
const LegacyArtworkRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/obra/${slug ?? ''}`} replace />;
};

const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      // Preserve the hash so ResetPassword.tsx can read the token
      navigate('/reset-password' + hash, { replace: true });
    }
  }, [navigate]);

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />

        {/* Public routes (PT-PT) */}
        <Route path="/sobre" element={<About />} />
        <Route path="/cv" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/obras" element={<AllWorks />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/obras-disponiveis" element={<ObrasDisponiveis />} />
        <Route path="/obra/:slug" element={<ArtworkDetail />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/cancel" element={<CheckoutCancel />} />

        {/* Legacy English URL redirects (preserve external links) */}
        <Route path="/about" element={<Navigate to="/sobre" replace />} />
        <Route path="/contact" element={<Navigate to="/contacto" replace />} />
        <Route path="/works" element={<Navigate to="/obras" replace />} />
        <Route path="/artwork/:slug" element={<LegacyArtworkRedirect />} />
        <Route path="/collections" element={<Navigate to="/obras" replace />} />
        <Route path="/colecoes" element={<Navigate to="/obras" replace />} />
        <Route path="/selected-works" element={<Navigate to="/obras" replace />} />
        <Route path="/studio" element={<Navigate to="/" replace />} />

        {/* Legal pages */}
        <Route path="/legal/privacy" element={<PrivacyPolicy />} />
        <Route path="/legal/cookies" element={<CookiePolicy />} />
        <Route path="/legal/terms" element={<TermsConditions />} />
        <Route path="/legal/disputes" element={<DisputeResolution />} />
        <Route path="/legal/complaints" element={<ComplaintsPage />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/artworks" element={<ProtectedRoute><AdminArtworks /></ProtectedRoute>} />
        <Route path="/admin/artworks/new" element={<ProtectedRoute><ArtworkForm /></ProtectedRoute>} />
        <Route path="/admin/artworks/:id" element={<ProtectedRoute><ArtworkForm /></ProtectedRoute>} />
        <Route path="/admin/sobre" element={<ProtectedRoute><AdminAboutContent /></ProtectedRoute>} />
        <Route path="/admin/inquiries" element={<ProtectedRoute><Inquiries /></ProtectedRoute>} />
        <Route path="/admin/commissions" element={<ProtectedRoute><Commissions /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><SiteSettings /></ProtectedRoute>} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <I18nProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AnalyticsProvider />
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

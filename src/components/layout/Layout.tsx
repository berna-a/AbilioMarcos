import { ReactNode } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useT } from "@/i18n";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  const t = useT();
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-white focus:text-foreground focus:px-4 focus:py-2 focus:shadow-lg focus:outline focus:outline-2 focus:outline-foreground text-[13px] tracking-wide"
      >
        {t.nav.skipToContent}
      </a>
      <Header />
      <motion.main
        id="content"
        tabIndex={-1}
        className="flex-1 focus:outline-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.main>
      {!hideFooter && <Footer />}
      <WhatsAppFloat />
      <CookieConsent />
    </div>
  );
};

export default Layout;
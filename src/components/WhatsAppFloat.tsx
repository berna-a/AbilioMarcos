import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/i18n";
import { track } from "@/lib/analytics";

const WHATSAPP_URL = "https://wa.me/351968181117";

const WhatsAppFloat = () => {
  const t = useT();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Hide on admin routes — internal tool
  const onAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (onAdmin) return null;

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.whatsappFloat.label}
          onClick={() => track("whatsapp_float_click")}
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.92 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="group fixed bottom-5 right-5 md:bottom-7 md:right-7 z-50 inline-flex items-center"
        >
          <span className="hidden md:flex items-center pr-3 pl-4 py-2.5 mr-[-14px] text-[11px] tracking-[0.15em] uppercase bg-background/95 border border-border text-foreground/75 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-sm rounded-l-full">
            {t.whatsappFloat.label}
          </span>
          <span className="relative flex items-center justify-center w-12 h-12 md:w-[52px] md:h-[52px] rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe5a] transition-colors duration-300 ring-1 ring-black/5">
            <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-[22px] md:h-[22px]" fill="currentColor" aria-hidden="true">
              <path d="M19.11 4.91A10 10 0 0 0 4.07 18.2L3 22l3.9-1.02a10 10 0 0 0 12.21-15.07Zm-7.1 15.36a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-2.31.6.62-2.25-.2-.31a8.3 8.3 0 1 1 6.42 3.3Zm4.55-6.22c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.65.81-.8.97-.15.17-.3.19-.55.07-.25-.13-1.05-.39-2-1.24a7.5 7.5 0 0 1-1.39-1.73c-.15-.25 0-.39.11-.51.11-.11.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.07-.13-.56-1.36-.78-1.86-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.45.06-.69.32-.23.25-.9.88-.9 2.15s.92 2.5 1.05 2.67c.13.17 1.81 2.78 4.4 3.9.61.27 1.09.43 1.46.55.61.2 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.3Z" />
            </svg>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppFloat;

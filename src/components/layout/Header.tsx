import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SignatureLogo from "./SignatureLogo";
import { useI18n, localeLabels, localeNames } from "@/i18n";
import { Locale } from "@/i18n/types";
import { track } from "@/lib/analytics";

const localeFlags: Record<Locale, string> = {
  pt: "🇵🇹",
  en: "🇬🇧",
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
};

const localeOrder: Locale[] = ["pt", "en", "fr", "de", "es"];

const navKeys = ["allWorks", "about", "contact"] as const;
const navHrefs = ["/obras", "/sobre", "/contacto"];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { locale, setLocale, t } = useI18n();

  const navItems = navKeys.map((key, i) => ({
    label: t.nav[key],
    href: navHrefs[i],
  }));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  // Close lang dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const handleClick = () => setLangOpen(false);
    const timer = setTimeout(() => document.addEventListener("click", handleClick), 0);
    return () => { clearTimeout(timer); document.removeEventListener("click", handleClick); };
  }, [langOpen]);

  const heroState = isHome && !isScrolled;

  const LanguageDropdown = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
        className={`flex items-center gap-1.5 text-[13px] tracking-[0.12em] uppercase transition-colors duration-500 px-2 py-1 ${
          mobile
            ? "text-brand-brown hover:text-brand-brown/80"
            : heroState
              ? "text-brand-brown/70 hover:text-brand-brown"
              : "text-brand-brown/75 hover:text-brand-brown"
        }`}
      >
        <span className="text-sm leading-none">{localeFlags[locale]}</span>
        <span>{localeLabels[locale]}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${mobile ? "text-brand-brown" : ""} ${langOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {langOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className={`absolute top-full ${mobile ? "right-0" : "right-0"} mt-2 bg-background border border-border shadow-lg py-2 min-w-[140px] z-[60]`}
            onClick={(e) => e.stopPropagation()}
          >
            {localeOrder.map((l) => (
              <button
                key={l}
                onClick={() => { track('language_changed', { language: l }); setLocale(l); setLangOpen(false); }}
                className={`flex items-center gap-3 w-full text-left px-4 py-2 text-[13px] tracking-[0.08em] transition-colors duration-200 ${
                  locale === l
                    ? "text-foreground font-medium"
                    : "text-foreground/40 hover:text-foreground/70 hover:bg-muted/40"
                }`}
              >
                <span className="text-base leading-none">{localeFlags[l]}</span>
                <span>{localeNames[l]}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-sm border-b border-brand-brown/10"
            : isHome
              ? "bg-transparent border-b border-transparent"
              : "bg-white border-b border-brand-brown/10"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-[76px]">
            <Link
              to="/"
              aria-label="Abílio Marcos"
              className={`transition-all duration-700 ${
                heroState
                  ? "opacity-0 pointer-events-none -translate-y-1"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <SignatureLogo className="h-9 w-auto md:h-11" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`text-[13px] tracking-[0.18em] uppercase transition-colors duration-500 relative ${
                      isActive ? "text-brand-brown" : "text-brand-brown/70 hover:text-brand-brown"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-px bg-brand-brown/40" />
                    )}
                  </Link>
                );
              })}

              <div className="w-px h-4 bg-brand-brown opacity-20 mx-1" />
              <LanguageDropdown />
            </nav>

            {/* Mobile/tablet: lang only in hero state; hamburger only when navbar is solid */}
            <div className="flex items-center gap-3 lg:hidden shrink-0">
              {heroState && <LanguageDropdown mobile />}
              <button
                type="button"
                className={`inline-flex items-center justify-center w-11 h-11 -mr-2 bg-transparent text-brand-brown hover:text-brand-brown/80 transition-all duration-300 shrink-0 ${
                  !heroState ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X size={26} strokeWidth={2.25} /> : <Menu size={26} strokeWidth={2.25} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background flex flex-col justify-center items-center"
          >
            <nav className="flex flex-col items-center gap-7">
              {navItems.map((item, i) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <Link
                      to={item.href}
                      className={`font-serif text-2xl tracking-wide transition-colors ${
                        isActive ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Language selector inside mobile menu */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.04 + 0.05, duration: 0.3 }}
                className="mt-6 pt-6 border-t border-border/40 flex flex-col items-center"
              >
                <LanguageDropdown mobile />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

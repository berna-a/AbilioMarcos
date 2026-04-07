import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SignatureLogo from "./SignatureLogo";
import { useI18n, localeLabels } from "@/i18n";
import { Locale } from "@/i18n/types";

const navKeys = ["selectedWorks", "allWorks", "studio", "about", "contact"] as const;
const navHrefs = ["/selected-works", "/works", "/studio", "/about", "/contact"];

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

  const heroState = isHome && !isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isScrolled
            ? "bg-background/95 backdrop-blur-sm border-b border-gallery-border"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-[76px]">
            <Link
              to="/"
              aria-label="Abílio Marcos"
              className={`transition-colors duration-700 ${
                heroState ? "text-white/90 hover:text-white" : "text-foreground"
              }`}
            >
              <SignatureLogo className="h-7 w-[9.25rem] md:h-8 md:w-[10.5rem]" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`text-[11px] tracking-[0.18em] uppercase transition-colors duration-500 relative ${
                      heroState
                        ? isActive ? "text-white" : "text-white/65 hover:text-white/90"
                        : isActive ? "text-foreground" : "text-foreground/40 hover:text-foreground/75"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className={`absolute -bottom-1 left-0 right-0 h-px transition-colors duration-700 ${heroState ? "bg-white/40" : "bg-foreground/25"}`} />
                    )}
                  </Link>
                );
              })}

              {/* Language selector */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={`text-[10px] tracking-[0.15em] uppercase transition-colors duration-500 px-1.5 py-0.5 ${
                    heroState
                      ? "text-white/50 hover:text-white/80"
                      : "text-foreground/30 hover:text-foreground/60"
                  }`}
                >
                  {localeLabels[locale]}
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 bg-background border border-border shadow-sm py-1 min-w-[80px]"
                    >
                      {(Object.keys(localeLabels) as Locale[]).map((l) => (
                        <button
                          key={l}
                          onClick={() => { setLocale(l); setLangOpen(false); }}
                          className={`block w-full text-left px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-colors ${
                            locale === l
                              ? "text-foreground font-medium"
                              : "text-foreground/40 hover:text-foreground/70"
                          }`}
                        >
                          {localeLabels[l]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Mobile: lang + toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`text-[10px] tracking-[0.15em] uppercase transition-colors duration-500 ${
                  heroState ? "text-white/50" : "text-foreground/30"
                }`}
              >
                {localeLabels[locale]}
              </button>
              <button
                className={`p-2 -mr-2 transition-colors duration-700 ${heroState ? "text-white/80" : "text-foreground"}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Mobile lang dropdown */}
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="lg:hidden absolute top-full right-6 mt-1 bg-background border border-border shadow-sm py-1 min-w-[80px] z-[60]"
                >
                  {(Object.keys(localeLabels) as Locale[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLocale(l); setLangOpen(false); }}
                      className={`block w-full text-left px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-colors ${
                        locale === l ? "text-foreground font-medium" : "text-foreground/40 hover:text-foreground/70"
                      }`}
                    >
                      {localeLabels[l]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

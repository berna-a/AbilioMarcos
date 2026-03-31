import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SignatureLogo from "./SignatureLogo";

const navItems = [
  { label: "Selected Works", href: "/selected-works" },
  { label: "All Works", href: "/works" },
  { label: "Collections", href: "/collections" },
  { label: "Studio", href: "/studio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // On homepage over the hero: light text on dark. Once scrolled (or non-home pages): dark text on light bg.
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
            {/* Artist name */}
            <Link
              to="/"
              aria-label="Abílio Marcos"
              className={`transition-colors duration-700 ${
                heroState
                  ? "text-white/90 hover:text-white"
                  : "text-foreground"
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
                        ? isActive
                          ? "text-white"
                          : "text-white/65 hover:text-white/90"
                        : isActive
                          ? "text-foreground"
                          : "text-foreground/40 hover:text-foreground/75"
                    }`}
                  >
                    {item.label}
                    {/* Active indicator — subtle bottom line */}
                    {isActive && (
                      <span
                        className={`absolute -bottom-1 left-0 right-0 h-px transition-colors duration-700 ${
                          heroState ? "bg-white/40" : "bg-foreground/25"
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile toggle */}
            <button
              className={`lg:hidden p-2 -mr-2 transition-colors duration-700 ${
                heroState ? "text-white/80" : "text-foreground"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
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
                        isActive
                          ? "text-foreground"
                          : "text-foreground/40 hover:text-foreground/70"
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

import { Link } from "react-router-dom";
import SignatureLogo from "./SignatureLogo";
import { useT } from "@/i18n";

const Footer = () => {
  const t = useT();

  const navLinks = [
    { label: t.nav.selectedWorks, href: "/selected-works" },
    { label: t.nav.allWorks, href: "/works" },
    { label: t.nav.about, href: "/about" },
  ];

  const legalLinks = [
    { label: t.footer.privacyPolicy, href: "/legal/privacy" },
    { label: t.footer.cookiePolicy, href: "/legal/cookies" },
    { label: t.footer.termsConditions, href: "/legal/terms" },
    { label: t.footer.disputeResolution, href: "/legal/disputes" },
    { label: t.footer.complaintsBook, href: "/legal/complaints" },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="py-14 md:py-18 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-10">
          {/* Brand */}
          <div>
            <Link to="/" aria-label="Abílio Marcos" className="text-foreground inline-block mb-5">
              <SignatureLogo className="h-7 w-[9.25rem] md:h-8 md:w-[10.5rem]" />
            </Link>
            <p className="text-[12px] text-muted-foreground leading-[1.8] max-w-xs whitespace-pre-line">
              {t.footer.description}
            </p>
            {/* Social */}
            <div className="flex items-center gap-4 mt-5">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground/50 hover:text-foreground transition-colors duration-300">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground/50 hover:text-foreground transition-colors duration-300">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-5">
              {t.footer.navigate}
            </p>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-[13px] text-foreground/45 hover:text-foreground transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Inquiries */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-5">
              {t.footer.inquiries}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/contact"
                className="text-[13px] text-foreground/45 hover:text-foreground transition-colors duration-300"
              >
                {t.footer.contact}
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-5">
              {t.footer.legal}
            </p>
            <div className="flex flex-col gap-2.5">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-[11px] text-foreground/35 hover:text-foreground/60 transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-muted-foreground">
            {t.footer.copyright} {t.footer.madeBy}{" "}
            <a href="https://ardo.media/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground/60 hover:text-foreground transition-colors duration-300">Ardo Media</a>
          </p>
          <p className="text-[11px] text-muted-foreground">
            {t.footer.artworksCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

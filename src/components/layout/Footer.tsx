import { Link } from "react-router-dom";
import SignatureLogo from "./SignatureLogo";
import { useT } from "@/i18n";

const Footer = () => {
  const t = useT();

  const navLinks = [
    { label: t.nav.selectedWorks, href: "/selected-works" },
    { label: t.nav.allWorks, href: "/works" },
    { label: t.nav.studio, href: "/studio" },
    { label: t.nav.about, href: "/about" },
  ];

  return (
    <footer className="border-t border-gallery-border bg-background">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="py-14 md:py-18 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          <div>
            <Link to="/" aria-label="Abílio Marcos" className="text-foreground inline-block mb-5">
              <SignatureLogo className="h-7 w-[9.25rem] md:h-8 md:w-[10.5rem]" />
            </Link>
            <p className="text-[12px] text-muted-foreground leading-[1.8] max-w-xs whitespace-pre-line">
              {t.footer.description}
            </p>
          </div>

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
        </div>

        <div className="py-6 border-t border-gallery-border flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-muted-foreground">
            {t.footer.copyright} {t.footer.madeBy}{" "}
            <a href="https://ardo.media/" target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-foreground transition-colors duration-300">Ardo Media</a>
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

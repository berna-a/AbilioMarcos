import { Link } from "react-router-dom";
import SignatureLogo from "./SignatureLogo";

const Footer = () => {
  return (
    <footer className="border-t border-gallery-border bg-background">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Links row */}
        <div className="py-14 md:py-18 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          <div>
            <Link to="/" aria-label="Abílio Marcos" className="text-foreground inline-block mb-5">
              <SignatureLogo className="h-7 w-[9.25rem] md:h-8 md:w-[10.5rem]" />
            </Link>
            <p className="text-[12px] text-muted-foreground leading-[1.8] max-w-xs">
              Contemporary abstract-expressionist painter.
              <br />
              Portugal & International.
            </p>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-5">
              Navigate
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Selected Works", href: "/selected-works" },
                { label: "All Works", href: "/works" },
                { label: "Collections", href: "/collections" },
                { label: "Studio", href: "/studio" },
                { label: "About", href: "/about" },
              ].map((link: { label: string; href: string }) => (
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
              Inquiries
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/contact"
                className="text-[13px] text-foreground/45 hover:text-foreground transition-colors duration-300"
              >
                Contact
              </Link>
              <Link
                to="/commission"
                className="text-[13px] text-foreground/45 hover:text-foreground transition-colors duration-300"
              >
                Commission a Work
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-gallery-border flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} Abílio Marcos. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground">
            All artworks and images are copyright of the artist.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

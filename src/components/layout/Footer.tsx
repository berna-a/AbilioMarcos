import { Link } from "react-router-dom";
import CollectorSignup from "@/components/CollectorSignup";

const Footer = () => {
  return (
    <footer className="border-t border-gallery-border bg-background">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Newsletter row */}
        <div className="py-16 md:py-20 border-b border-gallery-border">
          <CollectorSignup variant="footer" />
        </div>

        {/* Links row */}
        <div className="py-10 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="font-serif text-xl mb-4">Abílio Marcos</p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Contemporary abstract-expressionist painter.
              <br />
              Portugal & International.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">Navigate</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Selected Works", href: "/selected-works" },
                { label: "All Works", href: "/works" },
                { label: "Collections", href: "/collections" },
                { label: "Studio", href: "/studio" },
                { label: "About", href: "/about" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">Inquiries</p>
            <div className="flex flex-col gap-2">
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/commission" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Commission a Work
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-gallery-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Abílio Marcos. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            All artworks and images are copyright of the artist.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
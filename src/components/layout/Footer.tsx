import { Link } from "react-router-dom";
import footerLogo from "@/assets/footer-logo.png";
import ardoLogo from "@/assets/ardo-logo.svg";
import { useT } from "@/i18n";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import ComplaintsBookBadge from "@/components/ComplaintsBookBadge";

const SOCIALS = {
  instagram: "https://www.instagram.com/abilio.marcos.arte/",
  facebook: "https://www.facebook.com/abilio.marcos.9",
  whatsapp: "https://wa.me/351968181117",
};

const Footer = () => {
  const t = useT();

  const navLinks = [
    { label: t.nav.allWorks, href: "/obras" },
    { label: t.nav.about, href: "/sobre" },
    { label: t.nav.contact, href: "/contacto" },
  ];

  const legalLinks = [
    { label: t.footer.privacyPolicy, href: "/legal/privacy" },
    { label: t.footer.cookiePolicy, href: "/legal/cookies" },
    { label: t.footer.termsConditions, href: "/legal/terms" },
    { label: t.footer.disputeResolution, href: "/legal/disputes" },
  ];

  return (
    <footer className="border-t border-white/5 bg-footer text-white/80">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="py-14 md:py-18 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-10">
          {/* Brand */}
          <div>
            <Link to="/" aria-label="Abílio Marcos" className="inline-block mb-5">
              <img
                src={footerLogo}
                alt="Abílio Marcos"
                className="h-12 md:h-14 w-auto object-contain [filter:brightness(0)_invert(1)]"
                draggable={false}
              />
            </Link>
            <p className="text-[14px] text-white/55 leading-[1.8] max-w-xs whitespace-pre-line">
              {t.footer.description}
            </p>
            {/* Social */}
            <div className="flex items-center gap-2 mt-5">
              <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 inline-flex items-center justify-center transition-opacity duration-300 hover:opacity-80">
                <Instagram className="w-4 h-4" style={{ color: "#E1306C" }} />
              </a>
              <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 inline-flex items-center justify-center transition-opacity duration-300 hover:opacity-80">
                <Facebook className="w-4 h-4" style={{ color: "#1877F2" }} />
              </a>
              <a href={SOCIALS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-8 h-8 inline-flex items-center justify-center transition-opacity duration-300 hover:opacity-80">
                <MessageCircle className="w-4 h-4" style={{ color: "#25D366" }} />
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-[12px] tracking-[0.25em] uppercase text-white/45 mb-5">
              {t.footer.navigate}
            </p>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-[15px] text-white/60 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Inquiries */}
          <div>
            <p className="text-[12px] tracking-[0.25em] uppercase text-white/45 mb-5">
              {t.footer.inquiries}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/contacto"
                className="text-[15px] text-white/60 hover:text-white transition-colors duration-300"
              >
                {t.footer.contact}
              </Link>
              <a
                href="mailto:marcos4011@gmail.com"
                className="text-[15px] text-white/60 hover:text-white transition-colors duration-300"
              >
                marcos4011@gmail.com
              </a>
              <a
                href={SOCIALS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[15px] text-white/60 hover:text-white transition-colors duration-300"
              >
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[12px] tracking-[0.25em] uppercase text-white/45 mb-5">
              {t.footer.legal}
            </p>
            <div className="flex flex-col gap-2.5">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-[13px] text-white/45 hover:text-white/80 transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-5">
              <ComplaintsBookBadge />
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[13px] text-white/45">
            {t.footer.copyright} {t.footer.madeBy}{" "}
            <a href="https://ardo.media" target="_blank" rel="noopener noreferrer" aria-label="ARDO" className="group inline-flex items-center align-middle ml-1 -mt-[2px]">
              <span
                aria-hidden
                className="inline-block h-[2.6em] w-[2.6em] bg-[#1A56DB] group-hover:bg-[#3B82F6] transition-colors"
                style={{
                  WebkitMaskImage: `url(${ardoLogo})`,
                  maskImage: `url(${ardoLogo})`,
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                }}
              />
            </a>
          </p>
          <p className="text-[13px] text-white/45">
            NIF 187556237
          </p>
          <p className="text-[13px] text-white/45">
            {t.footer.artworksCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

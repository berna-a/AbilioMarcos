import { Link } from "react-router-dom";
import { Instagram, Facebook, MessageCircle, Mail, MapPin, Palette, ArrowUpRight } from "lucide-react";
import { track } from "@/lib/analytics";

const SOCIALS = {
  instagram: "https://www.instagram.com/abilio.marcos.arte/",
  facebook: "https://www.facebook.com/abilio.marcos.9",
  whatsapp: "https://wa.me/351968181117",
  maps: "https://maps.app.goo.gl/bMXvMocvADjPa3Zc7",
  email: "marcos4011@gmail.com",
};

const onClick = (link: string) => track("link_click", { link, page_type: "linktree" });

type Item = {
  label: string;
  to?: string;
  href?: string;
  icon: React.ElementType;
  primary?: boolean;
};

const items: Item[] = [
  { label: "Ver Obras", to: "/obras", icon: Palette, primary: true },
  { label: "WhatsApp", href: SOCIALS.whatsapp, icon: MessageCircle },
  { label: "Instagram", href: SOCIALS.instagram, icon: Instagram },
  { label: "Facebook", href: SOCIALS.facebook, icon: Facebook },
  { label: "Sobre o Artista", to: "/sobre", icon: ArrowUpRight },
  { label: "Contacto", to: "/contacto", icon: ArrowUpRight },
  { label: "Email", href: `mailto:${SOCIALS.email}`, icon: Mail },
  { label: "Atelier (Mapa)", href: SOCIALS.maps, icon: MapPin },
];

const LinksPage = () => {
  const base =
    "group w-full flex items-center gap-3 px-5 py-4 text-[13px] tracking-[0.12em] uppercase font-medium transition-colors duration-300";
  const primaryCls = `${base} bg-brand-red text-white hover:bg-brand-red-soft`;
  const outlineCls = `${base} border border-border text-foreground hover:border-brand-red hover:text-brand-red bg-background`;

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center px-6 py-14">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Avatar / marca */}
        <img src="/favicon.png" alt="Abílio Marcos" className="h-24 w-24 object-contain mb-5" />
        <h1 className="font-serif text-3xl font-light text-foreground">Abílio Marcos</h1>
        <p className="mt-2 text-[11px] tracking-[0.3em] uppercase text-brand-red">Pintor Expressionista Abstrato</p>
        <p className="mt-3 text-sm text-muted-foreground text-center max-w-xs">
          Obras originais · Atelier em Portugal · Envio internacional
        </p>

        {/* Links */}
        <div className="mt-8 w-full space-y-3">
          {items.map((it) => {
            const inner = (
              <>
                <it.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{it.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
              </>
            );
            return it.to ? (
              <Link key={it.label} to={it.to} onClick={() => onClick(it.label)} className={it.primary ? primaryCls : outlineCls}>
                {inner}
              </Link>
            ) : (
              <a
                key={it.label}
                href={it.href}
                target={it.href?.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                onClick={() => onClick(it.label)}
                className={it.primary ? primaryCls : outlineCls}
              >
                {inner}
              </a>
            );
          })}
        </div>

        {/* Rodapé */}
        <Link to="/" onClick={() => onClick("site")} className="mt-10 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
          abiliomarcos.com
        </Link>
      </div>
    </div>
  );
};

export default LinksPage;

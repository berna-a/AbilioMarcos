import { Link } from "react-router-dom";
import { Instagram, Facebook, MessageCircle, Mail, MapPin, Palette, ArrowUpRight } from "lucide-react";
import { track } from "@/lib/analytics";
import perfil from "@/assets/abilio-perfil.png";

const SOCIALS = {
  instagram: "https://www.instagram.com/abilio.marcos.arte/",
  facebook: "https://www.facebook.com/abilio.marcos.9",
  whatsapp: "https://wa.me/351968181117",
  maps: "https://maps.app.goo.gl/bMXvMocvADjPa3Zc7",
  email: "marcos4011@gmail.com",
};

const go = (link: string) => track("link_click", { link, page_type: "linktree" });

type Btn = { label: string; to?: string; href?: string; icon: React.ElementType; primary?: boolean };
const buttons: Btn[] = [
  { label: "Ver Obras", to: "/obras", icon: Palette, primary: true },
  { label: "Contactar por WhatsApp", href: SOCIALS.whatsapp, icon: MessageCircle },
  { label: "Sobre o Artista", to: "/sobre", icon: ArrowUpRight },
  { label: "Contacto & Atelier", to: "/contacto", icon: MapPin },
  { label: "Email", href: `mailto:${SOCIALS.email}`, icon: Mail },
];

const Social = ({ href, label, children, cls }: { href: string; label: string; children: React.ReactNode; cls: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} onClick={() => go(label)}
     className={`h-11 w-11 rounded-full flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform ${cls}`}>
    {children}
  </a>
);

const LinksPage = () => {
  const btnBase = "group w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[13px] tracking-[0.12em] uppercase font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5";
  const primaryCls = `${btnBase} bg-brand-red text-white hover:bg-brand-red-soft`;
  const outlineCls = `${btnBase} bg-background border border-border text-foreground hover:border-brand-red/60`;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-muted/40 to-background flex justify-center">
      <div className="w-full max-w-md flex flex-col items-center pb-16">
        {/* Capa */}
        <div className="relative w-full h-44 md:h-52 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/video/hero-poster.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-background" />
        </div>

        {/* Avatar */}
        <div className="-mt-16 z-10">
          <img src={perfil} alt="Abílio Marcos" className="h-28 w-28 rounded-full object-cover object-top ring-4 ring-background shadow-xl" />
        </div>

        <h1 className="mt-4 font-serif text-3xl font-light text-foreground">Abílio Marcos</h1>
        <p className="mt-2 text-[11px] tracking-[0.3em] uppercase text-brand-red">Pintor Expressionista Abstrato</p>
        <p className="mt-2.5 text-sm text-muted-foreground text-center max-w-xs px-6">
          Obras originais · Atelier em Portugal · Envio internacional
        </p>

        {/* Redes sociais */}
        <div className="mt-5 flex items-center gap-3">
          <Social href={SOCIALS.instagram} label="Instagram" cls="bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5]"><Instagram className="h-5 w-5" /></Social>
          <Social href={SOCIALS.whatsapp} label="WhatsApp" cls="bg-[#25D366]"><MessageCircle className="h-5 w-5" /></Social>
          <Social href={SOCIALS.facebook} label="Facebook" cls="bg-[#1877F2]"><Facebook className="h-5 w-5" /></Social>
        </div>

        {/* Cartão Instagram (preview do último post — liga ao feed) */}
        <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" onClick={() => go("instagram_card")}
           className="mt-6 w-full rounded-2xl overflow-hidden border border-border bg-background shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
            <span className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5] flex items-center justify-center text-white"><Instagram className="h-3.5 w-3.5" /></span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium leading-tight">@abilio.marcos.arte</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Último no Instagram</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-red transition-colors" />
          </div>
          <div id="ig-latest" className="aspect-square w-full bg-cover bg-center" style={{ backgroundImage: "url('/video/hero-poster.jpg')" }} />
        </a>

        {/* Botões */}
        <div className="mt-6 w-full space-y-3 px-1">
          {buttons.map((b) => {
            const inner = (<><b.icon className="h-4 w-4 shrink-0" /><span className="flex-1 text-left">{b.label}</span><ArrowUpRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" /></>);
            return b.to
              ? <Link key={b.label} to={b.to} onClick={() => go(b.label)} className={b.primary ? primaryCls : outlineCls}>{inner}</Link>
              : <a key={b.label} href={b.href} target={b.href?.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer" onClick={() => go(b.label)} className={b.primary ? primaryCls : outlineCls}>{inner}</a>;
          })}
        </div>

        <Link to="/" onClick={() => go("site")} className="mt-10 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
          abiliomarcos.com
        </Link>
      </div>
    </div>
  );
};

export default LinksPage;

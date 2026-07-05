import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { getArtworksBySlugs } from '@/lib/artworks';
import { Artwork, isOnlineCheckoutEligible, formatPrice } from '@/lib/types';
import { createCheckoutSession } from '@/lib/checkout';
import { track, trackArtwork, trackMetaLead, touchContactDedup, trackMetaInitiateCheckout, generateLeadRefCode, logWhatsAppLead } from '@/lib/analytics';
import { useI18n } from '@/i18n';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const WHATSAPP_NUMBER = '351968181117';

// Curated slugs — Jardins da cidade first (is_featured). Order preserved in fetch.
const ARTWORK_SLUGS = [
  'jardins-da-cidade-141',
  'escape-ii-520',
  'azulando-471',
  'o-pendulo-vermelho-411',
  'two-white-circles-449',
  'viagens-maritimas-ii-383',
  'reacoes-vermelhas-545',
  'o-silencio',
  'encruzilhada-de-cores',
];

const HERO_IMAGE = 'https://hwpixsuovwxgilyfoszw.supabase.co/storage/v1/object/public/cliente-021/1775564684831-1fm2gxtnd7w.jpg';

function buildGenericWaUrl(leadRef: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Olá! Tenho interesse em obras de Abílio Marcos. Pode dar-me mais informações? [cód: ${leadRef}]`)}`;
}

function buildWaUrl(artwork: Artwork, leadRef: string): string {
  const ref = artwork.reference ? ` (ref. ${artwork.reference})` : '';
  const msg = `Olá! Tenho interesse na obra "${artwork.title}"${ref}. Pode dar-me mais informações? [cód: ${leadRef}]`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function getDimensions(artwork: Artwork): string {
  const w = artwork.custom_width_cm ?? artwork.width_cm;
  const h = artwork.custom_height_cm ?? artwork.height_cm;
  return w && h ? `${w} × ${h} cm` : '';
}

// ─── Artwork card ──────────────────────────────────────────────────────────
interface CardProps {
  artwork: Artwork;
}

const ArtworkCard = ({ artwork }: CardProps) => {
  const { locale } = useI18n();
  const [loading, setLoading] = useState(false);
  const canCheckout = isOnlineCheckoutEligible(artwork);
  const price = formatPrice(artwork.price);
  const dims = getDimensions(artwork);
  const leadRef = useMemo(() => generateLeadRefCode(), []);

  const handleWhatsApp = () => {
    trackMetaLead(undefined, 'whatsapp');
    touchContactDedup();
    trackArtwork('whatsapp_contact_clicked', artwork);
    logWhatsAppLead(leadRef, { id: artwork.id, title: artwork.title });
  };

  const handleCheckout = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      trackArtwork('acquire_online_clicked', artwork);
      trackMetaInitiateCheckout(artwork.price ?? undefined);
    }
    const { url, error } = await createCheckoutSession(artwork.id, locale);
    if (url) {
      trackArtwork('checkout_started', artwork);
      window.location.href = url;
    } else {
      console.error('[ObrasDisponiveis] checkout failed', { artworkId: artwork.id, error });
      toast({ title: 'Erro', description: error || 'Erro ao iniciar pagamento. Tente novamente.', variant: 'destructive' });
      setLoading(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col"
    >
      <Link to={`/obra/${artwork.slug}`} className="block overflow-hidden bg-neutral-100 mb-4">
        <img
          src={artwork.primary_image_url!}
          alt={artwork.title}
          loading="lazy"
          className="w-full aspect-[4/5] object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
      </Link>

      <div className="flex flex-col gap-1 mb-5">
        <Link
          to={`/obra/${artwork.slug}`}
          className="text-[15px] tracking-[0.04em] text-foreground font-medium hover:underline underline-offset-2"
        >
          {artwork.title}
        </Link>
        {artwork.technique && (
          <p className="text-[12px] tracking-[0.03em] text-foreground/55">{artwork.technique}</p>
        )}
        {dims && (
          <p className="text-[12px] tracking-[0.03em] text-foreground/55">{dims}</p>
        )}
        {price && (
          <p className="text-[14px] tracking-[0.04em] text-foreground font-medium mt-1">{price}</p>
        )}
      </div>

      <div className="mt-auto space-y-2">
        <a
          href={buildWaUrl(artwork, leadRef)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsApp}
          className="inline-flex w-full items-center justify-center border border-foreground/30 text-foreground px-4 py-2.5 text-[12px] tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors duration-300"
        >
          Falar sobre esta obra
        </a>
        {canCheckout && (
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="inline-flex w-full items-center justify-center bg-brand-red text-white px-4 py-2.5 text-[12px] tracking-[0.2em] uppercase hover:bg-brand-red-soft disabled:opacity-50 transition-colors duration-300"
          >
            {loading ? 'A preparar...' : 'Adquirir Online'}
          </button>
        )}
        <Link
          to={`/obra/${artwork.slug}`}
          className="inline-flex w-full items-center justify-center text-[12px] tracking-[0.2em] uppercase text-foreground/50 hover:text-foreground transition-colors duration-300 py-2"
        >
          Ver obra →
        </Link>
      </div>
    </motion.article>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────
const ObrasDisponiveis = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [fetchDone, setFetchDone] = useState(false);
  const genericLeadRef = useMemo(() => generateLeadRefCode(), []);
  const waGenericUrl = useMemo(() => buildGenericWaUrl(genericLeadRef), [genericLeadRef]);

  // noindex — landing de campanha paga, não deve ser indexada
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    const prev = document.title;
    document.title = 'Obras Disponíveis — Abílio Marcos';
    return () => { document.head.removeChild(meta); document.title = prev; };
  }, []);

  useEffect(() => {
    getArtworksBySlugs(ARTWORK_SLUGS).then(data => {
      setArtworks(data);
      setFetchDone(true);
    });
  }, []);

  const trackGenericWa = () => {
    trackMetaLead(undefined, 'whatsapp');
    touchContactDedup();
    track('whatsapp_contact_clicked', { page_type: 'landing_obras' });
    logWhatsAppLead(genericLeadRef);
  };

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative mt-16 md:mt-[76px] h-[70vh] min-h-[440px] overflow-hidden bg-gallery-charcoal">
        <img
          src={HERO_IMAGE}
          alt="Jardins da cidade — Abílio Marcos"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
          {...({ fetchpriority: 'high' } as Record<string, string>)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/75" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-14 px-6 text-center text-white">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[11px] tracking-[0.35em] uppercase text-white/65 mb-3"
          >
            Abílio Marcos
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl md:text-5xl font-light tracking-[0.06em] mb-4 max-w-2xl"
          >
            Obras Originais Disponíveis
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-[13px] md:text-[14px] tracking-[0.03em] text-white/75 max-w-lg mb-8 leading-relaxed"
          >
            Pintura abstrata contemporânea de Abílio Marcos, disponível para aquisição direta ao artista,
            com certificado de autenticidade e envio organizado.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a
              href={waGenericUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackGenericWa}
              className="inline-flex items-center justify-center bg-white text-black px-8 py-3 text-[12px] tracking-[0.25em] uppercase hover:bg-white/90 transition-colors duration-300"
            >
              Falar sobre uma obra
            </a>
            <a
              href="#obras"
              className="inline-flex items-center justify-center border border-white/55 text-white px-8 py-3 text-[12px] tracking-[0.25em] uppercase hover:bg-white/10 transition-colors duration-300"
            >
              Ver obras disponíveis
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Grid de obras ── */}
      <section id="obras" className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <p className="text-[11px] tracking-[0.35em] uppercase text-foreground/45 mb-12">
          {fetchDone ? `${artworks.length} obras disponíveis` : 'Obras disponíveis'}
        </p>
        {!fetchDone ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {artworks.map(a => <ArtworkCard key={a.id} artwork={a} />)}
          </div>
        )}
      </section>

      {/* ── Porquê comprar diretamente ── */}
      <section className="bg-neutral-50 px-6 md:px-12 lg:px-24 py-16 md:py-20 border-t border-foreground/8">
        <div className="max-w-3xl">
          <p className="text-[11px] tracking-[0.35em] uppercase text-foreground/45 mb-6">Aquisição direta ao artista</p>
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.03em] text-foreground mb-10">
            Sem intermediação de galeria
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {([
              ['Contacto direto', 'Fala diretamente com o artista antes e após a aquisição.'],
              ['Sem comissões de galeria', 'Aquisição direta ao atelier — sem margens adicionadas por terceiros.'],
              ['Certificado de autenticidade', 'Emitido pelo próprio Abílio Marcos com cada obra.'],
              ['Envio organizado', 'Embalagem profissional e entrega para Portugal e Europa.'],
            ] as [string, string][]).map(([title, desc]) => (
              <div key={title} className="border-t border-foreground/10 pt-5">
                <p className="text-[13px] tracking-[0.07em] text-foreground font-medium mb-2">{title}</p>
                <p className="text-[13px] tracking-[0.02em] text-foreground/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <a
            href={waGenericUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackGenericWa}
            className="inline-flex items-center mt-10 border border-foreground text-foreground px-8 py-3 text-[12px] tracking-[0.25em] uppercase hover:bg-foreground hover:text-background transition-colors duration-300"
          >
            Falar com o artista
          </a>
        </div>
      </section>

      {/* ── Garantias ── */}
      <section className="px-6 md:px-12 lg:px-24 py-12 md:py-14 border-t border-foreground/10">
        <div className="flex flex-wrap gap-8 md:gap-14">
          {[
            'Certificado de Autenticidade',
            'Envio profissional seguro',
            'Visita ao atelier disponível',
            'Prazo de entrega confirmado',
          ].map(g => (
            <div key={g} className="flex items-center gap-2.5">
              <span className="text-foreground/35 text-base">✓</span>
              <span className="text-[12px] tracking-[0.08em] text-foreground/65">{g}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Prova de carreira ── */}
      <section className="bg-neutral-50 px-6 md:px-12 lg:px-24 py-14 md:py-16 border-t border-foreground/10">
        <p className="text-[11px] tracking-[0.35em] uppercase text-foreground/45 mb-5">Abílio Marcos</p>
        <p className="text-[14px] tracking-[0.02em] text-foreground/65 leading-relaxed max-w-2xl">
          Pinta desde o início dos anos 1990. Mais de 150 exposições individuais e 70 coletivas — em Portugal,
          Espanha, França, Países Baixos, Bélgica e Estados Unidos. Obras em coleções públicas e privadas.
          Atelier em Santo Estêvão das Galés, Mafra.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-20 border-t border-foreground/10">
        <p className="text-[11px] tracking-[0.35em] uppercase text-foreground/45 mb-10">Perguntas frequentes</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
          {([
            ['Como funciona a aquisição?', 'Pode adquirir diretamente online ou falar primeiro com o artista via WhatsApp para esclarecer dúvidas. O pagamento é processado em segurança via Stripe.'],
            ['Posso ver a obra pessoalmente?', 'Sim. Pode visitar o atelier em Santo Estêvão das Galés, Mafra. Contacte-nos para marcar.'],
            ['O certificado é emitido pelo artista?', 'Sim. Cada obra é acompanhada de um certificado de autenticidade assinado pelo próprio Abílio Marcos.'],
            ['Fazem envio fora de Portugal?', 'Sim, para toda a Europa. Os portes e prazo são confirmados no momento da compra.'],
          ] as [string, string][]).map(([q, a]) => (
            <div key={q} className="border-t border-foreground/10 pt-6">
              <p className="text-[13px] tracking-[0.05em] text-foreground font-medium mb-2">{q}</p>
              <p className="text-[13px] tracking-[0.02em] text-foreground/60 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 border-t border-foreground/10 text-center">
        <h2 className="text-2xl md:text-3xl font-light tracking-[0.03em] mb-3">Ainda tem dúvidas?</h2>
        <p className="text-[13px] tracking-[0.04em] text-foreground/55 mb-8">Fale diretamente com o artista.</p>
        <a
          href={waGenericUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackGenericWa}
          className="inline-flex items-center justify-center bg-foreground text-background px-10 py-3.5 text-[12px] tracking-[0.25em] uppercase hover:bg-foreground/80 transition-colors duration-300"
        >
          Falar com o artista
        </a>
      </section>
    </Layout>
  );
};

export default ObrasDisponiveis;

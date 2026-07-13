/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from './supabase';

// ── Types ──────────────────────────────────────────────────
interface ArtworkProps {
  artwork_id?: string;
  reference?: string;
  slug?: string;
  title?: string;
  price?: number | null;
  price_tier?: string;
  selected_work?: boolean;
}

interface EventProperties extends Partial<ArtworkProps> {
  page_type?: string;
  language?: string;
  filter_group?: string;
  filter_value?: string;
  sort_value?: string;
  email?: string;
  [key: string]: unknown;
}

// ── Attribution (persisted for session) ────────────────────
interface Attribution {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_page: string;
  referrer: string;
}

const ATTR_KEY = 'am_attribution';

// Acessos seguros — in-app browsers (Instagram/Facebook) e modo privado podem
// não ter crypto.randomUUID nem deixar usar sessionStorage. Sem isto, um TypeError
// rebentava o track() em ~5% das sessões (sobretudo tráfego mobile de anúncios).
function safeUUID(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  } catch { /* contexto não-seguro */ }
  return `sid-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function safeSessionGet(key: string): string | null {
  try { return sessionStorage.getItem(key); } catch { return null; }
}
function safeSessionSet(key: string, value: string): void {
  try { sessionStorage.setItem(key, value); } catch { /* storage bloqueado */ }
}

function captureAttribution(): Attribution {
  const stored = safeSessionGet(ATTR_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* corrompido — recalcula */ }
  }

  const params = new URLSearchParams(window.location.search);
  const attr: Attribution = {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    utm_term: params.get('utm_term'),
    landing_page: window.location.pathname,
    referrer: document.referrer || '',
  };

  safeSessionSet(ATTR_KEY, JSON.stringify(attr));
  return attr;
}

// ── Device detection ───────────────────────────────────────
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function getCountryFromTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.startsWith('Europe/Lisbon') || tz.includes('Azores')) return 'PT';
    if (tz.startsWith('Europe/Paris')) return 'FR';
    if (tz.startsWith('Europe/Berlin')) return 'DE';
    if (tz.startsWith('Europe/London')) return 'GB';
    if (tz.startsWith('Europe/Madrid')) return 'ES';
    if (tz.startsWith('America/New_York') || tz.startsWith('America/Chicago') || tz.startsWith('America/Denver') || tz.startsWith('America/Los_Angeles')) return 'US';
    return tz.split('/')[0] || 'unknown';
  } catch {
    return 'unknown';
  }
}

// ── Price tier helper ──────────────────────────────────────
export function getPriceTier(price: number | null): string {
  if (price == null) return 'on_request';
  if (price <= 1000) return 'under_1000';
  if (price <= 3000) return '1000_to_3000';
  return 'above_3000';
}

// ── Core track function ────────────────────────────────────
let _locale = 'pt';
export function setAnalyticsLocale(locale: string) {
  _locale = locale;
}

export function track(eventName: string, properties: EventProperties = {}) {
  const attribution = captureAttribution();
  const enriched = {
    ...properties,
    language: _locale,
    country: getCountryFromTimezone(),
    device_type: getDeviceType(),
    page_path: window.location.pathname,
    ...attribution,
    timestamp: new Date().toISOString(),
  };

  // 1. GA4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, enriched);
  }

  // 2. Meta Pixel
  if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
    (window as any).fbq('trackCustom', eventName, enriched);
  }

  // 3. Supabase (fire-and-forget, never block UI)
  supabase.from('analytics_events').insert([{
    event_name: eventName,
    properties: enriched,
    session_id: getSessionId(),
  }]).then(() => {});
}

// Exportados para carimbar leads com a origem (atribuição/CRM/comissões)
export function getAttribution() { return captureAttribution(); }
export function getAnalyticsSessionId(): string { return getSessionId(); }

// ── Session ID ─────────────────────────────────────────────
function getSessionId(): string {
  let sid = safeSessionGet('am_session_id');
  if (!sid) {
    sid = safeUUID();
    safeSessionSet('am_session_id', sid);
  }
  return sid;
}

// ── Convenience helpers ────────────────────────────────────
export function trackArtwork(eventName: string, artwork: { id: string; reference?: string | null; slug: string; title: string; price?: number | null; is_featured?: boolean; theme?: string | null; dominant_color?: string | null; art_style?: string | null }) {
  track(eventName, {
    artwork_id: artwork.id,
    reference: artwork.reference || undefined,
    slug: artwork.slug,
    title: artwork.title,
    price: artwork.price,
    price_tier: getPriceTier(artwork.price ?? null),
    selected_work: artwork.is_featured,
    // tags de classificação — para analisar que tipo de obra atrai/converte
    theme: artwork.theme || undefined,
    dominant_color: artwork.dominant_color || undefined,
    art_style: artwork.art_style || undefined,
  });
}

// ── Meta Pixel standard events ─────────────────────────────
export function trackMetaLead(email?: string, contentName = 'inquiry') {
  // email aceite para compat. com InquiryModal — NÃO enviado ao Meta (PII)
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', 'Lead', { content_name: contentName });
  }
}

export function trackMetaPurchase(value: number, currency = 'EUR', eventId?: string) {
  if (typeof (window as any).fbq === 'function') {
    // eventID deve coincidir com o event_id do CAPI (servidor) para o Meta
    // deduplicar o pixel do browser e o evento de servidor num só Purchase.
    (window as any).fbq('track', 'Purchase', { value, currency }, eventId ? { eventID: eventId } : undefined);
  }
}

export function trackMetaInitiateCheckout(value?: number) {
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', 'InitiateCheckout', value != null ? { value, currency: 'EUR' } : {});
  }
}

export function trackMetaViewContent(a: { reference?: string | null; title?: string; price?: number | null }) {
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', 'ViewContent', {
      content_type: 'product',
      ...(a.reference ? { content_ids: [a.reference] } : {}),
      ...(a.title ? { content_name: a.title } : {}),
      ...(a.price != null ? { value: a.price, currency: 'EUR' } : {}),
    });
  }
}

let lastContactTs = 0;
export function trackMetaContact() {
  // Dedupe: o CTA da obra e o listener global de cliques wa.me podem disparar
  // quase em simultâneo — conta-se só UM Contact por clique.
  const now = Date.now();
  if (now - lastContactTs < 1500) return;
  lastContactTs = now;
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', 'Contact');
  }
}

// Consome a janela de dedup sem disparar Contact. Usar quando Lead é o evento
// primário (ex: WhatsApp CTA da obra) e se quer suprimir o Contact do listener global.
export function touchContactDedup() {
  lastContactTs = Date.now();
}

// ── Referência de lead WhatsApp (comissão / atribuição no AOS) ─────
// Código curto embutido na mensagem pré-preenchida; ao chegar ao inbox do AOS,
// liga a conversa à sessão/campanha que a originou — sem depender do Abílio reportar.
export function generateLeadRefCode(): string {
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `AB-${time}${rand}`;
}

export function logWhatsAppLead(refCode: string, artwork?: { id: string; title: string }) {
  supabase.from('whatsapp_leads').insert([{
    ref_code: refCode,
    session_id: getAnalyticsSessionId(),
    attribution: getAttribution(),
    artwork_id: artwork?.id ?? null,
    artwork_title: artwork?.title ?? null,
  }]).then(({ error }) => {
    // Insert é fire-and-forget (não pode bloquear o clique de WhatsApp), mas
    // uma falha aqui apaga a lead sem deixar rasto — nunca voltar a falhar em silêncio.
    if (error) console.error('logWhatsAppLead failed:', error);
  });
}

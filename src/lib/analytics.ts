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

function captureAttribution(): Attribution {
  const stored = sessionStorage.getItem(ATTR_KEY);
  if (stored) return JSON.parse(stored);

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

  sessionStorage.setItem(ATTR_KEY, JSON.stringify(attr));
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
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', eventName, enriched);
  }

  // 3. Supabase (fire-and-forget, never block UI)
  supabase.from('analytics_events').insert([{
    event_name: eventName,
    properties: enriched,
    session_id: getSessionId(),
  }]).then(() => {}).catch(() => {});
}

// ── Session ID ─────────────────────────────────────────────
function getSessionId(): string {
  let sid = sessionStorage.getItem('am_session_id');
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem('am_session_id', sid);
  }
  return sid;
}

// ── Convenience helpers ────────────────────────────────────
export function trackArtwork(eventName: string, artwork: { id: string; reference?: string | null; slug: string; title: string; price?: number | null; is_featured?: boolean }) {
  track(eventName, {
    artwork_id: artwork.id,
    reference: artwork.reference || undefined,
    slug: artwork.slug,
    title: artwork.title,
    price: artwork.price,
    price_tier: getPriceTier(artwork.price ?? null),
    selected_work: artwork.is_featured,
  });
}

// ── Meta Pixel standard events ─────────────────────────────
export function trackMetaLead(email?: string) {
  if ((window as any).fbq) {
    (window as any).fbq('track', 'Lead', { content_name: 'inquiry', ...(email ? { email } : {}) });
  }
}

export function trackMetaPurchase(value: number, currency = 'EUR') {
  if ((window as any).fbq) {
    (window as any).fbq('track', 'Purchase', { value, currency });
  }
}

export function trackMetaInitiateCheckout(value?: number) {
  if ((window as any).fbq) {
    (window as any).fbq('track', 'InitiateCheckout', value != null ? { value, currency: 'EUR' } : {});
  }
}

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { track, setAnalyticsLocale, trackMetaContact } from '@/lib/analytics';
import { useI18n } from '@/i18n';

/**
 * Drop this once inside <BrowserRouter> to:
 * 1. Capture UTM params on first load
 * 2. Send page_view on every route change
 * 3. Sync locale to analytics module
 */
const AnalyticsProvider = () => {
  const location = useLocation();
  const { locale } = useI18n();
  const prevPath = useRef(location.pathname);

  // Keep analytics locale in sync
  useEffect(() => {
    setAnalyticsLocale(locale);
  }, [locale]);

  // Meta Pixel "Contact" em qualquer clique num link de WhatsApp (global, cobre todo o site)
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.('a[href*="wa.me"], a[href*="whatsapp"], a[href*="api.whatsapp"]');
      if (el) trackMetaContact();
    };
    document.addEventListener('click', onDocClick, true);
    return () => document.removeEventListener('click', onDocClick, true);
  }, []);

  // Page views
  useEffect(() => {
    const pageType = getPageType(location.pathname);
    track('page_view', { page_type: pageType });
    // Meta Pixel: PageView padrão em cada navegação SPA (o base só dispara no 1.º load)
    if ((window as any).fbq) (window as any).fbq('track', 'PageView');
    prevPath.current = location.pathname;
  }, [location.pathname]);

  return null;
};

function getPageType(path: string): string {
  if (path === '/') return 'home';
  if (path === '/selected-works') return 'selected_works';
  if (path === '/obras') return 'all_works';
  if (path.startsWith('/obra/')) return 'artwork_detail';
  if (path === '/sobre') return 'about';
  if (path === '/contacto') return 'contact';
  if (path.startsWith('/checkout')) return 'checkout';
  if (path.startsWith('/legal')) return 'legal';
  return 'other';
}

export default AnalyticsProvider;

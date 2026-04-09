import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { track, setAnalyticsLocale } from '@/lib/analytics';
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

  // Page views
  useEffect(() => {
    const pageType = getPageType(location.pathname);
    track('page_view', { page_type: pageType });
    prevPath.current = location.pathname;
  }, [location.pathname]);

  return null;
};

function getPageType(path: string): string {
  if (path === '/') return 'home';
  if (path === '/selected-works') return 'selected_works';
  if (path === '/works') return 'all_works';
  if (path.startsWith('/artwork/')) return 'artwork_detail';
  if (path === '/about') return 'about';
  if (path === '/contact') return 'contact';
  if (path.startsWith('/checkout')) return 'checkout';
  if (path.startsWith('/legal')) return 'legal';
  return 'other';
}

export default AnalyticsProvider;

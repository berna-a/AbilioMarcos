import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, Translations } from './types';
import { en } from './en';
import { pt } from './pt';
import { fr } from './fr';
import { de } from './de';
import { adminPt } from './admin-pt';

const translations: Record<Locale, Translations> = { en, pt, fr, de };

const STORAGE_KEY = 'am_locale';

function detectLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in translations) return stored as Locale;

  const browserLang = navigator.language?.toLowerCase() || '';
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('de')) return 'de';
  return 'en';
}

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
  admin: typeof adminPt;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: en,
  admin: adminPt,
});

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale], admin: adminPt }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
export const useT = () => useContext(I18nContext).t;
export const useAdmin = () => useContext(I18nContext).admin;

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  pt: 'PT',
  fr: 'FR',
  de: 'DE',
};

export const localeNames: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
};

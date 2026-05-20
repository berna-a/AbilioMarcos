import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, Translations } from './types';
import { en } from './en';
import { pt } from './pt';
import { fr } from './fr';
import { de } from './de';
import { es } from './es';
import { adminPt } from './admin-pt';

const translations: Record<Locale, Translations> = { en, pt, fr, de, es };

const STORAGE_KEY = 'am_locale';

function detectLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in translations) return stored as Locale;

  const browserLang = navigator.language?.toLowerCase() || '';
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('es')) return 'es';
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
  es: 'ES',
};

export const localeNames: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
};

import { techniqueTranslations } from './techniques';

/** Map a stored technique value to its localized label using current translations. */
export const techniqueLabel = (
  t: Translations,
  technique: string | null | undefined,
  locale: Locale = 'pt',
): string => {
  const value = (technique || '').trim();
  if (!value) return t.allWorks.techniqueOil;
  // For non-PT locales, consult the technique translation map first.
  if (locale !== 'pt') {
    const map = techniqueTranslations[value];
    if (map && map[locale]) return map[locale];
  }
  // Match against canonical PT-stored values for the built-in i18n labels
  switch (value) {
    case 'Óleo sobre tela': return t.allWorks.techniqueOil;
    case 'Acrílico sobre tela': return t.allWorks.techniqueAcrylic;
    case 'Técnica mista': return t.allWorks.techniqueMixed;
    default: return value;
  }
};

/** Hook variant that picks up the current locale automatically. */
export const useTechniqueLabel = () => {
  const { t, locale } = useI18n();
  return (technique: string | null | undefined) => techniqueLabel(t, technique, locale);
};

/** Translation map persisted in DB columns: { en, fr, de, es }. */
export type TranslationMap = Partial<Record<Exclude<Locale, 'pt'>, string>> | null | undefined;

/**
 * Resolve a translated field for the active locale. Falls back to the
 * original (Portuguese) value when no translation is available, so the UI
 * never breaks if a row hasn't been translated yet.
 */
export const tField = (
  original: string | null | undefined,
  translations: TranslationMap | unknown,
  locale: Locale,
): string => {
  const fallback = (original ?? '').toString();
  if (locale === 'pt') return fallback;
  if (!translations || typeof translations !== 'object') return fallback;
  const value = (translations as Record<string, unknown>)[locale];
  if (typeof value === 'string' && value.trim()) return value;
  return fallback;
};

/** Hook variant that uses the active locale automatically. */
export const useTField = () => {
  const { locale } = useI18n();
  return (original: string | null | undefined, translations: TranslationMap | unknown) =>
    tField(original, translations, locale);
};

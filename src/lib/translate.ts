import { getConvexClient } from './convexClient';
import { api } from '../../convex/_generated/api';

export type TranslationContext =
  | 'artwork_title'
  | 'artwork_description'
  | 'about_title'
  | 'about_section';

export type TranslationMap = Record<'en' | 'fr' | 'de' | 'es', string>;

/**
 * Traduz para EN/FR/DE/ES a partir do português via convex/translate.ts
 * (Claude Haiku). Devolve null em caso de falha; quem chama deve continuar —
 * a UI pública cai sempre para PT.
 */
export async function translateContent(
  text: string,
  context: TranslationContext,
): Promise<Partial<TranslationMap> | null> {
  const trimmed = (text ?? '').trim();
  if (!trimmed) return {};
  try {
    const translations = await getConvexClient().action(api.translate.translateContent, {
      text: trimmed,
      context,
      targetLangs: ['en', 'fr', 'de', 'es'],
    });
    return (translations ?? {}) as Partial<TranslationMap>;
  } catch (e) {
    console.warn('translateContent error', e);
    return null;
  }
}

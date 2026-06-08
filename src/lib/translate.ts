import { supabase } from './supabase';

export type TranslationContext =
  | 'artwork_title'
  | 'artwork_description'
  | 'about_title'
  | 'about_section';

export type TranslationMap = Record<'en' | 'fr' | 'de' | 'es', string>;

/**
 * Calls the `translate-content` edge function and returns translations
 * for EN/FR/DE/ES from a Portuguese source. Returns null on failure;
 * callers should keep going (the public UI falls back to PT).
 */
export async function translateContent(
  text: string,
  context: TranslationContext,
): Promise<Partial<TranslationMap> | null> {
  const trimmed = (text ?? '').trim();
  if (!trimmed) return {};
  try {
    const { data, error } = await supabase.functions.invoke('translate-content-021', {
      body: { text: trimmed, context, targetLangs: ['en', 'fr', 'de', 'es'] },
    });
    if (error) {
      console.warn('translate-content error', error);
      return null;
    }
    return (data?.translations ?? {}) as Partial<TranslationMap>;
  } catch (e) {
    console.warn('translate-content exception', e);
    return null;
  }
}

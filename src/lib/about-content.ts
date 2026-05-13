import { supabase } from './supabase';

export type AboutSection = {
  id: string;
  section: string;
  title: string;
  content: string;
  /** Localised heading — { en, fr, de, es }. PT lives in `title`. */
  title_translations: Record<string, string> | null;
  /** Localised body — { en, fr, de, es }. PT lives in `content`. */
  content_translations: Record<string, string> | null;
  display_order: number;
  updated_at: string;
};

export async function getAboutSections(): Promise<AboutSection[]> {
  const { data, error } = await supabase
    .from('about_content')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Failed to load about_content', error);
    return [];
  }
  return (data ?? []) as AboutSection[];
}

export async function updateAboutSection(
  id: string,
  patch: Partial<Pick<AboutSection, 'title' | 'content' | 'display_order' | 'section' | 'title_translations' | 'content_translations'>>,
): Promise<boolean> {
  const { error } = await supabase.from('about_content').update(patch).eq('id', id);
  if (error) console.error(error);
  return !error;
}

export async function createAboutSection(
  row: Omit<AboutSection, 'id' | 'updated_at'>,
): Promise<AboutSection | null> {
  const { data, error } = await supabase
    .from('about_content')
    .insert(row)
    .select('*')
    .single();
  if (error) {
    console.error(error);
    return null;
  }
  return data as AboutSection;
}

export async function deleteAboutSection(id: string): Promise<boolean> {
  const { error } = await supabase.from('about_content').delete().eq('id', id);
  if (error) console.error(error);
  return !error;
}

export async function reorderAboutSections(
  ordered: { id: string; display_order: number }[],
): Promise<boolean> {
  const results = await Promise.all(
    ordered.map((o) =>
      supabase.from('about_content').update({ display_order: o.display_order }).eq('id', o.id),
    ),
  );
  return results.every((r) => !r.error);
}

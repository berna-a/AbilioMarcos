import { supabase } from './supabase';

export type ExhibitionKind = 'individual' | 'collective' | 'collection';

export interface AboutExhibition {
  id: string;
  kind: ExhibitionKind;
  year: number | null;
  title: string;
  city: string | null;
  country: string | null;
  description: string | null;
  display_order: number;
  published: boolean;
  updated_at: string;
}

/** Página pública — só entradas publicadas, ordenadas. */
export async function getPublishedExhibitions(): Promise<AboutExhibition[]> {
  const { data, error } = await supabase
    .from('about_exhibitions')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true });
  if (error) {
    console.error('getPublishedExhibitions', error);
    return [];
  }
  return (data ?? []) as AboutExhibition[];
}

/** Admin — todas (a RLS staff devolve published + rascunhos). */
export async function getAllExhibitions(): Promise<AboutExhibition[]> {
  const { data, error } = await supabase
    .from('about_exhibitions')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('getAllExhibitions', error);
    return [];
  }
  return (data ?? []) as AboutExhibition[];
}

export async function createExhibition(
  row: { kind: ExhibitionKind; title: string; display_order: number; year?: number | null; city?: string | null; country?: string | null; description?: string | null; published?: boolean },
): Promise<AboutExhibition | null> {
  const { data, error } = await supabase.from('about_exhibitions').insert(row).select('*').single();
  if (error) {
    console.error('createExhibition', error);
    return null;
  }
  return data as AboutExhibition;
}

export async function updateExhibition(id: string, patch: Partial<AboutExhibition>): Promise<boolean> {
  const { error } = await supabase
    .from('about_exhibitions')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) console.error('updateExhibition', error);
  return !error;
}

export async function deleteExhibition(id: string): Promise<boolean> {
  const { error } = await supabase.from('about_exhibitions').delete().eq('id', id);
  if (error) console.error('deleteExhibition', error);
  return !error;
}

export async function reorderExhibitions(rows: { id: string; display_order: number }[]): Promise<boolean> {
  const results = await Promise.all(
    rows.map((r) => supabase.from('about_exhibitions').update({ display_order: r.display_order }).eq('id', r.id)),
  );
  return results.every((r) => !r.error);
}

/** Agrupa entradas (mesmo kind) por ano, preservando a ordem. Colecções (year null) ficam num grupo único. */
export function groupByYear(items: AboutExhibition[]): { year: number | null; entries: AboutExhibition[] }[] {
  const groups: { year: number | null; entries: AboutExhibition[] }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.year === item.year) last.entries.push(item);
    else groups.push({ year: item.year, entries: [item] });
  }
  return groups;
}

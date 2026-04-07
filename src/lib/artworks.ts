import { supabase } from '@/lib/supabase';
import { Artwork } from '@/lib/types';

export const getPublishedArtworks = async (): Promise<Artwork[]> => {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('status', 'published')
    .order('year', { ascending: false });

  if (error) {
    console.error('Error fetching artworks:', error);
    return [];
  }
  return data || [];
};

export const getFeaturedArtworks = async (): Promise<Artwork[]> => {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('year', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching featured artworks:', error);
    return [];
  }
  return data || [];
};

export const getSelectedArtworks = async (): Promise<Artwork[]> => {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('year', { ascending: false });

  if (error) {
    console.error('Error fetching selected artworks:', error);
    return [];
  }
  return data || [];
};

export const getArtworkBySlug = async (slug: string): Promise<Artwork | null> => {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching artwork:', error);
    return null;
  }
  return data;
};

export const getRelatedArtworks = async (currentId: string, limit = 3): Promise<Artwork[]> => {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('status', 'published')
    .neq('id', currentId)
    .order('year', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related artworks:', error);
    return [];
  }
  return data || [];
};

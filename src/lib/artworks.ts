import { supabase } from '@/lib/supabase';
import { Artwork } from '@/lib/types';

export const getPublishedArtworks = async (): Promise<Artwork[]> => {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('status', 'published')
    .eq('availability', 'available')
    .not('primary_image_url', 'is', null)
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

/**
 * Most recent published artworks for the public homepage "Recent Works" section.
 * Ordered by created_at (newest first), independent of `is_featured`.
 */
export const getRecentArtworks = async (limit = 6): Promise<Artwork[]> => {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('status', 'published')
    .eq('availability', 'available')
    .not('primary_image_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent artworks:', error);
    return [];
  }
  return data || [];
};

// `getSelectedArtworks` removed in V1 — Selected Works is no longer used publicly.
// `is_featured` is preserved in the data model for future use.


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

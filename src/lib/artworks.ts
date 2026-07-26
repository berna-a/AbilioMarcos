import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { Artwork } from '@/lib/types';
import type { Doc } from "../../convex/_generated/dataModel";

const getConvexClient = () => {
  const url = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_CONVEX_URL)
    ? import.meta.env.VITE_CONVEX_URL
    : "https://deafening-cormorant-584.eu-west-1.convex.cloud";
  return new ConvexHttpClient(url);
};

// Exported for admin pages (Artworks.tsx, ArtworkForm.tsx) that read the
// same shape from the admin-gated queries in convex/adminArtworks.ts.
export const mapArtwork = (a: Doc<"artworks"> | null | undefined): Artwork => {
  if (!a) return a;
  return { ...a, id: a._id, old_id: a.old_id || a._id };
};

export const getPublishedArtworks = async (): Promise<Artwork[]> => {
  try {
    const client = getConvexClient();
    const data = await client.query(api.artworks.getPublishedArtworks);
    return (data || []).map(mapArtwork);
  } catch (error) {
    console.error("Error fetching artworks from Convex:", error);
    return [];
  }
};

export const getFeaturedArtworks = async (): Promise<Artwork[]> => {
  try {
    const client = getConvexClient();
    const data = await client.query(api.artworks.getFeaturedArtworks);
    return (data || []).map(mapArtwork);
  } catch (error) {
    console.error("Error fetching featured artworks from Convex:", error);
    return [];
  }
};

export const getRecentArtworks = async (limit = 6): Promise<Artwork[]> => {
  try {
    const client = getConvexClient();
    const data = await client.query(api.artworks.getRecentArtworks, { limit });
    return (data || []).map(mapArtwork);
  } catch (error) {
    console.error("Error fetching recent artworks from Convex:", error);
    return [];
  }
};

export const getArtworkBySlug = async (slug: string): Promise<Artwork | null> => {
  try {
    const client = getConvexClient();
    const data = await client.query(api.artworks.getArtworkBySlug, { slug });
    return data ? mapArtwork(data) : null;
  } catch (error) {
    console.error("Error fetching artwork by slug from Convex:", error);
    return null;
  }
};

export const getRelatedArtworks = async (currentId: string, limit = 3): Promise<Artwork[]> => {
  try {
    const client = getConvexClient();
    const data = await client.query(api.artworks.getRelatedArtworks, { currentId, limit });
    return (data || []).map(mapArtwork);
  } catch (error) {
    console.error("Error fetching related artworks from Convex:", error);
    return [];
  }
};

export const getArtworksBySlugs = async (slugs: string[]): Promise<Artwork[]> => {
  try {
    const client = getConvexClient();
    const data = await client.query(api.artworks.getArtworksBySlugs, { slugs });
    return (data || []).map(mapArtwork);
  } catch (error) {
    console.error("Error fetching artworks by slugs from Convex:", error);
    return [];
  }
};

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

const getConvexClient = () => {
  const url = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_CONVEX_URL)
    ? import.meta.env.VITE_CONVEX_URL
    : "https://deafening-cormorant-584.eu-west-1.convex.cloud";
  return new ConvexHttpClient(url);
};

export type Exhibition = {
  id: string;
  year: number;
  title: string;
  location: string;
  type: 'individual' | 'coletiva' | 'other';
  /** Localised title — { en, fr, de, es }. PT lives in `title`. */
  title_translations: Record<string, string> | null;
  /** Localised location — { en, fr, de, es }. PT lives in `location`. */
  location_translations: Record<string, string> | null;
  display_order: number;
  updated_at: string;
};

const mapExhibition = (a: Doc<"about_exhibitions"> | null | undefined): Exhibition => {
  if (!a) return a;
  return { ...a, id: a._id, old_id: a.old_id || a._id };
};

export async function getPublishedExhibitions(): Promise<Exhibition[]> {
  try {
    const client = getConvexClient();
    const data = await client.query(api.about.getExhibitions);
    return (data || []).map(mapExhibition);
  } catch (error) {
    console.error('Failed to load about_exhibitions from Convex', error);
    return [];
  }
}

export const getAllExhibitions = getPublishedExhibitions;

export const groupByYear = (exhibitions: Exhibition[]) => {
  return exhibitions.reduce((acc, curr) => {
    const key = curr.year ? String(curr.year) : 'Sem Data';
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, Exhibition[]>);
};

export async function updateExhibition(
  id: string,
  patch: Partial<Pick<Exhibition, 'year' | 'title' | 'location' | 'type' | 'display_order' | 'title_translations' | 'location_translations'>>,
): Promise<boolean> {
  return false;
}

export async function createExhibition(
  row: Omit<Exhibition, 'id' | 'updated_at'>,
): Promise<Exhibition | null> {
  return null;
}

export async function deleteExhibition(id: string): Promise<boolean> {
  return false;
}

export async function reorderExhibitions(
  rows: { id: string; display_order: number }[],
): Promise<boolean> {
  return false;
}

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

const getConvexClient = () => {
  const url = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_CONVEX_URL)
    ? import.meta.env.VITE_CONVEX_URL
    : "https://deafening-cormorant-584.eu-west-1.convex.cloud";
  return new ConvexHttpClient(url);
};

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

const mapAbout = (a: Doc<"about_content"> | null | undefined): AboutSection => {
  if (!a) return a;
  return { ...a, id: a._id, old_id: a.old_id || a._id };
};

export async function getAboutSections(): Promise<AboutSection[]> {
  try {
    const client = getConvexClient();
    const data = await client.query(api.about.getAboutSections);
    return (data || []).map(mapAbout);
  } catch (error) {
    console.error('Failed to load about_content from Convex', error);
    return [];
  }
}

export async function updateAboutSection(
  id: string,
  patch: Partial<Pick<AboutSection, 'title' | 'content' | 'display_order' | 'section' | 'title_translations' | 'content_translations'>>,
): Promise<boolean> {
  // Readonly for now on the frontend
  return false;
}

export async function createAboutSection(
  row: Omit<AboutSection, 'id' | 'updated_at'>,
): Promise<AboutSection | null> {
  // Readonly for now on the frontend
  return null;
}

export async function deleteAboutSection(id: string): Promise<boolean> {
  return false;
}

export async function reorderAboutSections(
  ordered: { id: string; display_order: number }[],
): Promise<boolean> {
  return false;
}

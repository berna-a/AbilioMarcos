export interface Artwork {
  id: string;
  title: string;
  slug: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string | null;
  status: 'draft' | 'published' | 'archived';
  availability: 'available' | 'sold' | 'not_for_sale';
  price: string | null;
  primary_image_url: string | null;
  additional_images: string[] | null;
  is_featured: boolean;
  is_masterwork: boolean;
  created_at: string;
  updated_at: string;
}

export type ArtworkInsert = Omit<Artwork, 'id' | 'created_at' | 'updated_at'>;
export type ArtworkUpdate = Partial<ArtworkInsert>;

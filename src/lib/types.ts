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
  price_amount: number | null;
  price_display: string | null;
  sales_mode: 'direct_purchase' | 'hybrid' | 'inquiry_only';
  purchase_url: string | null;
  shipping_time: string | null;
  shipping_notes: string | null;
  certificate_included: boolean;
  returns_policy_short: string | null;
  primary_image_url: string | null;
  additional_images: string[] | null;
  is_featured: boolean;
  is_masterwork: boolean;
  created_at: string;
  updated_at: string;
}

export type ArtworkInsert = Omit<Artwork, 'id' | 'created_at' | 'updated_at'>;
export type ArtworkUpdate = Partial<ArtworkInsert>;

export interface Inquiry {
  id: string;
  artwork_id: string | null;
  artwork_title: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  budget_range: string | null;
  created_at: string;
  status: 'new' | 'responded' | 'closed';
}

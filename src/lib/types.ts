export type SizeCategory = 'small' | 'medium' | 'large' | 'other';

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  year: number;
  description: string | null;
  status: 'draft' | 'published' | 'archived';
  availability: 'available' | 'sold' | 'not_for_sale';
  price: number | null;
  purchase_url: string | null;
  size_category: SizeCategory;
  custom_width_cm: number | null;
  custom_height_cm: number | null;
  is_featured: boolean;
  primary_image_url: string | null;
  additional_images: string[] | null;
  created_at: string;
  updated_at: string;
}

export type ArtworkInsert = Omit<Artwork, 'id' | 'created_at' | 'updated_at'>;
export type ArtworkUpdate = Partial<ArtworkInsert>;

/** Derive sales mode from price */
export const getSalesMode = (price: number | null): 'direct_purchase' | 'hybrid' | 'inquiry_only' => {
  if (price == null) return 'inquiry_only';
  if (price <= 1000) return 'direct_purchase';
  if (price <= 2999) return 'hybrid';
  return 'inquiry_only';
};

/** Format price for display */
export const formatPrice = (price: number | null): string | null => {
  if (price == null) return null;
  return `€${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

/** Get display dimensions from size category */
export const getDimensions = (artwork: Pick<Artwork, 'size_category' | 'custom_width_cm' | 'custom_height_cm'>): string => {
  switch (artwork.size_category) {
    case 'small': return '80 × 80 cm';
    case 'medium': return '90 × 90 cm';
    case 'large': return '91 × 121 cm';
    case 'other':
      if (artwork.custom_width_cm && artwork.custom_height_cm) {
        return `${artwork.custom_width_cm} × ${artwork.custom_height_cm} cm`;
      }
      return '';
    default: return '';
  }
};

export const MEDIUM_DISPLAY = 'Oil on canvas';

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

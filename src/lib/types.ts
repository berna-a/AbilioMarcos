export type SizeCategory = 'small' | 'medium' | 'large' | 'other';

/** Allowed techniques (canonical Portuguese values stored in DB). */
export const TECHNIQUE_VALUES = ['Óleo sobre tela', 'Acrílico sobre tela', 'Técnica mista'] as const;
export type Technique = typeof TECHNIQUE_VALUES[number];

export const DEFAULT_TECHNIQUE: Technique = 'Óleo sobre tela';

export type SizeBucket = 'small' | 'medium' | 'large';
export type Format = 'vertical' | 'square' | 'horizontal';

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  year: number;
  description: string | null;
  status: 'draft' | 'published' | 'archived';
  availability: 'available' | 'sold' | 'not_for_sale';
  price: number | null;
  /** Real artwork dimensions in cm (preferred). */
  width_cm: number | null;
  height_cm: number | null;
  /** Per-artwork technique (e.g. "Óleo sobre tela"). */
  technique: Technique | string | null;
  /** Legacy fields — kept for backward compatibility, not used in V1 public UI. */
  size_category: SizeCategory | null;
  custom_width_cm: number | null;
  custom_height_cm: number | null;
  reference: string | null;
  is_featured: boolean;
  primary_image_url: string | null;
  additional_images: string[] | null;
  created_at: string;
  updated_at: string;
}

export type ArtworkInsert = Omit<Artwork, 'id' | 'created_at' | 'updated_at'>;
export type ArtworkUpdate = Partial<ArtworkInsert>;

/** Derive sales mode from price.
 *  All artworks with a price are eligible for direct online purchase via Stripe,
 *  regardless of price tier. Only artworks without a price fall back to inquiry. */
export const getSalesMode = (price: number | null): 'direct_purchase' | 'hybrid' | 'inquiry_only' => {
  if (price == null) return 'inquiry_only';
  return 'direct_purchase';
};

/** Format price for display — European style: 1.500 € */
export const formatPrice = (price: number | null): string | null => {
  if (price == null) return null;
  return `${price.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €`;
};

/** Resolve actual width/height in cm, falling back to legacy fields when present. */
export const getArtworkSize = (
  artwork: Pick<Artwork, 'width_cm' | 'height_cm' | 'size_category' | 'custom_width_cm' | 'custom_height_cm'>
): { width: number | null; height: number | null } => {
  if (artwork.width_cm && artwork.height_cm) {
    return { width: Number(artwork.width_cm), height: Number(artwork.height_cm) };
  }
  if (artwork.custom_width_cm && artwork.custom_height_cm) {
    return { width: Number(artwork.custom_width_cm), height: Number(artwork.custom_height_cm) };
  }
  switch (artwork.size_category) {
    case 'small': return { width: 80, height: 80 };
    case 'medium': return { width: 90, height: 90 };
    case 'large': return { width: 91, height: 121 };
    default: return { width: null, height: null };
  }
};

/** Display real dimensions: "120 × 150 cm". */
export const getRealDimensions = (
  artwork: Pick<Artwork, 'width_cm' | 'height_cm' | 'size_category' | 'custom_width_cm' | 'custom_height_cm'>
): string => {
  const { width, height } = getArtworkSize(artwork);
  if (!width || !height) return '';
  return `${width} × ${height} cm`;
};

/** Automatic size bucket from largest dimension.
 *  Pequeno ≤ 80 cm · Médio ≤ 100 cm · Grande > 100 cm */
export const getSizeBucket = (
  artwork: Pick<Artwork, 'width_cm' | 'height_cm' | 'size_category' | 'custom_width_cm' | 'custom_height_cm'>
): SizeBucket | null => {
  const { width, height } = getArtworkSize(artwork);
  if (!width || !height) return null;
  const max = Math.max(width, height);
  if (max <= 80) return 'small';
  if (max <= 100) return 'medium';
  return 'large';
};

/** Automatic format from width/height. Square tolerance ±5%. */
export const getFormat = (
  artwork: Pick<Artwork, 'width_cm' | 'height_cm' | 'size_category' | 'custom_width_cm' | 'custom_height_cm'>
): Format | null => {
  const { width, height } = getArtworkSize(artwork);
  if (!width || !height) return null;
  const ratio = width / height;
  if (Math.abs(ratio - 1) <= 0.05) return 'square';
  return ratio < 1 ? 'vertical' : 'horizontal';
};

/** Resolve a displayable technique label. */
export const getTechnique = (artwork: Pick<Artwork, 'technique'>): string => {
  const t = (artwork.technique || '').toString().trim();
  return t || DEFAULT_TECHNIQUE;
};

/** @deprecated Use getTechnique(artwork) instead. Kept only for legacy fallbacks. */
export const MEDIUM_DISPLAY = DEFAULT_TECHNIQUE;

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

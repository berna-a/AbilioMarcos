export type SizeCategory = 'small' | 'medium' | 'large' | 'other';

/** Allowed techniques (canonical Portuguese values stored in DB). */
export const TECHNIQUE_VALUES = ['Óleo sobre tela', 'Acrílico sobre tela', 'Técnica mista'] as const;
export type Technique = typeof TECHNIQUE_VALUES[number];

export const DEFAULT_TECHNIQUE: Technique = 'Óleo sobre tela';

// Tags de classificação (para análise estratégica de campanhas — que tipo de obra converte).
// Vazio = não classificado. Listas curadas para a obra abstrata/expressionista do Abílio.
export const THEME_VALUES = ['Abstrato', 'Paisagem', 'Mar / Costa', 'Natureza', 'Urbano', 'Figura / Humano', 'Floral', 'Outro'] as const;
export const COLOR_VALUES = ['Tons quentes', 'Tons frios', 'Tons terra / neutros', 'Multicolor', 'Escuro / Dramático', 'Claro / Suave'] as const;
export const STYLE_VALUES = ['Expressionista', 'Gestual', 'Texturado / Matérico', 'Abstrato lírico', 'Minimalista'] as const;

export type SizeBucket = 'small' | 'medium' | 'large';
export type Format = 'vertical' | 'square' | 'horizontal';

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  year: number;
  description: string | null;
  status: 'draft' | 'published' | 'archived';
  availability: 'available' | 'sold' | 'not_for_sale' | 'exhibition';
  /** Convex schema allows string|number|null — legacy rows imported from
   *  Supabase kept price as text. Always run through `toNumericPrice()`
   *  before doing arithmetic or `Number.isFinite` checks. */
  price: number | string | null;
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
  /** Nome/local da exposição quando availability === 'exhibition'. */
  exhibition_name: string | null;
  /** Tags para análise estratégica — não aparecem no site público. */
  theme: string | null;
  dominant_color: string | null;
  art_style: string | null;
  primary_image_url: string | null;
  additional_images: string[] | null;
  /** Localised title — { en, fr, de, es }. PT lives in `title`. */
  title_translations: Record<string, string> | null;
  /** Localised description — { en, fr, de, es }. PT lives in `description`. */
  description_translations: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export type ArtworkInsert = Omit<Artwork, 'id' | 'created_at' | 'updated_at'>;
export type ArtworkUpdate = Partial<ArtworkInsert>;

/** MASTER SWITCH — checkout online (Stripe) globalmente ativo?
 *  Mantém `false` enquanto o Stripe não estiver live (sem STRIPE_SECRET_KEY_021).
 *  Com `false`, o CTA "Adquirir Online" cai automaticamente para o fluxo de
 *  contacto/lead, em vez de mostrar um erro de pagamento.
 *  Quando o Stripe estiver ativado: muda para `true` + redeploy. */
export const CHECKOUT_ENABLED: boolean = true;

/** Normalize a price value that may arrive from Convex as a string, a
 *  number, or null (see `schema.ts`: `price: v.union(v.string(), v.number(),
 *  v.null())` — legacy rows imported from Supabase kept the text type).
 *  Without this coercion, `Number.isFinite("500")` is `false` (it does NOT
 *  coerce strings), which silently disabled online checkout and broke
 *  thousands-separator formatting for every artwork with a string price. */
export const toNumericPrice = (price: number | string | null | undefined): number | null => {
  if (price == null) return null;
  const n = typeof price === 'string' ? Number(price) : price;
  return Number.isFinite(n) ? n : null;
};

/** Derive sales mode from price.
 *  All artworks with a valid positive price are eligible for direct online
 *  purchase via Stripe, regardless of price tier. Anything else falls back
 *  to inquiry. */
export const getSalesMode = (price: number | string | null): 'direct_purchase' | 'hybrid' | 'inquiry_only' => {
  const p = toNumericPrice(price);
  if (p == null || p <= 0) return 'inquiry_only';
  return 'direct_purchase';
};

/** Single source of truth: can this artwork be purchased online via Stripe?
 *  Must mirror the validation in supabase/functions/create-checkout/index.ts.
 *  Eligibility requires ALL of:
 *    - status === 'published'
 *    - availability === 'available' (NOT 'sold' and NOT 'not_for_sale')
 *    - a valid positive price
 *  Artworks marked `not_for_sale` are explicitly excluded from online checkout —
 *  they fall back to the inquiry CTA regardless of whether a price is set. */
export const isOnlineCheckoutEligible = (
  artwork: Pick<Artwork, 'status' | 'availability' | 'price'>
): boolean => {
  if (!CHECKOUT_ENABLED) return false;
  if (artwork.status !== 'published') return false;
  if (artwork.availability !== 'available') return false;
  const p = toNumericPrice(artwork.price);
  return p != null && p > 0;
};

/** Format price for display — European style: 1.500 € */
export const formatPrice = (price: number | string | null): string | null => {
  const p = toNumericPrice(price);
  if (p == null) return null;
  return `${p.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €`;
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

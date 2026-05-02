-- Add missing 'technique' column to artworks and reload PostgREST schema cache
ALTER TABLE public.artworks
  ADD COLUMN IF NOT EXISTS technique text;

NOTIFY pgrst, 'reload schema';

ALTER TABLE public.artworks
  ADD COLUMN IF NOT EXISTS width_cm NUMERIC,
  ADD COLUMN IF NOT EXISTS height_cm NUMERIC;

NOTIFY pgrst, 'reload schema';

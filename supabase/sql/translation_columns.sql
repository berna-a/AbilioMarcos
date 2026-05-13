-- Run this in the Supabase SQL editor.
-- Adds translation columns for multilingual editable content.
-- Translations live as JSONB { en, fr, de, es }. Portuguese remains the
-- canonical value in the existing column and is the fallback when a
-- translation is missing.

alter table public.artworks
  add column if not exists title_translations jsonb,
  add column if not exists description_translations jsonb;

alter table public.about_content
  add column if not exists title_translations jsonb,
  add column if not exists content_translations jsonb;

-- Optional: tiny helper to inspect coverage
-- select id, title, title_translations is not null as has_title_t,
--        description is not null as has_desc,
--        description_translations is not null as has_desc_t
-- from public.artworks order by created_at desc;

notify pgrst, 'reload schema';

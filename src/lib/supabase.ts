import { createClient } from '@supabase/supabase-js';

// AOS (SSOT) — gaveta do cliente 021. Migrado de abiliomarcos.com em 06/2026.
const supabaseUrl = 'https://hwpixsuovwxgilyfoszw.supabase.co';
const supabaseAnonKey = 'sb_publishable_4zfZ95cWvrhy0nWmqjEzqQ_kKh3jGAa';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'cliente_021' },
});

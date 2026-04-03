import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hbrvappgklorjxojyvqz.supabase.co';
const supabaseAnonKey = 'sb_publishable_eb2twQ9qN6w3tFXWfjWTWA_D6S-cG3y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

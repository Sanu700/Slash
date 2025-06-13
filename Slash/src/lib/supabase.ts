import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { config } from '@/config';

const SUPABASE_URL = config.supabase.url;
const SUPABASE_KEY = config.supabase.key;

console.log('Using Supabase URL:', SUPABASE_URL);
console.log('Using Supabase Key:', SUPABASE_KEY ? 'Key exists' : 'Key missing');

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
}); 
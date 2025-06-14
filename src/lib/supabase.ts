import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { config } from '@/config';

const SUPABASE_URL = config.supabase.url;
const SUPABASE_KEY = config.supabase.key;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
}); 
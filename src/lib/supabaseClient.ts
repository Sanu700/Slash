// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { config } from '@/config';

console.log('Using Supabase URL:', config.supabase.url);
console.log('Using Supabase Key:', config.supabase.key ? 'Key exists' : 'missing');

export const supabase = createClient(
  config.supabase.url,
  config.supabase.key
);

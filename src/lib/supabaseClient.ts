// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Try to read from import.meta.env, but fall back to literal strings
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || 'https://ceqpdprcqhmkqdbgmmkn.supabase.co';
const supabaseKey  = import.meta.env.VITE_SUPABASE_KEY  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…';

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using Supabase Key:', supabaseKey ? 'Key exists' : 'missing');

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

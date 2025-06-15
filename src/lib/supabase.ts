import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ceqpdprcqhmkqdbgmmkn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcXBkcHJjcWhta3FkYmdtbWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzE5NjEsImV4cCI6MjA1Nzk0Nzk2MX0.Fubqn2A_YL6gWUQDwCYgPxpAX7L-cztoT88jZ6ChmP0';

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using Supabase Key:', supabaseAnonKey ? 'Key exists' : 'Key missing');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
}); 
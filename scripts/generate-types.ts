import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

try {
  // Generate types using Supabase CLI
  execSync(
    `npx supabase gen types typescript --project-id ${supabaseUrl} --schema public > src/types/supabase.ts`,
    { stdio: 'inherit' }
  );

  console.log('Types generated successfully!');
} catch (error) {
  console.error('Error generating types:', error);
  process.exit(1);
} 
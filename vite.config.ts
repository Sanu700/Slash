import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Debug log environment variables
  console.log('Vite mode:', mode);
  console.log('Vite env:', {
    SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    SUPABASE_KEY: process.env.VITE_SUPABASE_KEY ? 'exists' : 'missing'
  });
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    envPrefix: 'VITE_',
    // Explicitly define environment variables
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_KEY': JSON.stringify(process.env.VITE_SUPABASE_KEY)
    }
  };
});

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
      host: "localhost",
      port: 8080,
      watch: {
        usePolling: false,
      },
      proxy: {
        '/api/ai': {
          target: 'https://slash-rag-agent.onrender.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/ai/, ''),
          secure: true,
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    envPrefix: 'VITE_',
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_KEY': JSON.stringify(process.env.VITE_SUPABASE_KEY),
    },
  };
});

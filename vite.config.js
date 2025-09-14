import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VercelPlugin } from '@vercel/vite-plugin-vercel';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VercelPlugin()],
  server: {
    // This is the proxy configuration
    proxy: {
      '/api': {
        // This is the target where your Vercel-style function will run
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})


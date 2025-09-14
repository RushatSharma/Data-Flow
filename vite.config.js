import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is the proxy configuration for local development
    proxy: {
      '/api': {
        // This is the target where your local Express server will run
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
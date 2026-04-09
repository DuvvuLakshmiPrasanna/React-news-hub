import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  base: '/React-news-hub/',
  plugins: [
    react(),
    visualizer({
      filename: 'stats.html',
      gzipSize: true,
      open: false,
    }),
  ],
})

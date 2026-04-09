import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { env } from 'node:process'

const repository = env.GITHUB_REPOSITORY?.split('/')[1] || ''
const isUserOrOrgPage = repository.endsWith('.github.io')
const base =
  env.GITHUB_ACTIONS === 'true' && repository && !isUserOrOrgPage
    ? `/${repository}/`
    : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    visualizer({
      filename: 'stats.html',
      gzipSize: true,
      open: false,
    }),
  ],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Serve ui-studio/ as static root → /blueprints/library/assets/... works
  publicDir: 'ui-studio',
})

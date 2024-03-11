import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3004,
  },
  preview: {
    port: 3004,
  },
  plugins: [react()],
})

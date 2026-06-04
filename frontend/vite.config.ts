import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/parse_text_file": "http://localhost:8000",
      "/library": "http://localhost:8000"
    }
  },
  plugins: [react()],
})

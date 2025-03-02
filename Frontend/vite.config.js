import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Fix for the DEFINES error
    '**DEFINES**': '{}',
  },
})

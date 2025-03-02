import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
   '__DEFINES__': '{}',
  // No define section needed with our fix
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Don't use process.env directly like this
    // 'process.env': process.env,
    
    // Instead define specific variables:
    'import.meta.env.VITE_BASE_URL': JSON.stringify('https://trupt.onrender.com'),
    // If you have other environment variables, add them here
    // 'import.meta.env.VITE_OTHER_VAR': JSON.stringify(process.env.VITE_OTHER_VAR),
    
    // Add this to fix the DEFINES error
    '**DEFINES**': '{}',
  },
})

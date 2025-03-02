// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // This is crucial - ensure all your environment variables are defined here
    'process.env': process.env,
    'VITE_BASE_URL':JSON.stringify('https://trupt.onrender.com')
    // If you're using specific variables, define them explicitly:
    // 'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
})

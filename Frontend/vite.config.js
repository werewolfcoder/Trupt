import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Add any path aliases if needed
      '@': '/src',
    }
  },
  define: {
    global: 'window', // This handles most global undefined issues
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://trupt.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Add other dependencies that need optimization
    esbuildOptions: {
      define: {
        global: 'globalThis' // Another way to handle global
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Split vendor chunks
          // Add other chunks as needed
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true // Handle mixed module types
    }
  }
})

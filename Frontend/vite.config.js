import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Define all required global variables
    __DEFINES__: JSON.stringify({}),
    __HMR_CONFIG_NAME__: JSON.stringify({}),
    __BASE__: JSON.stringify({}),
    __HMR_PROTOCOL__: JSON.stringify(''),
    __HMR_HOSTNAME__: JSON.stringify(''),
    __HMR_PORT__: JSON.stringify(''),
    __SERVER_HOST__:JSON.stringify(''),
    global: 'globalThis',
    // Add any other undefined globals you encounter
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  }
})

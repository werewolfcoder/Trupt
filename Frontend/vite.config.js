import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
    define: {
    __DEFINES__: {},
       __HMR_CONFIG_NAME__:{}
  }
  // No define section needed with our fix
})

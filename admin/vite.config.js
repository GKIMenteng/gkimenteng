import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/.pnpm/firebase') || id.includes('node_modules/firebase')) {
            return 'firebase'
          }
          if (id.includes('node_modules/.pnpm/@firebase') || id.includes('node_modules/@firebase')) {
            return 'firebase'
          }
          if (id.includes('node_modules/html5-qrcode') || id.includes('node_modules/qrcode')) {
            return 'qr-scanner'
          }
          if (id.includes('node_modules/jspdf') || id.includes('node_modules/jspdf-autotable')) {
            return 'pdf'
          }
          if (id.includes('node_modules/qrcode.vue')) {
            return 'qr-code'
          }
          if (id.includes('node_modules/bootstrap')) {
            return 'bootstrap'
          }
        },
      },
    },
  },
})

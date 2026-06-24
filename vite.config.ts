import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vintage-vinyl-player/',
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self' https://js.stripe.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com; connect-src 'self' https://api.stripe.com;",
    },
  },
})

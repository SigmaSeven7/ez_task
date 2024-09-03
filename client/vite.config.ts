// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     watch: {
//       usePolling: true,
//     },
//     host: true, // needed for the Docker Container port mapping to work
//     strictPort: true,
//     port: 5173, // you can replace this port with any port
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 5173,
    proxy: {
      '/socket.io': {
        target: 'wss://server-nestjs:3000',
        ws: true,
        secure: false,
      },
      '/api': {
        target: 'http://server-nestjs:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true
      }
    }
  }
})
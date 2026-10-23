// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/kakao-search': {
        target: 'https://dapi.kakao.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kakao-search/, '/v2/local/search/keyword.json'),
        headers: {
          'Authorization': 'KakaoAK 261c1144d37bbb5e42dcfa07fc1f0c2c',
          'Referer': 'http://localhost:5173'
        }
      }
    }
  }
})
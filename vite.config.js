// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        // 네이버 검색 API 프록시 설정
        '/api/naver': {
          target: 'https://openapi.naver.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/naver/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // 네이버 API 인증 헤더 추가
              proxyReq.setHeader('X-Naver-Client-Id', env.VITE_NAVER_CLIENT_ID || '');
              proxyReq.setHeader('X-Naver-Client-Secret', env.VITE_NAVER_CLIENT_SECRET || '');
              
            });
            
            proxy.on('proxyRes', (proxyRes, req, res) => {
            });
            
            proxy.on('error', (err, req, res) => {
            });
          }
        }
      }
    }
  }
})
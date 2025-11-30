// tailwind.config.js (최종 수정 버전)

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // 💡 프로젝트의 모든 JSX/TSX 파일을 스캔하도록 설정
    "./index.html",
    // src 폴더 내의 모든 .js, .ts, .jsx, .tsx 파일을 포함
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      // 💡 custom animation (slideUp) 정의 추가
      keyframes: {
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
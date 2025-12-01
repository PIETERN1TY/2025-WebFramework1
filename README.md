# MY BOARD - 개인 맞춤형 대시보드 애플리케이션

React 기반의 개인 맞춤형 위젯 대시보드 애플리케이션입니다. 사용자는 자신만의 캔버스를 생성하고, 다양한 위젯을 자유롭게 배치하여 개인화된 대시보드를 구성할 수 있습니다.

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [프로젝트 구조](#프로젝트-구조)
- [사용 가능한 위젯](#사용-가능한-위젯)
- [테마 시스템](#테마-시스템)
- [API 설정](#api-설정)

## ✨ 주요 기능

### 사용자 관리
- **회원가입/로그인**: 이메일 기반 사용자 인증
- **프로필 관리**: 닉네임, 이메일, 프로필 사진 변경
- **비밀번호 설정**: 선택적 비밀번호 설정 및 변경
- **회원 탈퇴**: 모든 데이터 완전 삭제

### 캔버스 시스템
- **다중 캔버스 지원**: 사용자별로 여러 개의 캔버스 생성 가능
- **드래그 앤 드롭**: 위젯을 자유롭게 배치
- **리사이즈**: 위젯 크기 조절 (12칸 그리드 시스템)
- **캔버스 관리**: 생성, 삭제, 활성화/비활성화
- **자동 저장**: 레이아웃 변경 시 자동 저장

### 테마 시스템
- **8가지 테마**: 파란색, 보라색, 핑크색, 빨간색, 주황색, 노란색, 라임색, 회색
- **실시간 적용**: 테마 변경 시 즉시 반영
- **사용자별 저장**: 각 사용자의 테마 설정 독립적으로 저장
- **로그인 시 자동 로드**: 마지막 선택한 테마 자동 적용

## 🛠 기술 스택

### Frontend
- **React 18.3.1**: UI 라이브러리
- **React Router DOM 6.28.0**: 라우팅
- **Tailwind CSS 3.4.17**: 스타일링
- **React Grid Layout 1.5.0**: 드래그 앤 드롭 그리드
- **React Icons 5.3.0**: 아이콘

### API & 외부 서비스
- **네이버 뉴스 API**: 실시간 뉴스 조회
- **Google Generative Language API**: 다국어 번역
- **OpenWeatherMap API**: 날씨 정보

### 상태 관리
- **localStorage**: 사용자 데이터, 캔버스, 메모, 테마 등 저장
- **React Hooks**: useState, useEffect, useMemo 활용

## 🚀 시작하기

### 설치

```bash
# 저장소 클론
git clone <repository-url>

# 디렉토리 이동
cd my-board

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
```

## 📁 프로젝트 구조

```
number_8
├─ .env
├─ AGENT.md
├─ README.md
├─ eslint.config.js
├─ index.html
├─ number_8.iml
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ src
│  ├─ App.jsx
│  ├─ assets
│  │  └─ images
│  │     ├─ arrow.png
│  │     ├─ canvas.png
│  │     ├─ home.png
│  │     ├─ moon.png
│  │     ├─ settings.png
│  │     ├─ toro.jpg
│  │     └─ widget.png
│  ├─ components
│  │  ├─ auth
│  │  │  └─ ProtectedRoute.jsx
│  │  ├─ pages
│  │  │  ├─ CanvasPage.jsx
│  │  │  ├─ Canvaseditor.jsx
│  │  │  ├─ DashboardPage.jsx
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ SettingsPage.jsx
│  │  │  ├─ SignupPage.jsx
│  │  │  ├─ WidgetPage.jsx
│  │  │  └─ layout
│  │  │     └─ SideMenu.jsx
│  │  └─ widget
│  │     └─ Basic
│  │        ├─ calendar
│  │        │  └─ CalendarWidget.jsx
│  │        ├─ memo
│  │        │  ├─ MemoWidgetLarge.jsx
│  │        │  └─ MemoWidgetSmall.jsx
│  │        ├─ news
│  │        │  ├─ NewsWidgetLarge.jsx
│  │        │  └─ NewsWidgetSmall.jsx
│  │        ├─ translator
│  │        │  └─ TranslatorWidget.jsx
│  │        └─ weather
│  │           ├─ WeatherWidgetLarge.jsx
│  │           └─ WeatherWidgetSmall.jsx
│  ├─ config
│  │  └─ WidgetConfig.js
│  ├─ main.jsx
│  ├─ pages
│  │  └─ DashboardPage.jsx
│  └─ styles
│     └─ css
│        └─ index.css
├─ tailwind.config.js
└─ vite.config.js

```

## 🎨 사용 가능한 위젯

### 메모 위젯 (Memo Widget)
- **소형**: 최신 메모 1개 표시
- **대형**: 모든 메모 목록 표시
- **기능**: 메모 작성, 수정, 삭제
- **저장**: 사용자별 localStorage 저장

### 뉴스 위젯 (News Widget)
- **소형**: 드롭다운 메뉴로 섹션 선택
- **대형**: 탭 메뉴로 섹션 전환
- **섹션**: 전체, 경제, 연예, 건강, 스포츠
- **기능**: 뉴스 클릭 시 새 탭에서 열기
- **API**: 네이버 뉴스 검색 API

### 날씨 위젯 (Weather Widget)
- **소형**: 현재 날씨 간단 표시
- **대형**: 상세 날씨 정보 및 주간 예보
- **기능**: 위치 기반 날씨 조회
- **API**: OpenWeatherMap API

### 캘린더 위젯 (Calendar Widget)
- **월간 캘린더**: 현재 월 표시
- **날짜 선택**: 클릭으로 날짜 선택
- **오늘 표시**: 오늘 날짜 강조
- **테마 연동**: 선택된 날짜에 테마 색상 적용

### 번역 위젯 (Translator Widget)
- **다국어 지원**: 14개 언어
  - 한국어, 영어, 일본어, 프랑스어, 독일어
  - 스페인어, 중국어, 러시아어, 이탈리아어
  - 포르투갈어, 아랍어, 힌디어, 태국어, 베트남어
- **API**: Google Generative Language API

## 🎭 테마 시스템

### 테마 색상 구성
각 테마는 3가지 색상으로 구성:
- **Primary**: 사이드바 배경색
- **Secondary**: 포인트 컬러 (버튼, 링크 등)
- **Gradient**: 버튼 그라디언트

### 사용 가능한 테마

| 테마 | Primary | Secondary | 용도 |
|------|---------|-----------|------|
| 파란색 | #5480F7 | #A9CBFF | 기본 테마 |
| 보라색 | #B85AFF | #DEB3FF | 우아한 느낌 |
| 핑크색 | #FF98F5 | #FFD6FB | 부드러운 느낌 |
| 빨간색 | #7f1d1d | #ef4444 | 강렬한 느낌 |
| 주황색 | #FD9941 | #FED1AA | 따뜻한 느낌 |
| 노란색 | #EBDA18 | #F2EA8B | 밝은 느낌 |
| 라임색 | #315555 | #72937B | 자연스러운 느낌 |
| 회색 | #374151 | #6b7280 | 모던한 느낌 |

### CSS 변수 사용
```css
:root {
  --theme-primary: #5480F7;
  --theme-secondary: #A9CBFF;
  --theme-gradient: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
}
```

## 🔌 API 설정

### 네이버 뉴스 API

1. **네이버 개발자 센터**에서 애플리케이션 등록
2. Client ID와 Client Secret 발급
3. `vite.config.js`에 프록시 설정 추가:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api/naver': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/naver/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('X-Naver-Client-Id', 'YOUR_CLIENT_ID');
            proxyReq.setHeader('X-Naver-Client-Secret', 'YOUR_CLIENT_SECRET');
          });
        }
      }
    }
  }
});
```
### Google Generative Language API

1. **Google AI Studio**에서 API 키 발급
   - https://makersuite.google.com/app/apikey 접속
   - API 키 생성

2. 환경 변수 설정 또는 직접 코드에 추가:

```javascript
// TranslatorWidget.jsx에서 사용
const API_KEY = 'YOUR_GOOGLE_API_KEY';

const translateText = async (text, sourceLang, targetLang) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Translate the following text from ${sourceLang} to ${targetLang}: "${text}"`
          }]
        }]
      })
    }
  );
};
```

### OpenWeatherMap API

1. **OpenWeatherMap**에서 무료 계정 생성
   - https://openweathermap.org/api 접속
   - API 키 발급 (Free tier: 1,000 calls/day)

2. `vite.config.js`에 프록시 설정 추가:

```javascript
// WeatherWidgetLarge.jsx, WeatherWidgetSmall.jsx에서 사용
export default defineConfig({
  server: {
    proxy: {
      '/api/weather': {
        target: 'https://api.openweathermap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, '/data/2.5')
      }
    }
  }
});
```

## 📊 데이터 구조

### localStorage 키

```javascript
// 사용자 관리
users: {}                              // 모든 사용자 정보
currentUser: {}                        // 현재 로그인 사용자

// 캔버스
canvases_{userId}: []                  // 사용자의 캔버스 목록
canvas_{userId}_{canvasId}: {}         // 특정 캔버스 데이터
activeCanvas_{userId}: canvasId        // 활성 캔버스 ID

// 위젯 데이터
memos_{userId}: []                     // 사용자의 메모 목록

// 테마
theme_{userId}: 'blue'                 // 사용자의 테마 설정
```

### 캔버스 데이터 구조

```javascript
{
  id: 1701234567890,
  name: "내 대시보드",
  createdAt: "2024-12-01T12:00:00.000Z",
  layout: [
    {
      i: "memo-small",           // 위젯 ID
      x: 0,                      // X 좌표 (0-11)
      y: 0,                      // Y 좌표
      w: 3,                      // 너비 (1-12)
      h: 3,                      // 높이
      minW: 2,                   // 최소 너비
      minH: 2                    // 최소 높이
    }
  ]
}
```

### 메모 데이터 구조

```javascript
{
  id: 1701234567890,
  title: "메모 제목",
  content: "메모 내용",
  createdAt: "2024-12-01T12:00:00.000Z",
  updatedAt: "2024-12-01T13:00:00.000Z"  // 선택적
}
```

## 🎯 주요 기능 상세

### 1. 캔버스 생성 및 관리

```javascript
// 새 캔버스 생성
const newCanvas = {
  id: Date.now(),
  name: canvasName,
  createdAt: new Date().toISOString(),
  layout: []
};

// 캔버스 저장
const canvases = JSON.parse(localStorage.getItem(`canvases_${userId}`)) || [];
canvases.push(newCanvas);
localStorage.setItem(`canvases_${userId}`, JSON.stringify(canvases));
```

### 2. 위젯 배치 및 저장

```javascript
// 레이아웃 변경 시 자동 저장
const onLayoutChange = (newLayout) => {
  const updatedCanvas = {
    ...activeCanvas,
    layout: newLayout
  };
  
  localStorage.setItem(
    `canvas_${userId}_${canvasId}`,
    JSON.stringify(updatedCanvas)
  );
};
```

### 3. 테마 적용

```javascript
// 테마 색상 적용
const applyTheme = (themeId) => {
  const theme = THEME_COLORS[themeId];
  document.documentElement.style.setProperty('--theme-primary', theme.primary);
  document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
  document.documentElement.style.setProperty('--theme-gradient', theme.gradient);
};
```

## 🔒 보안

- **비밀번호**: 현재 평문 저장 
- **인증**: localStorage 기반
- **데이터**: 클라이언트 로컬 저장

## 🐛 알려진 이슈

- localStorage 용량 제한 (약 5-10MB)
- 브라우저 간 데이터 공유 불가
- 서버 동기화 미지원

## 🚧 향후 개발 계획

- [ ] 백엔드 API 연동
- [ ] 데이터베이스 연동
- [ ] 사용자 인증 강화 (JWT)
- [ ] 소셜 로그인 (Google, Kakao)
- [ ] 위젯 추가 개발
- [ ] 다크 모드 지원
- [ ] 위젯 공유 기능
- [ ] 캔버스 내보내기/가져오기


---

**MY BOARD** - 당신만의 맞춤형 대시보드를 만들어보세요! 🎨

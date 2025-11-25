// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './components/pages/DashboardPage.jsx';
import NewsWidgetLarge from '../src/components/widget/Basic/news/NewsWidgetLarge.jsx';
import NewsWidgetSmall from '../src/components/widget/Basic/news/NewsWidgetSmall.jsx';
import CalendarWidget from '../src/components/widget/Basic/calendar/CalendarWidget.jsx';
import WeatherWidgetLarge from '../src/components/widget/Basic/weather/WeatherWidgetLarge.jsx';
import WeatherWidgetSmall from '../src/components/widget/Basic/weather/WeatherWidgetSmall.jsx';
import TranslatorWidget from '../src/components/widget/Basic/translator/TranslatorWidget.jsx';
import CanvasEditor from './components/pages/CanvasEditor.jsx'; 

// 참고: App.css import는 제거된 상태를 유지합니다.

function App() {
  return (
    // 라우팅을 위한 BrowserRouter 설정
    <BrowserRouter>
      {/* DashboardPage를 유일한 Route로 설정하여 전체 레이아웃을 잡습니다. */}
      {/* 이 Route 내에서 SideMenu를 렌더링하고, URL에 따라 내부 콘텐츠만 변경합니다. */}
      <Routes>
        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
// [가상] App.jsx 또는 LayoutContext.js

// 위젯 목록 (사용 가능한 모든 위젯의 목록)
export const WIDGET_OPTIONS = [
  { id: 'newsL', name: '뉴스 (대형)', Component: NewsWidgetLarge },
  { id: 'trans', name: '번역기', Component: TranslatorWidget },
  { id: 'cal', name: '캘린더', Component: CalendarWidget },
  { id: 'weatherL', name: '날씨 (대형)', Component: WeatherWidgetLarge },
  { id: 'weatherS', name: '날씨 (소형)', Component: WeatherWidgetSmall },
  // ... 기타 위젯
];

// 초기 레이아웃 상태 (w, h는 그리드 셀 단위 크기)
export const INITIAL_LAYOUT = [
  { i: 'newsL', x: 0, y: 0, w: 4, h: 4, static: false },
  { i: 'trans', x: 4, y: 0, w: 4, h: 4, static: false },
  { i: 'cal', x: 8, y: 0, w: 4, h: 4, static: false },
];
export default App;
// src/components/pages/DashboardPage.jsx

import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SideMenu from './layout/SideMenu'; 

import HomePage from './HomePage';
import CanvasPage from './CanvasPage';
import Canvaseditor from './Canvaseditor';
import SettingsPage from './SettingsPage';

// 테마 색상 옵션
const THEME_COLORS = [
  { id: 'blue', name: '파란색', primary: '#5480F7', secondary: '#A9CBFF', gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' },
  { id: 'purple', name: '보라색', primary: '#B85AFF', secondary: '#DEB3FF', gradient: 'linear-gradient(135deg,rgb(139, 79, 242) 0%,rgb(193, 127, 255) 100%)' },
  { id: 'pink', name: '핑크색', primary: '#FF98F5', secondary: '#FFD6FB', gradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)' },
  { id: 'red', name: '빨간색', primary: '#7f1d1d', secondary: '#ef4444', gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' },
  { id: 'orange', name: '주황색', primary: '#FD9941', secondary: '#FED1AA', gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' },
  { id: 'yellow', name: '노란색', primary: '#EBDA18', secondary: '#F2EA8B', gradient: 'linear-gradient(135deg,rgb(248, 191, 66) 0%,rgb(245, 216, 128) 100%)' },
  { id: 'lime', name: '라임색', primary: '#315555', secondary: '#72937B', gradient: 'linear-gradient(135deg, #65a30d 0%, #84cc16 100%)' },
  { id: 'gray', name: '회색', primary: '#374151', secondary: '#6b7280', gradient: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)' }
];

const DashboardPage = () => {
  // 테마 초기화 및 이벤트 리스너
  useEffect(() => {
    // 테마 적용 함수
    const applyTheme = (themeId) => {
      const theme = THEME_COLORS.find(t => t.id === themeId);
      if (!theme) return;

      document.documentElement.style.setProperty('--theme-primary', theme.primary);
      document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
      document.documentElement.style.setProperty('--theme-gradient', theme.gradient);
      
      console.log(`테마 적용: ${theme.id}`, theme);
    };

    // 테마 초기화
    const initTheme = () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        const savedTheme = localStorage.getItem(`theme_${currentUser.id}`) || 'blue';
        applyTheme(savedTheme);
        console.log(`사용자 테마 로드: ${savedTheme}`);
      } else {
        applyTheme('blue');
        console.log('기본 테마 적용: blue');
      }
    };

    // 초기 테마 적용
    initTheme();

    // 테마 변경 이벤트 리스너
    const handleThemeChange = () => {
      console.log('테마 변경 이벤트 감지');
      initTheme();
    };

    window.addEventListener('themeChanged', handleThemeChange);
    
    // 클린업
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  return (
    <div className="dashboard-layout" style={{ 
        display: 'flex',
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
    }}>
      
      {/* 1. SideMenu */}
      <SideMenu />
      
      {/* 2. Main Content */}
      <div className="main-content" style={{ 
          marginLeft: '265px',
          width: 'calc(100vw - 265px)',
          height: '100vh',
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
          boxSizing: 'border-box'
      }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/canvas" element={<CanvasPage />} />
          <Route path="/canvas/edit/:canvasId" element={<Canvaseditor />} />
          
          <Route path="/settings" element={<SettingsPage />} />
          
          <Route path="*" element={<HomePage />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default DashboardPage;
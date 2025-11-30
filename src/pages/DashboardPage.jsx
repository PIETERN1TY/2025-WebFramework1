// src/components/pages/DashboardPage.jsx

import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SideMenu from './layout/SideMenu'; 

import HomePage from './HomePage';
import CanvasPage from './CanvasPage';
import Canvaseditor from './Canvaseditor';
import SettingsPage from './SettingsPage';

// 테마 색상 정의
const THEME_COLORS = [
  { id: 'blue', primary: '#1e3a5f', secondary: '#4a90e2', gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' },
  { id: 'purple', primary: '#4a1a5f', secondary: '#8b5cf6', gradient: 'linear-gradient(135deg,rgb(139, 79, 242) 0%,rgb(193, 127, 255) 100%)' },
  { id: 'pink', primary: '#831843', secondary: '#ec4899', gradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)' },
  { id: 'red', primary: '#7f1d1d', secondary: '#ef4444', gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' },
  { id: 'orange', primary: '#7c2d12', secondary: '#f97316', gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' },
  { id: 'yellow', primary: '#854d0e', secondary: '#eab308', gradient: 'linear-gradient(135deg,rgb(248, 191, 66) 0%,rgb(245, 216, 128) 100%)' },
  { id: 'lime', primary: '#3f6212', secondary: '#84cc16', gradient: 'linear-gradient(135deg, #65a30d 0%, #84cc16 100%)' },
  { id: 'gray', primary: '#374151', secondary: '#6b7280', gradient: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)' }
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
      
      console.log(`✅ 테마 적용: ${theme.id}`, theme);
    };

    // 테마 초기화
    const initTheme = () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        const savedTheme = localStorage.getItem(`theme_${currentUser.id}`) || 'blue';
        applyTheme(savedTheme);
        console.log(`🎨 사용자 테마 로드: ${savedTheme}`);
      } else {
        applyTheme('blue');
        console.log('🎨 기본 테마 적용: blue');
      }
    };

    // 초기 테마 적용
    initTheme();

    // 테마 변경 이벤트 리스너
    const handleThemeChange = () => {
      console.log('🔄 테마 변경 이벤트 감지');
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
      
      {/* 1. SideMenu (고정된 왼쪽 메뉴) */}
      <SideMenu />
      
      {/* 2. Main Content (오른쪽 컨텐츠 영역) */}
      <div className="main-content" style={{ 
          marginLeft: '265px',
          width: 'calc(100vw - 265px)',
          height: '100vh',
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
          boxSizing: 'border-box'
      }}>
        <Routes>
          {/* 기본 경로 */}
          <Route path="/" element={<HomePage />} />
          
          {/* Canvas 관련 */}
          <Route path="/canvas" element={<CanvasPage />} />
          <Route path="/canvas/edit/:canvasId" element={<Canvaseditor />} />
          
          {/* Settings */}
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* 기타 경로 - HomePage로 */}
          <Route path="*" element={<HomePage />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default DashboardPage;
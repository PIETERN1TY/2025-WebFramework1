// src/App.jsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import DashboardPage from './components/pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

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

function App() {
  // 테마 초기화
  useEffect(() => {
    const applyTheme = (themeId) => {
      const theme = THEME_COLORS.find(t => t.id === themeId);
      if (!theme) return;

      document.documentElement.style.setProperty('--theme-primary', theme.primary);
      document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
      document.documentElement.style.setProperty('--theme-gradient', theme.gradient);
      
      console.log(`테마 적용: ${theme.id}`);
    };

    const initTheme = () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        const savedTheme = localStorage.getItem(`theme_${currentUser.id}`) || 'blue';
        applyTheme(savedTheme);
      } else {
        applyTheme('blue');
      }
    };

    initTheme();

    const handleThemeChange = () => {
      initTheme();
    };

    window.addEventListener('themeChanged', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* 기본 경로 - 로그인 화면으로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 로그인/회원가입 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* 대시보드 (인증 필요) */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />

        {/* 알 수 없는 경로 - 로그인으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
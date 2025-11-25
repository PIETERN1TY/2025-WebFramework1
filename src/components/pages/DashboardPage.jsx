// src/components/pages/DashboardPage.jsx

import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SideMenu from './layout/SideMenu'; 

import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import HomePage from './HomePage';
import CanvasPage from './CanvasPage';
import CanvasEditor from './CanvasEditor';
import SettingsPage from './SettingsPage';

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 체크
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    const publicPaths = ['/login', '/signup'];
    
    // 로그인되지 않았고, 공개 페이지가 아니면 로그인 페이지로
    if (!currentUser && !publicPaths.includes(location.pathname)) {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  const currentUser = localStorage.getItem('currentUser');
  const isPublicPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="dashboard-layout" style={{ 
        display: 'flex',
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
    }}>
      
      {/* 로그인/회원가입 페이지가 아닐 때만 SideMenu 표시 */}
      {currentUser && !isPublicPage && <SideMenu />}
      
      {/* Main Content */}
      <div className="main-content" style={{ 
          marginLeft: (currentUser && !isPublicPage) ? '265px' : '0',
          width: (currentUser && !isPublicPage) ? 'calc(100vw - 265px)' : '100vw',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
          boxSizing: 'border-box'
      }}>
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* 보호된 라우트 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/canvas" element={<CanvasPage />} />
          <Route path="/canvas/edit/:canvasId" element={<CanvasEditor />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<HomePage />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default DashboardPage;
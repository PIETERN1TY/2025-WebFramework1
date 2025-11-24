// src/components/pages/DashboardPage.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideMenu from './layout/SideMenu'; 

import HomePage from './HomePage';
import WidgetPage from './WidgetPage';
import CanvasPage from './CanvasPage';
import CanvasEditor from './CanvasEditor';  // 🎯 CanvasEditor import 추가!
import SettingsPage from './SettingsPage';

const DashboardPage = () => {
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
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
          boxSizing: 'border-box'
      }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/widget" element={<WidgetPage />} />
          <Route path="/canvas" element={<CanvasPage />} />
          <Route path="/canvas/edit/:canvasId" element={<CanvasEditor />} />  {/* 🎯 CanvasEditor 라우트 추가! */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<HomePage />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default DashboardPage;
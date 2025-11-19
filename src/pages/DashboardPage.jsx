// src/components/pages/DashboardPage.jsx (전체 코드)

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideMenu from './layout/SideMenu'; 

// 세부 페이지 컴포넌트들을 임시로 추가합니다. (다음 섹션에서 생성할 예정)
import HomePage from './HomePage';
import WidgetPage from './WidgetPage';
import CanvasPage from './CanvasPage';
import SettingsPage from './SettingsPage';

const DashboardPage = () => {
  return (
    <div className="dashboard-layout" style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        backgroundColor: '#4682b4' 
    }}>
      
      {/* 1. SideMenu (고정된 왼쪽 메뉴) */}
      <SideMenu />
      
      {/* 2. Main Content (오른쪽 위젯 영역 - URL에 따라 내용 변경) */}
      <div className="main-content" style={{ 
          flexGrow: 1, 
          padding: '20px', 
          backgroundColor: '#f5f5f5', 
          color: '#333' 
      }}>
        <Routes>
          {/* 메뉴 클릭 시 이동할 경로들을 정의합니다. */}
          <Route path="/" element={<HomePage />} />
          <Route path="/widget" element={<WidgetPage />} />
          <Route path="/canvas" element={<CanvasPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* 일치하는 경로가 없을 경우 홈 페이지로 리디렉션하거나 404를 표시할 수 있습니다. */}
          <Route path="*" element={<HomePage />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default DashboardPage;
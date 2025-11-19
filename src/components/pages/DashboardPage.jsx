import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideMenu from "./layout/SideMenu"; 

// 세부 페이지 컴포넌트들을 가져옵니다.
import HomePage from "./HomePage.jsx";       // <-- 이 줄은 반드시 하나만 있어야 합니다.
import WidgetPage from "./WidgetPage.jsx";
import CanvasPage from "./CanvasPage.jsx";
import SettingsPage from "./SettingsPage.jsx";

const DashboardPage = () => {
  return (
    <div className="dashboard-layout" style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        backgroundColor: '#4682b4' 
    }}>
      
      {/* 1. SideMenu (고정된 왼쪽 메뉴) */}
      <SideMenu />
      
      {/* 2. Main Content (오른쪽 영역 - 오직 라우팅된 내용만 표시) */}
      <div className="main-content" style={{ 
          flexGrow: 1, 
          padding: '20px', 
          backgroundColor: '#f5f5f5', 
          color: '#333' 
      }}>
        {/* 이 영역 안에 있는 내용만 URL에 따라 바뀌도록 Routes만 남깁니다. */}
        <Routes>
          {/* 메뉴 클릭 시 이동할 경로들을 정의합니다. */}
          <Route path="/" element={<HomePage />} />
          <Route path="/widget" element={<WidgetPage />} />
          <Route path="/canvas" element={<CanvasPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* 일치하는 경로가 없을 경우를 대비 */}
          <Route path="*" element={<HomePage />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default DashboardPage;
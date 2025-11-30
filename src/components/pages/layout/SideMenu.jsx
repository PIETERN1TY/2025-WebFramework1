// src/components/pages/layout/SideMenu.jsx

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaThLarge, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './SideMenu.css';

const SideMenu = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // 사용자 정보 로드
  useEffect(() => {
    const loadUser = () => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        setCurrentUser(user);
        console.log('👤 사용자 로드:', user.nickname);
      }
    };

    loadUser();

    // userUpdated 이벤트 리스너
    const handleUserUpdate = () => {
      console.log('🔄 사용자 정보 업데이트');
      loadUser();
    };

    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  // 로그아웃
  const handleLogout = () => {
    const confirmed = window.confirm('로그아웃하시겠습니까?');
    if (confirmed) {
      // localStorage 완전히 삭제
      localStorage.removeItem('currentUser');
      
      // 상태 초기화
      setCurrentUser(null);
      
      console.log('👋 로그아웃 완료');
      
      // 로그인 페이지로 이동 (replace로 히스토리 대체)
      navigate('/login', { replace: true });
      
      // 페이지 새로고침하여 완전히 초기화
      window.location.href = '/login';
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="sidebar-container">
      {/* 프로필 섹션 */}
      <div className="profile-section">
        <div className="profile-image-wrapper">
          <img 
            src={currentUser.profileImage || 'src/assets/images/toro.jpg'} 
            alt="프로필" 
            className="profile-image" 
          />
        </div>
        <div className="user-name">{currentUser.nickname}</div>
        <div className="user-email">{currentUser.email}</div>
      </div>

      {/* 메뉴 섹션 */}
      <div className="menu-section">
        <NavLink 
          to="/dashboard" 
          end
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <FaHome className="menu-icon" />
          <span>HOME</span>
        </NavLink>

        <NavLink 
          to="/dashboard/canvas"
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <FaThLarge className="menu-icon" />
          <span>CANVAS</span>
        </NavLink>

        <NavLink 
          to="/dashboard/settings"
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <FaCog className="menu-icon" />
          <span>SETTINGS</span>
        </NavLink>
      </div>

      {/* 로그아웃 섹션 */}
      <div className="logout-section">
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="menu-icon" />
          <span>LOGOUT</span>
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
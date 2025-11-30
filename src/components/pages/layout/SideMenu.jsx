// src/components/pages/layout/SideMenu.jsx

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaThLarge, FaCog, FaSignOutAlt } from 'react-icons/fa';

const SideMenu = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // 테마 적용 함수
  const applyUserTheme = (userId) => {
    const savedTheme = localStorage.getItem(`theme_${userId}`) || 'blue';
    
    // 테마 색상 정의
    const THEME_COLORS = {
      blue: { primary: '#1e3a5f', secondary: '#4a90e2', gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' },
      purple: { primary: '#4a1a5f', secondary: '#8b5cf6', gradient: 'linear-gradient(135deg,rgb(139, 79, 242) 0%,rgb(193, 127, 255) 100%)' },
      pink: { primary: '#831843', secondary: '#ec4899', gradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)' },
      red: { primary: '#7f1d1d', secondary: '#ef4444', gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' },
      orange: { primary: '#7c2d12', secondary: '#f97316', gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' },
      yellow: { primary: '#854d0e', secondary: '#eab308', gradient: 'linear-gradient(135deg,rgb(248, 191, 66) 0%,rgb(245, 216, 128) 100%)' },
      lime: { primary: '#3f6212', secondary: '#84cc16', gradient: 'linear-gradient(135deg, #65a30d 0%, #84cc16 100%)' },
      gray: { primary: '#374151', secondary: '#6b7280', gradient: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)' }
    };

    const theme = THEME_COLORS[savedTheme];
    if (theme) {
      document.documentElement.style.setProperty('--theme-primary', theme.primary);
      document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
      document.documentElement.style.setProperty('--theme-gradient', theme.gradient);
      console.log('🎨 테마 적용:', savedTheme);
    }
  };

  // 사용자 정보 로드
  useEffect(() => {
    const loadUser = () => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        setCurrentUser(user);
        applyUserTheme(user.id); // ✅ 테마 자동 적용
        console.log('👤 사용자 로드:', user.nickname);
      }
    };

    loadUser();

    // userUpdated 이벤트 리스너
    const handleUserUpdate = () => {
      console.log('🔄 사용자 정보 업데이트');
      loadUser();
    };

    // themeChanged 이벤트 리스너
    const handleThemeChange = () => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        applyUserTheme(user.id);
      }
    };

    window.addEventListener('userUpdated', handleUserUpdate);
    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('themeChanged', handleThemeChange);
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
    // .sidebar-container
    <div 
      className="w-[265px] h-screen text-white flex flex-col p-0 box-border flex-shrink-0 fixed left-0 top-0 overflow-y-auto overflow-x-hidden transition-colors duration-300"
      style={{
        backgroundColor: 'var(--theme-primary, #2f4f4f)'
      }}
    >
      {/* .profile-section */}
      <div className="flex flex-col items-center px-4 pt-8 pb-5 text-center flex-shrink-0">
        {/* .profile-image-wrapper */}
        <div 
          className="w-[150px] h-[150px] rounded-full overflow-hidden mb-5 transition-all duration-300"
          style={{
            border: '3px solid var(--theme-secondary, #6b8e23)'
          }}
        >
          {/* .profile-image */}
          <img 
            src={currentUser.profileImage || 'src/assets/images/toro.jpg'} 
            alt="프로필" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* .user-name */}
        <div className="text-2xl font-bold mb-1.5">
          {currentUser.nickname}
        </div>
        
        {/* .user-email */}
        <div className="text-base text-gray-300">
          {currentUser.email}
        </div>
      </div>

      {/* .menu-section */}
      <div className="w-full flex flex-col py-2.5 flex-1">
        <NavLink 
          to="/dashboard" 
          end
          className={({ isActive }) => 
            `flex items-center px-5 py-6 cursor-pointer transition-colors duration-200 text-xl text-white no-underline outline-none border-none hover:bg-white/10 ${
              isActive 
                ? 'font-bold transition-colors duration-300' 
                : ''
            }`
          }
          style={({ isActive }) => 
            isActive 
              ? { backgroundColor: 'var(--theme-secondary, #6b8e23)' } 
              : {}
          }
        >
          {/* .menu-icon */}
          <FaHome className="mr-4 text-2xl min-w-[1.5em]" />
          <span>HOME</span>
        </NavLink>

        <NavLink 
          to="/dashboard/canvas"
          className={({ isActive }) => 
            `flex items-center px-5 py-6 cursor-pointer transition-colors duration-200 text-xl text-white no-underline outline-none border-none hover:bg-white/10 ${
              isActive 
                ? 'font-bold transition-colors duration-300' 
                : ''
            }`
          }
          style={({ isActive }) => 
            isActive 
              ? { backgroundColor: 'var(--theme-secondary, #6b8e23)' } 
              : {}
          }
        >
          <FaThLarge className="mr-4 text-2xl min-w-[1.5em]" />
          <span>CANVAS</span>
        </NavLink>

        <NavLink 
          to="/dashboard/settings"
          className={({ isActive }) => 
            `flex items-center px-5 py-6 cursor-pointer transition-colors duration-200 text-xl text-white no-underline outline-none border-none hover:bg-white/10 ${
              isActive 
                ? 'font-bold transition-colors duration-300' 
                : ''
            }`
          }
          style={({ isActive }) => 
            isActive 
              ? { backgroundColor: 'var(--theme-secondary, #6b8e23)' } 
              : {}
          }
        >
          <FaCog className="mr-4 text-2xl min-w-[1.5em]" />
          <span>SETTINGS</span>
        </NavLink>
      </div>

      {/* .logout-section */}
      <div className="w-full p-5 border-t border-white/20 flex-shrink-0">
        {/* .logout-button */}
        <button 
          className="w-full flex items-center px-5 py-4 bg-[#db1025] hover:bg-[#ee2f42] text-white border-none rounded-lg cursor-pointer text-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(220,53,69,0.4)] active:translate-y-0"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-4 text-2xl" />
          <span>LOGOUT</span>
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
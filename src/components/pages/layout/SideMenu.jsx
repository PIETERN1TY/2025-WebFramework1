// src/components/pages/layout/SideMenu.jsx

import React from 'react';
import { FaHome, FaTh, FaPalette, FaCog } from 'react-icons/fa'; 
import { Link, useLocation } from 'react-router-dom';
import './SideMenu.css'; 

// 메뉴 항목 데이터 정의
const menuItems = [
    // path는 DashboardPage.jsx에 정의된 Route의 path와 일치해야 합니다.
    { name: 'HOME', path: '/', icon: FaHome },
    { name: 'WIDGET', path: '/widget', icon: FaTh },
    { name: 'CANVAS', path: '/canvas', icon: FaPalette },
    // SETTINGS는 isBottom: true를 추가하여 CSS에서 맨 아래 정렬되도록 지정
    { name: 'SETTINGS', path: '/settings', icon: FaCog, isBottom: true }, 
];

const SideMenu = () => {
    // 현재 URL 경로를 가져와서 활성화된 메뉴를 표시합니다.
    const location = useLocation();

    return (
        <div className="sidebar-container">
            {/* 사용자 프로필 섹션 */}
            <div className="profile-section">
                {/* 이미지는 실제 경로 또는 URL로 대체해야 합니다. */}
                <div className="profile-image-wrapper">
                    <img 
                        src='src/assets/images/toro.jpg' // 임시 이미지 URL
                        alt="User Profile" 
                        className="profile-image" 
                    />
                </div>
                <div className="user-name">NAME</div>
                <div className="user-email">abcdefg@hansung.ac.kr</div>
            </div>

            {/* 메뉴 항목 섹션 */}
            <nav className="menu-section">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    // 현재 경로가 메뉴 항목의 path와 일치하면 활성화
                    const isActive = location.pathname === item.path; 

                    return (
                        // Link 컴포넌트를 사용하여 페이지 전환
                        <Link 
                            key={item.name} 
                            to={item.path} 
                            // 활성화된 클래스('active') 및 하단 정렬 클래스('bottom-aligned-item') 적용
                            className={`menu-item ${isActive ? 'active' : ''} ${item.isBottom ? 'bottom-aligned-item' : ''}`}
                        >
                            <Icon className="menu-icon" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default SideMenu;
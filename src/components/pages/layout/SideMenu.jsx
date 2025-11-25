// src/components/pages/layout/SideMenu.jsx

import React, { useState, useEffect } from 'react';
import { FaHome, FaPalette, FaCog, FaSignOutAlt } from 'react-icons/fa'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SideMenu.css'; 

// 메뉴 항목 데이터 정의
const menuItems = [
    { name: 'HOME', path: '/', icon: FaHome },
    { name: 'CANVAS', path: '/canvas', icon: FaPalette },
    { name: 'SETTINGS', path: '/settings', icon: FaCog },
];

const SideMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    // 사용자 정보 로드
    useEffect(() => {
        const loadUser = () => {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            setCurrentUser(user);
        };

        loadUser();

        // 사용자 정보 업데이트 감지
        const handleUserUpdate = () => {
            loadUser();
        };

        window.addEventListener('userUpdated', handleUserUpdate);
        return () => window.removeEventListener('userUpdated', handleUserUpdate);
    }, []);

    // 로그아웃 핸들러
    const handleLogout = () => {
        const confirmed = window.confirm('로그아웃하시겠습니까?');
        if (confirmed) {
            localStorage.removeItem('currentUser');
            navigate('/login');
        }
    };

    // 사용자 정보가 없으면 기본값 표시
    const displayName = currentUser?.nickname || 'NAME';
    const displayEmail = currentUser?.email || 'abcdefg@hansung.ac.kr';
    const displayImage = currentUser?.profileImage || 'src/assets/images/toro.jpg';

    return (
        <div className="sidebar-container">
            {/* 사용자 프로필 섹션 */}
            <div className="profile-section">
                <div className="profile-image-wrapper">
                    <img 
                        src={displayImage}
                        alt="User Profile" 
                        className="profile-image" 
                    />
                </div>
                <div className="user-name">{displayName}</div>
                <div className="user-email">{displayEmail}</div>
            </div>

            {/* 메뉴 항목 섹션 */}
            <nav className="menu-section">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path; 

                    return (
                        <Link 
                            key={item.name} 
                            to={item.path} 
                            className={`menu-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon className="menu-icon" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* 로그아웃 버튼 */}
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
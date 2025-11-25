// src/components/pages/SettingsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    profileImage: null
  });
  const [profilePreview, setProfilePreview] = useState(null);

  // 현재 사용자 정보 로드
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      navigate('/login');
      return;
    }
    
    setCurrentUser(user);
    setFormData({
      nickname: user.nickname,
      email: user.email,
      profileImage: user.profileImage
    });
    setProfilePreview(user.profileImage);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.nickname.trim() || !formData.email.trim()) {
      alert('닉네임과 이메일은 필수 항목입니다.');
      return;
    }

    // 사용자 정보 업데이트
    const updatedUser = {
      ...currentUser,
      nickname: formData.nickname,
      email: formData.email,
      profileImage: formData.profileImage
    };

    // localStorage 업데이트
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[currentUser.id] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // 상태 업데이트
    setCurrentUser(updatedUser);

    // SideMenu 업데이트를 위한 이벤트 발생
    window.dispatchEvent(new Event('userUpdated'));

    alert('프로필이 업데이트되었습니다!');
  };

  const handleLogout = () => {
    const confirmed = window.confirm('로그아웃하시겠습니까?');
    if (confirmed) {
      localStorage.removeItem('currentUser');
      navigate('/login');
    }
  };

  if (!currentUser) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="settings-container">
      {/* 최상단 타이틀 */}
      <div className="settings-header">
        <h1 className="settings-title">프로필 설정</h1>
        <button className="logout-button" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
      <hr className="settings-divider" />

      {/* 메인 설정 내용 */}
      <div className="settings-content-wrapper">
        {/* 왼쪽 설정 영역 */}
        <div className="settings-left-panel">
          {/* 닉네임 설정 */}
          <div className="setting-group">
            <label htmlFor="nickname" className="setting-label">닉네임</label>
            <input 
              type="text" 
              id="nickname"
              name="nickname"
              className="setting-input" 
              placeholder="닉네임을 입력하세요" 
              value={formData.nickname}
              onChange={handleInputChange}
            />
          </div>

          {/* 이메일 설정 */}
          <div className="setting-group">
            <label htmlFor="email" className="setting-label">이메일</label>
            <input 
              type="email" 
              id="email"
              name="email"
              className="setting-input" 
              placeholder="email@example.com" 
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {/* 저장 버튼 */}
          <button className="save-button" onClick={handleSave}>
            💾 변경사항 저장
          </button>
          
        </div>

        {/* 오른쪽 프로필 사진 영역 */}
        <div className="settings-right-panel">
          <p className="profile-image-label">프로필 사진</p>
          <div className="profile-image-display-wrapper">
            <img 
              src={profilePreview || 'src/assets/images/toro.jpg'}
              alt="프로필 사진" 
              className="profile-image-display" 
            />
          </div>
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input-hidden"
          />
          <label htmlFor="profileImageInput" className="change-image-button">
            📷 사진 변경
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
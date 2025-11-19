// src/components/pages/SettingsPage.jsx

import React from 'react';
import './SettingsPage.css'; // 별도의 CSS 파일로 스타일링 관리

const SettingsPage = () => {
  return (
    <div className="settings-container">
      {/* 최상단 타이틀 */}
      <h1 className="settings-title">위젯 프로필 설정</h1>
      <hr className="settings-divider" /> {/* 구분선 */}

      {/* 메인 설정 내용 (왼쪽 영역과 오른쪽 영역으로 나눔) */}
      <div className="settings-content-wrapper">
        {/* 왼쪽 설정 영역 */}
        <div className="settings-left-panel">
          {/* 닉네임 설정 */}
          <div className="setting-group">
            <label htmlFor="nickname" className="setting-label">닉네임</label>
            <input 
              type="text" 
              id="nickname" 
              className="setting-input" 
              placeholder="NAME" 
              value="NAME" // Figma 이미지에 맞춰 기본값 설정
            />
          </div>

          {/* 이메일 설정 */}
          <div className="setting-group">
            <label htmlFor="email" className="setting-label">이메일</label>
            <div className="email-input-group">
              <input 
                type="text" 
                id="email-id" 
                className="setting-input email-part" 
                placeholder="abcdefg" 
                value="abcdefg" // Figma 이미지에 맞춰 기본값 설정
              />
              <span className="email-separator">@</span>
              <input 
                type="text" 
                id="email-domain" 
                className="setting-input email-part" 
                placeholder="hansung.ac.kr" 
                value="hansung.ac.kr" // Figma 이미지에 맞춰 기본값 설정
              />
            </div>
          </div>

          {/* 위젯 색 설정 */}
          <div className="setting-group">
            <label className="setting-label">위젯 색 설정</label>
            <div className="color-palette">
              <div className="color-option dark-green active"></div> {/* 선택된 색상 */}
              <div className="color-option light-green"></div>
              <div className="color-option white-border"></div>
            </div>
          </div>
          
          {/* 하단 회색 박스 (Figma 이미지에는 내용 없음) */}
          <div className="bottom-grey-box"></div>
          
        </div>

        {/* 오른쪽 프로필 사진 영역 */}
        <div className="settings-right-panel">
          <p className="profile-image-label">프로필 사진</p>
          <div className="profile-image-display-wrapper">
            <img 
              src="src/assets/images/toro.jpg" // 사용자 프로필 이미지 URL (예시)
              alt="프로필 사진" 
              className="profile-image-display" 
            />
          </div>
          {/* 실제로는 파일 업로드 버튼 등이 여기에 들어갈 수 있습니다 */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
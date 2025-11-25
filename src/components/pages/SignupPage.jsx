// src/components/pages/SignupPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    profileImage: null
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [error, setError] = useState('');

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
      // 이미지 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result // Base64로 저장
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (!formData.nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    if (!formData.email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }
    if (!formData.profileImage) {
      setError('프로필 사진을 업로드해주세요.');
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // 기존 사용자 확인
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const existingUser = Object.values(users).find(u => u.email === formData.email);

    if (existingUser) {
      setError('이미 등록된 이메일입니다.');
      return;
    }

    // 새 사용자 생성
    const userId = Date.now().toString();
    const newUser = {
      id: userId,
      nickname: formData.nickname,
      email: formData.email,
      profileImage: formData.profileImage,
      createdAt: new Date().toISOString()
    };

    // 사용자 저장
    users[userId] = newUser;
    localStorage.setItem('users', JSON.stringify(users));

    // 자동 로그인
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alert('회원가입이 완료되었습니다!');
    navigate('/');
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">🎨 회원가입</h1>
        <p className="signup-subtitle">나만의 대시보드를 만들어보세요</p>

        <form onSubmit={handleSignup} className="signup-form">
          {/* 프로필 이미지 */}
          <div className="form-group profile-image-group">
            <label>프로필 사진 *</label>
            <div className="profile-upload-area">
              <div className="profile-preview">
                {profilePreview ? (
                  <img src={profilePreview} alt="프로필 미리보기" />
                ) : (
                  <div className="profile-placeholder">
                    <span>📷</span>
                    <p>이미지를 업로드하세요</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="profileImage" className="file-input-label">
                이미지 선택
              </label>
            </div>
          </div>

          {/* 닉네임 */}
          <div className="form-group">
            <label htmlFor="nickname">닉네임 *</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              className="form-input"
              placeholder="닉네임을 입력하세요"
              value={formData.nickname}
              onChange={handleInputChange}
            />
          </div>

          {/* 이메일 */}
          <div className="form-group">
            <label htmlFor="email">이메일 *</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="abcdefg@hansung.ac.kr"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="signup-button">
            회원가입
          </button>
        </form>

        <div className="signup-footer">
          <p>이미 계정이 있으신가요?</p>
          <button 
            className="login-link"
            onClick={() => navigate('/login')}
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
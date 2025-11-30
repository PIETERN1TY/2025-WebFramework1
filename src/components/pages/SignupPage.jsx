// src/components/pages/SignupPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null
  });

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
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.nickname || !formData.email || !formData.password) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    // 이메일 중복 확인
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const emailExists = Object.values(users).some(u => u.email === formData.email);

    if (emailExists) {
      alert('이미 사용 중인 이메일입니다.');
      return;
    }

    // 새 사용자 생성
    const newUser = {
      id: Date.now().toString(),
      nickname: formData.nickname,
      email: formData.email,
      password: formData.password,
      profileImage: formData.profileImage || null,
      createdAt: new Date().toISOString()
    };

    // localStorage에 저장
    users[newUser.id] = newUser;
    localStorage.setItem('users', JSON.stringify(users));

    console.log('✅ 회원가입 성공:', newUser.nickname);
    alert('회원가입이 완료되었습니다!');

    // 로그인 페이지로 이동
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">회원가입</h1>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="nickname">닉네임 *</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder="닉네임을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일 *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호 *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="최소 6자 이상"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인 *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profileImage">프로필 사진 (선택)</label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <button type="submit" className="signup-button">
            회원가입
          </button>
        </form>

        <div className="signup-footer">
          <p>
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
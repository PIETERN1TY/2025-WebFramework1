// src/components/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // 이미 로그인되어 있으면 대시보드로 이동
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        if (user && user.id) {
          console.log('✅ 이미 로그인됨 - 대시보드로 이동');
          navigate('/dashboard');
        }
      } catch (error) {
        // 손상된 데이터는 삭제
        localStorage.removeItem('currentUser');
      }
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    // localStorage에서 사용자 정보 가져오기
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    // 이메일로 사용자 찾기
    const user = Object.values(users).find(u => u.email === formData.email);

    if (!user) {
      alert('존재하지 않는 이메일입니다.');
      return;
    }

    // 비밀번호가 설정되지 않은 기존 사용자 처리
    if (!user.password) {
      console.log('⚠️ 비밀번호가 없는 기존 사용자 - 자동 로그인');
      localStorage.setItem('currentUser', JSON.stringify(user));
      alert('비밀번호가 설정되지 않은 계정입니다.\n설정 페이지에서 비밀번호를 설정해주세요.');
      navigate('/dashboard');
      return;
    }

    // 비밀번호 확인
    if (!formData.password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (user.password !== formData.password) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 로그인 성공
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('✅ 로그인 성공:', user.nickname);
    
    // 대시보드로 이동
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">로그인</h1>
          <p className="login-subtitle">대시보드에 오신 것을 환영합니다</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">이메일</label>
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
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="비밀번호 (선택)"
              />
              <p className="password-hint">
                * 기존 사용자는 비밀번호 없이 로그인 가능합니다
              </p>
            </div>

            <button type="submit" className="login-button">
              로그인
            </button>
          </form>

          <div className="login-footer">
            <p>
              계정이 없으신가요? <Link to="/signup">회원가입</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
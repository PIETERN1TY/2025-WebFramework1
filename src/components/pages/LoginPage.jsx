// src/components/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    // localStorage에서 모든 사용자 찾기
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    // 이메일로 사용자 찾기
    const user = Object.values(users).find(u => u.email === email);

    if (user) {
      // 로그인 성공
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/');
    } else {
      setError('등록되지 않은 이메일입니다. 회원가입을 진행해주세요.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">🧩 개인 맞춤형 대시보드</h1>
        <p className="login-subtitle">로그인하여 나만의 위젯 공간을 만들어보세요</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="abcdefg@hansung.ac.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        <div className="login-footer">
          <p>계정이 없으신가요?</p>
          <button 
            className="signup-link"
            onClick={() => navigate('/signup')}
          >
            회원가입하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
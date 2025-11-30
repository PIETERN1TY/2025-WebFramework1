// src/components/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
          console.log('이미 로그인됨 - 대시보드로 이동');
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
      console.log('비밀번호가 없는 기존 사용자 - 자동 로그인');
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
    console.log('로그인 성공:', user.nickname);
    
    // 대시보드로 이동
    navigate('/dashboard');
  };

  return (
    <div 
        className="min-h-screen flex items-center justify-center p-5"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
        <div className="w-full max-w-[450px]">
            <div 
                className="bg-white p-10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] animate-slideUp max-sm:px-6 max-sm:py-[30px]"
            >
                <h1 className="text-[2em] font-bold text-[#333] text-center mb-2 max-sm:text-[1.6em]">
                    로그인
                </h1>
                <p className="text-[#666] text-center text-[0.95em] mb-[30px]">
                    MY BOARD에 오신 것을 환영합니다
                </p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-[0.9em] font-semibold text-[#444] mb-2">
                            이메일
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="email@example.com"
                            required
                            className="text-[1em] transition-all duration-300 px-4 py-3 rounded-lg border-2 border-solid border-[#e0e0e0] focus:shadow-[0_0_0_4px_rgba(102,126,234,0.1)] focus:border-[#667eea] outline-none placeholder:text-[#aaa]"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-[0.9em] font-semibold text-[#444] mb-2">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="비밀번호를 입력하세요"
                            className="text-[1em] transition-all duration-300 px-4 py-3 rounded-lg border-2 border-solid border-[#e0e0e0] focus:shadow-[0_0_0_4px_rgba(102,126,234,0.1)] focus:border-[#667eea] outline-none placeholder:text-[#aaa]"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="text-white text-[1em] font-semibold cursor-pointer transition-all duration-300 mt-2.5 p-3.5 rounded-lg border-none hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_8px_20px_rgba(102,126,234,0.4)]"
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                        로그인
                    </button>
                </form>

                <div className="text-center mt-6 pt-5 border-t border-t-solid border-t-[#e0e0e0]">
                    <p className="text-[#666] text-[0.9em] m-0">
                        계정이 없으신가요?&nbsp;&nbsp;
                        <Link 
                            to="/signup" 
                            className="text-[#667eea] no-underline font-semibold transition-colors duration-300 hover:text-[#764ba2] hover:underline"
                        >
                          회원가입
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;
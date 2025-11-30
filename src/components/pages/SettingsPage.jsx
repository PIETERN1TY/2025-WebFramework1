// src/components/pages/SettingsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 테마 색상 옵션
const THEME_COLORS = [
  { id: 'blue', name: '파란색', primary: '#1e3a5f', secondary: '#4a90e2', gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' },
  { id: 'purple', name: '보라색', primary: '#4a1a5f', secondary: '#8b5cf6', gradient: 'linear-gradient(135deg,rgb(139, 79, 242) 0%,rgb(193, 127, 255) 100%)' },
  { id: 'pink', name: '핑크색', primary: '#831843', secondary: '#ec4899', gradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)' },
  { id: 'red', name: '빨간색', primary: '#7f1d1d', secondary: '#ef4444', gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' },
  { id: 'orange', name: '주황색', primary: '#7c2d12', secondary: '#f97316', gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' },
  { id: 'yellow', name: '노란색', primary: '#854d0e', secondary: '#eab308', gradient: 'linear-gradient(135deg,rgb(248, 191, 66) 0%,rgb(245, 216, 128) 100%)' },
  { id: 'lime', name: '라임색', primary: '#3f6212', secondary: '#84cc16', gradient: 'linear-gradient(135deg, #65a30d 0%, #84cc16 100%)' },
  { id: 'gray', name: '회색', primary: '#374151', secondary: '#6b7280', gradient: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)' }
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('blue');

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
      password: '',
      confirmPassword: '',
      profileImage: user.profileImage
    });
    setProfilePreview(user.profileImage);
    
    // 저장된 테마 불러오기
    const savedTheme = localStorage.getItem(`theme_${user.id}`) || 'blue';
    setSelectedTheme(savedTheme);
    applyTheme(savedTheme);
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

  // 테마 적용 함수
  const applyTheme = (themeId) => {
    const theme = THEME_COLORS.find(t => t.id === themeId);
    if (!theme) return;

    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
    document.documentElement.style.setProperty('--theme-gradient', theme.gradient);
  };

  // 테마 변경 핸들러
  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    applyTheme(themeId);
  };

  const handleSave = () => {
    if (!formData.nickname.trim() || !formData.email.trim()) {
      alert('닉네임과 이메일은 필수 항목입니다.');
      return;
    }

    // 비밀번호 변경 시 확인
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      if (formData.password.length < 6) {
        alert('비밀번호는 최소 6자 이상이어야 합니다.');
        return;
      }
    }

    // 사용자 정보 업데이트
    const updatedUser = {
      ...currentUser,
      nickname: formData.nickname,
      email: formData.email,
      profileImage: formData.profileImage
    };

    // 비밀번호가 입력되었으면 업데이트
    if (formData.password) {
      updatedUser.password = formData.password;
    }

    // localStorage 업데이트
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[currentUser.id] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // 테마 저장
    localStorage.setItem(`theme_${currentUser.id}`, selectedTheme);

    // 상태 업데이트
    setCurrentUser(updatedUser);

    // 비밀번호 입력 필드 초기화
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: ''
    }));

    // 이벤트 발생
    window.dispatchEvent(new Event('userUpdated'));
    window.dispatchEvent(new Event('themeChanged'));

    alert('설정이 저장되었습니다!');
  };

  const handleLogout = () => {
    const confirmed = window.confirm('로그아웃하시겠습니까?');
    if (confirmed) {
      localStorage.removeItem('currentUser');
      navigate('/login');
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center p-10">로딩 중...</div>
    );
  }

  const hasPassword = !!currentUser.password;

  return (
    <div className="p-8 max-w-[1200px] mx-auto text-gray-800 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-[1.8em] font-normal mb-2.5 pb-1.5">설정</h1>
      </div>
      
      <hr className="border-none border-t border-gray-300 mb-8" />

      <div className="flex justify-between gap-12 md:flex-row flex-col">
        
        <div className="flex-[3] flex flex-col">
          
          {/* 닉네임 설정 */}
          <div className="mb-8">
            <label htmlFor="nickname" className="block text-sm text-gray-600 mb-2.5 font-bold">
              닉네임
            </label>
            <input 
              type="text" 
              id="nickname"
              name="nickname"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base box-border focus:outline-none focus:border-[var(--theme-secondary,#4a90e2)] focus:shadow-[0_0_0_3px_rgba(74,144,226,0.1)]"
              placeholder="닉네임을 입력하세요" 
              value={formData.nickname}
              onChange={handleInputChange}
            />
          </div>

          {/* 이메일 설정 */}
          <div className="mb-8">
            <label htmlFor="email" className="block text-sm text-gray-600 mb-2.5 font-bold">
              이메일
            </label>
            <input 
              type="email" 
              id="email"
              name="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base box-border focus:outline-none focus:border-[var(--theme-secondary,#4a90e2)] focus:shadow-[0_0_0_3px_rgba(74,144,226,0.1)]"
              placeholder="email@example.com" 
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {/* 비밀번호 설정 */}
          <div className="mb-8">
            <label htmlFor="password" className="block text-sm text-gray-600 mb-2.5 font-bold">
              {hasPassword ? '새 비밀번호' : '비밀번호 설정'} (선택)
            </label>
            <input 
              type="password" 
              id="password"
              name="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base box-border focus:outline-none focus:border-[var(--theme-secondary,#4a90e2)] focus:shadow-[0_0_0_3px_rgba(74,144,226,0.1)]"
              placeholder={hasPassword ? "새 비밀번호 (최소 6자)" : "비밀번호 설정 (최소 6자)"}
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {/* 비밀번호 확인 */}
          {(formData.password || formData.confirmPassword) && (
            <div className="mb-8">
              <label htmlFor="confirmPassword" className="block text-sm text-gray-600 mb-2.5 font-bold">
                비밀번호 확인
              </label>
              <input 
                type="password" 
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base box-border focus:outline-none focus:border-[var(--theme-secondary,#4a90e2)] focus:shadow-[0_0_0_3px_rgba(74,144,226,0.1)]"
                placeholder="비밀번호를 다시 입력하세요" 
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          )}

          {/* 테마 색상 선택 */}
          <div className="mb-8">
            <label className="block text-sm text-gray-600 mb-2.5 font-bold">
              테마 색상
            </label>
            <div className="flex gap-3 mt-2.5 flex-wrap">
              {THEME_COLORS.map(theme => (
                <div
                  key={theme.id}
                  className={`w-11 h-11 rounded-full cursor-pointer border-4 border-transparent transition-all duration-200 relative hover:scale-110 hover:shadow-lg ${
                    selectedTheme === theme.id 
                      ? 'border-gray-800 shadow-[0_0_0_4px_rgba(51,51,51,0.2)] scale-[1.15]' 
                      : ''
                  }`}
                  style={{ background: theme.gradient }}
                  onClick={() => handleThemeChange(theme.id)}
                  title={theme.name}
                >
                  {selectedTheme === theme.id && (
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 저장 버튼 */}
          <button 
            className="px-6 py-3 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-5 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
            style={{
              background: 'var(--theme-gradient, linear-gradient(135deg, #2563eb 0%, #3b82f6 100%))'
            }}
            onClick={handleSave}
          >
            변경사항 저장
          </button>
        </div>

        <div className="flex-[2] flex flex-col items-center justify-start">
          <p className="text-sm text-gray-600 mb-4 font-bold text-center">
            프로필 사진
          </p>
          
          <div className="w-[200px] h-[200px] rounded-full overflow-hidden shadow-lg transition-all duration-300 mb-5 hover:scale-105 hover:shadow-xl"
            style={{
              border: '4px solid var(--theme-secondary, #4a90e2)'
            }}
          >
            <img 
              src={profilePreview || 'src/assets/images/toro.jpg'}
              alt="프로필 사진" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          
          <label 
            htmlFor="profileImageInput" 
            className="px-8 py-3 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 inline-block hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
            style={{
              background: 'var(--theme-gradient, linear-gradient(135deg, #2563eb 0%, #3b82f6 100%))'
            }}
          >
            사진 변경
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
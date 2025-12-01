import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LuImage } from 'react-icons/lu';

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

    console.log('회원가입 성공:', newUser.nickname);
    alert('회원가입이 완료되었습니다!');

    // 로그인 페이지로 이동
    navigate('/login');
  };

  return (
    <div 
      className="flex justify-center items-center min-h-screen px-4 py-8 sm:p-10 md:p-10"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] max-w-[500px] w-full m-auto max-h-[90vh] overflow-y-auto p-8 sm:p-10 md:p-12">
        
        <h1 className="text-[2em] text-[#333] text-center mt-0 mb-6 font-bold text-2xl sm:text-3xl max-sm:text-xl">
          회원가입
        </h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 닉네임 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="nickname" className="text-[0.95em] font-semibold text-[#333]">닉네임 *</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder="닉네임을 입력하세요"
              required
              className="p-3 sm:p-3.5 border-2 border-[#e0e0e0] rounded-xl text-[0.95em] transition-colors duration-300 focus:outline-none focus:border-[#667eea] placeholder:text-xl placeholder:text-gray-400"
            />
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[0.95em] font-semibold text-[#333]">이메일 *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="hansung@naver.com"
              required
              className="p-3 sm:p-3.5 border-2 border-[#e0e0e0] rounded-xl text-[0.95em] transition-colors duration-300 focus:outline-none focus:border-[#667eea] placeholder:text-xl placeholder:text-gray-400"
            />
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[0.95em] font-semibold text-[#333]">비밀번호 *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="최소 6자 이상 입력하세요"
              required
              className="p-3 sm:p-3.5 border-2 border-[#e0e0e0] rounded-xl text-[0.95em] transition-colors duration-300 focus:outline-none focus:border-[#667eea] placeholder:text-xl placeholder:text-gray-400 "
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-[0.95em] font-semibold text-[#333]">비밀번호 확인 *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
              className="p-3 sm:p-3.5 border-2 border-[#e0e0e0] rounded-xl text-[0.95em] transition-colors duration-300 focus:outline-none focus:border-[#667eea] placeholder:text-xl placeholder:text-gray-400"
            />
          </div>

          {/* 프로필 사진 (커스텀 파일 입력 스타일) */}
          <div className="flex flex-col gap-2">
            <label htmlFor="profileImage" className="text-[0.95em] font-semibold text-[#333]">프로필 사진 (선택)</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* 프로필 미리보기 */}
                <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-[#e0e0e0] flex items-center justify-center bg-[#f8f9fa] shadow-inner flex-shrink-0">
                    {formData.profileImage ? (
                        <img src={formData.profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center text-[#999] p-2">
                            <LuImage size={40} className="mx-auto mb-1"/>
                            <p className="text-xl">이미지 업로드</p>
                        </div>
                    )}
                </div>
                
                {/* 파일 입력 및 커스텀 라벨 */}
                <div className="flex flex-col items-center sm:items-start w-full">
                    <input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden" // .file-input
                    />
                    <label 
                      htmlFor="profileImage"
                      className="bg-[#667eea] text-white p-3 px-6 rounded-xl cursor-pointer font-semibold transition-all duration-300 hover:bg-[#5568d3] hover:-translate-y-0.5 inline-block text-xl"
                    >
                      사진 선택
                    </label>
                </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="text-white p-4 rounded-xl text-xl font-semibold cursor-pointer transition-all duration-300 mt-2 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(102,126,234,0.4)] active:translate-y-0"
            style={{ background: 'linear-gradient(135deg,rgb(99, 111, 167) 0%, #764ba2 100%)' }}
          >
            회원가입
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-t-solid border-t-[#e0e0e0]">
          <p className="text-[#666] m-0 text-base sm:text-lg">
            이미 계정이 있으신가요? 
            <Link 
              to="/login"
              // 로그인 링크 스타일
              className="text-[#667eea] ml-2 font-semibold transition-colors duration-300 hover:text-[#764ba2] hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
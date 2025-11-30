// src/components/auth/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // localStorage에서 현재 로그인 사용자 확인
  const currentUserStr = localStorage.getItem('currentUser');
  
  console.log('ProtectedRoute 체크');
  console.log('localStorage currentUser:', currentUserStr);
  
  // currentUser가 없거나 비어있으면 로그인 페이지로
  if (!currentUserStr) {
    console.log('인증되지 않은 사용자 - 로그인 페이지로 이동');
    return <Navigate to="/login" replace />;
  }
  
  try {
    const currentUser = JSON.parse(currentUserStr);
    
    // 유효한 사용자 객체인지 확인
    if (!currentUser || !currentUser.id) {
      console.log('잘못된 사용자 데이터 - 로그인 페이지로 이동');
      localStorage.removeItem('currentUser');
      return <Navigate to="/login" replace />;
    }
    
    console.log('인증된 사용자 - 대시보드 접근 허용:', currentUser.nickname);
    return children;
    
  } catch (error) {
    console.error('사용자 데이터 파싱 오류:', error);
    localStorage.removeItem('currentUser');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
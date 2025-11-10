import React from 'react';
import Header from '../components/pages/layout/Header';

const DashboardPage = () => {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px' }}>
        <h1>대시보드</h1>
        <p>여기에 대시보드 콘텐츠가 표시됩니다.</p>
      </main>
    </div>
  );
};

export default DashboardPage;

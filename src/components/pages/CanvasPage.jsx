// src/components/pages/CanvasPage.jsx
import React from 'react';
import NewsApi from '../widget/Basic/news/NewsAPI.jsx';
import NewsSmallWidget from '../widget/Basic/news/NewsWidgetSmall.jsx'; 
const CanvasPage = () => {
  return (
    <div>
      <h1>🎨 캔버스 페이지</h1>
      <p>자유로운 레이아웃을 위한 공간입니다.</p>
      <NewsApi/>
      <NewsSmallWidget/>
    </div>
  );
};
export default CanvasPage;


// src/components/widget/Basic/news/NewsWidgetLarge.jsx

import React, { useState, useEffect } from 'react';
import './NewsWidget.css';

const NewsWidgetLarge = () => {
  const [currentSection, setCurrentSection] = useState('스포츠');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sections = [
    { id: 'all', name: '전체', query: '최신뉴스', sort: 'date' },
    { id: 'economy', name: '경제', query: '경제', sort: 'date' },
    { id: 'entertainment', name: '엔터', query: '연예', sort: 'date' },
    { id: 'health', name: '건강', query: '건강', sort: 'date' },
    { id: 'sports', name: '스포츠', query: '스포츠', sort: 'date' },
    { id: 'entertainment2', name: '엔터', query: '엔터테인먼트', sort: 'date' }
  ];

  useEffect(() => {
    loadNews(currentSection);
  }, [currentSection]);

  const loadNews = async (sectionName) => {
    setLoading(true);
    setError(null);

    try {
      const section = sections.find(s => s.name === sectionName);
      const url = `/api/naver/v1/search/news.json?query=${encodeURIComponent(section.query)}&display=4&sort=${section.sort}`;
      
      console.log('📰 네이버 뉴스 API 호출 (대형):', sectionName);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const articles = data.items.map((item, index) => ({
          id: index,
          title: item.title
            .replace(/<\/?b>/g, '')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>'),
          description: item.description
            .replace(/<\/?b>/g, '')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&'),
          url: item.link,
          publishedAt: item.pubDate
        }));
        
        setNews(articles);
        console.log('✅ 뉴스 로드 완료 (대형):', articles.length);
      } else {
        setNews([]);
      }
      
    } catch (err) {
      console.error('❌ 뉴스 로드 실패:', err);
      setError(err.message);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (sectionName) => {
    setCurrentSection(sectionName);
    console.log('🔄 탭 변경:', sectionName);
  };

  const handleNewsClick = (url) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="news-widget-large">
      <div className="news-tabs-large">
        {sections.map(section => (
          <button
            key={section.id}
            className={`news-tab-large ${currentSection === section.name ? 'active' : ''}`}
            onClick={() => handleTabClick(section.name)}
          >
            {section.name}
          </button>
        ))}
      </div>

      <ul className="news-list-large">
        {loading ? (
          <li className="news-loading-large">뉴스를 불러오는 중...</li>
        ) : error ? (
          <li className="news-error-large">⚠️ {error}</li>
        ) : news.length === 0 ? (
          <li className="news-empty-large">뉴스가 없습니다</li>
        ) : (
          news.map((item) => (
            <li 
              key={item.id} 
              className="news-item-large"
              onClick={() => handleNewsClick(item.url)}
            >
              <div className="news-item-title">{item.title}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NewsWidgetLarge;
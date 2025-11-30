// src/components/widget/Basic/news/NewsWidgetLarge.jsx

import React, { useState, useEffect } from 'react';

const NewsWidgetLarge = () => {
  const [currentSection, setCurrentSection] = useState('스포츠');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sections = [
    { id: 'all', name: '최신', query: '최신뉴스', sort: 'date' },
    { id: 'economy', name: '경제', query: '경제', sort: 'date' },
    { id: 'entertainment', name: '연예', query: '연예', sort: 'date' },
    { id: 'health', name: '건강', query: '건강', sort: 'date' },
    { id: 'sports', name: '스포츠', query: '스포츠', sort: 'date' }
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
      
      console.log('네이버 뉴스 API 호출 (대형):', sectionName);
      
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
        console.log('뉴스 로드 완료 (대형):', articles.length);
      } else {
        setNews([]);
      }
      
    } catch (err) {
      console.error('뉴스 로드 실패:', err);
      setError(err.message);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (sectionName) => {
    setCurrentSection(sectionName);
    console.log('탭 변경:', sectionName);
  };

  const handleNewsClick = (url) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full min-h-[300px] bg-white rounded-2xl shadow-lg overflow-hidden font-sans flex flex-col">
      {/* 탭 메뉴 */}
      <div className="flex gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 overflow-x-auto flex-shrink-0">
        {sections.map(section => (
          <button
            key={section.id}
            className={`px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              currentSection === section.name
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:border-gray-400'
            }`}
            onClick={() => handleTabClick(section.name)}
          >
            {section.name}
          </button>
        ))}
      </div>

      {/* 뉴스 목록 */}
      <ul className="list-none p-4 m-0 flex-1 overflow-y-auto">
        {loading ? (
          <li className="py-[60px] px-5 text-center text-gray-400 text-sm">
            뉴스를 불러오는 중...
          </li>
        ) : error ? (
          <li className="py-[60px] px-5 text-center text-red-500 text-sm">
            {error}
          </li>
        ) : news.length === 0 ? (
          <li className="py-[60px] px-5 text-center text-gray-400 text-sm">
            뉴스가 없습니다
          </li>
        ) : (
          news.map((item) => (
            <li 
              key={item.id} 
              className="p-3.5 mb-2.5 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all duration-200 last:mb-0 hover:border-blue-600 hover:shadow-[0_2px_8px_rgba(37,99,235,0.1)] hover:-translate-y-0.5"
              onClick={() => handleNewsClick(item.url)}
            >
              <div className="text-sm leading-relaxed text-gray-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                {item.title}
              </div>
            </li>
          ))
        )}
      </ul>

    </div>
  );
};

export default NewsWidgetLarge;
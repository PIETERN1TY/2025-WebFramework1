// src/components/widget/Basic/news/NewsWidgetSmall.jsx

import React, { useState, useEffect } from 'react';

const NewsWidgetSmall = () => {
  const [currentSection, setCurrentSection] = useState('스포츠');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      
      console.log('네이버 뉴스 API 호출:', sectionName);
      
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
          url: item.link,
          publishedAt: item.pubDate
        }));
        
        setNews(articles);
        console.log('뉴스 로드 완료:', articles.length);
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

  const handleSectionSelect = (sectionName) => {
    setCurrentSection(sectionName);
    setIsDropdownOpen(false);
    console.log('섹션 변경:', sectionName);
  };

  const handleNewsClick = (url) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-80 max-w-full bg-white rounded-2xl shadow-lg overflow-hidden font-sans">
      {/* 헤더 */}
      <div className="flex justify-between items-center px-4 py-3.5 bg-gray-50 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-800">이 시각 주요뉴스</span>
        
        {/* 드롭다운 */}
        <div className="relative">
          <button 
            className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-semibold text-blue-600 cursor-pointer transition-all duration-200 flex items-center gap-1 hover:bg-gray-50 hover:border-blue-600"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            ▼ {currentSection}
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-[calc(100%+4px)] right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-[100] min-w-[100px]">
              {sections.map(section => (
                <button
                  key={section.id}
                  className={`block w-full px-4 py-2.5 bg-white border-none text-left text-sm cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
                    currentSection === section.name 
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'text-gray-800'
                  }`}
                  onClick={() => handleSectionSelect(section.name)}
                >
                  {section.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 뉴스 목록 */}
      <ul className="list-none p-0 m-0">
        {loading ? (
          <li className="py-10 px-4 text-center text-gray-400 text-sm">
            뉴스를 불러오는 중...
          </li>
        ) : error ? (
          <li className="py-10 px-4 text-center text-red-500 text-sm">
            {error}
          </li>
        ) : news.length === 0 ? (
          <li className="py-10 px-4 text-center text-gray-400 text-sm">
            뉴스가 없습니다
          </li>
        ) : (
          news.map((item) => (
            <li 
              key={item.id} 
              className="px-4 py-3.5 border-b border-gray-100 text-sm leading-relaxed text-gray-800 cursor-pointer transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis last:border-b-0 hover:bg-gray-50"
              onClick={() => handleNewsClick(item.url)}
            >
              {item.title}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NewsWidgetSmall;
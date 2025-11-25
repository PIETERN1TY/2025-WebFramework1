// src/components/widget/Basic/news/NewsWidgetLarge.jsx

import React, { useState, useEffect } from 'react';
import './NewsWidget.css';

// 🔑 API Key
const NEWS_API_KEY = "e901566ca28a42668180928540235c01";

// 📰 탭 카테고리 목록
const TABS = [
    { id: 'all', name: '전체', query: null },
    { id: 'politics', name: '정치', query: '정치' },
    { id: 'economy', name: '경제', query: '경제' },
    { id: 'entertainment', name: '연예', query: '연예' },
    { id: 'health', name: '건강', query: '건강' },
    { id: 'sports', name: '스포츠', query: '스포츠' },
    { id: 'entertainment2', name: '엔터', query: '엔터테인먼트' }
];

const NewsWidgetLarge = () => {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    // 뉴스 데이터 가져오기
    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const currentTab = TABS.find(tab => tab.id === activeTab);
                let apiUrl;
                
                if (currentTab.query) {
                    // 특정 키워드로 한국 뉴스 검색
                    apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(currentTab.query)}&language=ko&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
                } else {
                    // 전체 한국 헤드라인 뉴스
                    apiUrl = `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${NEWS_API_KEY}`;
                }

                console.log('🔍 API 요청 URL:', apiUrl);
                
                const response = await fetch(apiUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                console.log('📰 받아온 데이터:', data);
                console.log('📊 기사 개수:', data.articles?.length || 0);

                if (data.status === 'error') {
                    throw new Error(`API Error: ${data.message}`);
                }

                if (!data.articles || data.articles.length === 0) {
                    setArticles([]);
                    setError('해당 카테고리의 뉴스가 없습니다.');
                } else {
                    // 제목이 있고 유효한 기사만 필터링 (최대 4개)
                    const validArticles = data.articles
                        .filter(article => 
                            article.title && 
                            article.title !== '[Removed]' &&
                            !article.title.includes('[removed]')
                        )
                        .slice(0, 4);
                    
                    setArticles(validArticles);
                    
                    if (validArticles.length === 0) {
                        setError('표시할 수 있는 뉴스가 없습니다.');
                    }
                }
            } catch (err) {
                console.error("❌ 뉴스 데이터를 가져오는 데 실패했습니다:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, [activeTab]);

    // 탭 클릭 핸들러
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    if (isLoading) {
        return (
            <div className="news-widget news-large">
                <div className="news-tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`news-tab ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
                <p className="news-loading">뉴스 로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="news-widget news-large">
            {/* 탭 메뉴 */}
            <div className="news-tabs">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`news-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabClick(tab.id)}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
            
            {/* 에러 메시지 */}
            {error && articles.length === 0 && (
                <p className="news-error">{error}</p>
            )}
            
            {/* 뉴스 목록 */}
            <ul className="news-list">
                {articles.length > 0 ? (
                    articles.map((article, index) => (
                        <li 
                            key={index} 
                            className="news-item"
                            onClick={() => article.url && window.open(article.url, '_blank')}
                            title={article.title}
                        >
                            {article.title}
                        </li>
                    ))
                ) : (
                    <li className="news-item news-empty">
                        현재 표시할 뉴스가 없습니다.
                    </li>
                )}
            </ul>
        </div>
    );
};

export default NewsWidgetLarge;
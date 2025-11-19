// src/components/widgets/NewsWidgetLarge.jsx

import React, { useState, useEffect } from 'react';
import './NewsWidget.css';
import { FaChevronDown } from 'react-icons/fa';

// 🔑 API Key
const NEWS_API_KEY = "e901566ca28a42668180928540235c01";

// 📰 카테고리 목록 - 한국은 '전체'만 사용 (카테고리별 뉴스가 부족함)
const CATEGORIES = {
    '전체': { country: 'kr', category: null },
    '미국': { country: 'us', category: null },
    '미국-기술': { country: 'us', category: 'technology' },
    '미국-경제': { country: 'us', category: 'business' },
    '미국-스포츠': { country: 'us', category: 'sports' },
    '일본': { country: 'jp', category: null }
};

const NewsWidgetLarge = () => {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('전체');

    // 데이터 패치 로직
    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const { country, category } = CATEGORIES[selectedCategory];
                let apiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${NEWS_API_KEY}`;
                
                if (category) {
                    apiUrl += `&category=${category}`;
                }

                console.log('🔍 API 요청 URL:', apiUrl);
                
                const response = await fetch(apiUrl);
                
                console.log('📡 응답 상태:', response.status);
                
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
                    // 제목이 있는 기사만 필터링
                    const validArticles = data.articles
                        .filter(article => article.title && article.title !== '[Removed]')
                        .slice(0, 5);
                    
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
    }, [selectedCategory]);

    if (isLoading) {
        return (
            <div className="news-widget news-large">
                <div className="news-large-header">
                    <p className="news-large-title">이 시각 주요 뉴스</p>
                </div>
                <p style={{ marginTop: '10px', color: '#999' }}>뉴스 로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="news-widget news-large">
            <div className="news-large-header">
                <p className="news-large-title">이 시각 주요 뉴스</p>
                
                <div className="news-category-dropdown-wrapper">
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="news-category-select"
                    >
                        {Object.keys(CATEGORIES).map(name => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                    <FaChevronDown size={8} className="dropdown-icon" />
                </div>
            </div>
            
            {error && articles.length === 0 && (
                <p style={{ color: '#ff6b6b', fontSize: '0.9em', marginTop: '10px' }}>
                    {error}
                </p>
            )}
            
            <ul className="news-list" style={{ marginTop: '10px' }}>
                {articles.length > 0 ? (
                    articles.map((article, index) => (
                        <li 
                            key={index} 
                            className="news-item news-single-line-ellipsis"
                            onClick={() => article.url && window.open(article.url, '_blank')}
                            style={{ cursor: article.url ? 'pointer' : 'default' }}
                            title={article.title}
                        >
                            {article.title}
                        </li>
                    ))
                ) : (
                    <li className="news-item" style={{ color: '#999' }}>
                        현재 표시할 뉴스가 없습니다.
                    </li>
                )}
            </ul>
        </div>
    );
};

export default NewsWidgetLarge;
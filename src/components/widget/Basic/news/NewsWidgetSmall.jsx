// NewsWidgetSmall.jsx
// src/components/widgets/NewsWidgetSmall.jsx
import React from 'react';
import './NewsWidget.css'; 

const NewsWidgetSmall = () => {
    return (
        <div className="news-widget news-small">
            <div className="news-header">
                <div className="news-small-tab">
                    {['전체', '경제', '엔터', '건강', '스포츠'].map((tab, index) => (
                        <button key={tab} className={index === 4 ? 'active' : ''}>
                            {tab}
                        </button>
                    ))}
                </div>
                {/*  */}
            </div>
            <ul className="news-list">
                <li className="news-item">오타니, MLB 통산 4번째 실버슬러거  일본인 최다11111111111111111232131231ß1111111111111</li>
                <li className="news-item">‘극장 역전골 폭발' 이재성 "유럽대항전 뛸 수 있을까 생각했는데 감회 새롭11111111111</li>
                <li className="news-item">정규 리그 4라운드로 축소 등, 2026 LCK 운영 계획11111111111111</li>
                <li className="news-item">'빅리그 도전' 앞둔 송성문, 김혜성도 응원한다…"성문이 형은 다 잘한다, MLB1111111111</li>
            </ul>
        </div>
    );
};

export default NewsWidgetSmall;
// src/components/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import { WIDGET_OPTIONS } from '../../App.jsx';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [activeCanvas, setActiveCanvas] = useState(null);
    const [layout, setLayout] = useState([]);

    // 활성 캔버스 로드 (사용자별)
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            navigate('/login');
            return;
        }
        setCurrentUser(user);
        loadActiveCanvas(user.id);

        // 캔버스 변경 감지
        const handleStorageChange = () => {
            loadActiveCanvas(user.id);
        };

        window.addEventListener('canvasChanged', handleStorageChange);
        return () => window.removeEventListener('canvasChanged', handleStorageChange);
    }, [navigate]);

    const loadActiveCanvas = (userId) => {
        const activeCanvasId = localStorage.getItem(`activeCanvas_${userId}`);
        
        if (activeCanvasId) {
            const canvasData = localStorage.getItem(`canvas_${userId}_${activeCanvasId}`);
            if (canvasData) {
                const parsed = JSON.parse(canvasData);
                setActiveCanvas(parsed);
                setLayout(parsed.layout || []);
                return;
            }
        }
        
        // 활성 캔버스가 없으면 빈 레이아웃
        setActiveCanvas(null);
        setLayout([]);
    };

    // 현재 레이아웃에 포함된 위젯만 렌더링
    const widgetsToRender = WIDGET_OPTIONS.filter(option => 
        layout.some(item => item.i === option.id)
    );

    // 위젯 컴포넌트 맵 생성
    const widgetComponentMap = widgetsToRender.reduce((map, widget) => {
        map[widget.id] = widget.Component;
        return map;
    }, {});

    const layoutWidth = 1180;

    if (!currentUser) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="home-page-container">
            <div className="home-page-header">
                <h1 className="dashboard-title">🧩 {currentUser.nickname}님의 대시보드</h1>
                {activeCanvas && (
                    <div className="active-canvas-info">
                        <span className="canvas-badge">📋 {activeCanvas.name}</span>
                    </div>
                )}
            </div>
            
            {layout.length > 0 ? (
                <div className="widget-grid-area">
                    <GridLayout
                        className="rgl-layout"
                        layout={layout}
                        cols={12}
                        rowHeight={100}
                        width={layoutWidth}
                        margin={[10, 10]}
                        containerPadding={[0, 0]}
                        isDraggable={false}
                        isResizable={false}
                        compactType={null}
                        preventCollision={true}
                    >
                        {layout.map(item => {
                            const WidgetComponent = widgetComponentMap[item.i];
                            if (!WidgetComponent) return null;

                            return (
                                <div key={item.i} className="widget-item-wrapper">
                                    <WidgetComponent />
                                </div>
                            );
                        })}
                    </GridLayout>
                </div>
            ) : (
                <div className="empty-home-message">
                    <p>📋 아직 활성화된 캔버스가 없습니다.</p>
                    <p>CANVAS 메뉴에서 새 캔버스를 만들고 활성화하세요!</p>
                    <button 
                        className="go-to-canvas-button"
                        onClick={() => navigate('/canvas')}
                    >
                        🎨 캔버스 만들러 가기
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePage;
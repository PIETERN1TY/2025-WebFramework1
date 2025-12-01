// src/components/pages/HomePage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import { WIDGET_OPTIONS } from '../../config/WidgetConfig';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

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
    const widgetsToRender = useMemo(() => {
        return WIDGET_OPTIONS.filter(option => 
            layout.some(item => item.i === option.id)
        );
    }, [layout]);

    // 위젯 컴포넌트 맵 생성 (최적화)
    const widgetComponentMap = useMemo(() => {
        return widgetsToRender.reduce((map, widget) => {
            map[widget.id] = widget.Component;
            return map;
        }, {});
    }, [widgetsToRender]);

    const layoutWidth = 1180; 

    if (!currentUser) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">대시보드 로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-5 box-border overflow-hidden flex flex-col relative">
            
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                {/* .dashboard-title */}
                <h1 className="text-[1.8em] text-gray-800 m-6">
                    &nbsp;{currentUser.nickname}님의 대시보드
                </h1>
                
                {activeCanvas && (
                    <div className="flex items-center">
                        {/* .canvas-badge */}
                        <span className="bg-blue-600 text-white px-6 py-4 rounded-full text-2xl font-semibold">
                            {activeCanvas.name}
                        </span>
                    </div>
                )}
            </div>
            
            {layout.length > 0 ? (
                <div className="w-[1200px] h-[840px] bg-[#d1eaff] rounded-2xl p-2.5 shadow-[0_5px_15px_rgba(0,0,0,0.1)] overflow-hidden flex-shrink-0">
                    <GridLayout
                        className="w-full h-full"
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
                                <div key={item.i} className="w-full h-full p-1.5 box-border">
                                    <div className="w-full h-full">
                                        <WidgetComponent />
                                    </div>
                                </div>
                            );
                        })}
                    </GridLayout>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <p className="text-[1.8em] font-semibold text-gray-800 my-2.5">
                        아직 활성화된 캔버스가 없습니다.
                    </p>
                    <p className="text-2xl text-gray-600 my-2.5">
                        CANVAS 메뉴에서 새 캔버스를 만들고 활성화하세요!
                    </p>
                </div>
            )}
        </div>
    );
};

export default HomePage;
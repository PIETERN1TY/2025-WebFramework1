// src/components/pages/WidgetPage.jsx

import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import { WIDGET_OPTIONS, INITIAL_LAYOUT } from '../../App.jsx';

// 필수 CSS import
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../pages/WidgetPage.css';

// 저장 함수
const saveLayout = (layout) => {
    console.log("새로운 레이아웃이 저장되었습니다:", layout);
    localStorage.setItem('userLayout', JSON.stringify(layout));
};

const WidgetPage = () => {
    // 저장된 레이아웃을 불러오거나 초기 레이아웃 사용
    const savedLayout = localStorage.getItem('userLayout');
    const initialLayout = savedLayout ? JSON.parse(savedLayout) : INITIAL_LAYOUT;

    const [currentLayout, setCurrentLayout] = useState(initialLayout);
    const [draggedWidget, setDraggedWidget] = useState(null);
    
    // 고정된 그리드 크기 설정
    const layoutWidth = 1200; // 고정 너비

    // 레이아웃 변경 핸들러 (드래그, 리사이즈 시 호출)
    const handleLayoutChange = (newLayout) => {
        setCurrentLayout(newLayout);
    };

    // "저장" 버튼 클릭 핸들러
    const handleSave = () => {
        saveLayout(currentLayout);
        alert("위젯 배치가 홈 화면에 저장되었습니다!");
    };

    // 위젯 목록에서 드래그 시작
    const handleDragStart = (e, widget) => {
        setDraggedWidget(widget);
        e.dataTransfer.effectAllowed = 'move';
    };

    // 캔버스에 드롭 처리
    const handleDrop = (e) => {
        e.preventDefault();
        
        if (!draggedWidget) return;

        // 이미 배치된 위젯인지 확인
        const alreadyPlaced = currentLayout.some(item => item.i === draggedWidget.id);
        if (alreadyPlaced) {
            alert('이미 배치된 위젯입니다!');
            setDraggedWidget(null);
            return;
        }

        // 캔버스 영역의 위치 계산
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 그리드 좌표로 변환
        const colWidth = rect.width / 12;
        const rowHeight = 100;
        const gridX = Math.floor(x / colWidth);
        const gridY = Math.floor(y / rowHeight);

        // 새 위젯 추가
        const newItem = {
            i: draggedWidget.id,
            x: Math.min(gridX, 10), // 최대 x 좌표 제한 (w=2이므로 10까지)
            y: gridY,
            w: 2,
            h: 2
        };

        setCurrentLayout([...currentLayout, newItem]);
        setDraggedWidget(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    // 위젯 삭제
    const handleRemoveWidget = (e, widgetId) => {
        e.stopPropagation(); // 이벤트 전파 방지
        const confirmed = window.confirm('이 위젯을 삭제하시겠습니까?');
        if (confirmed) {
            setCurrentLayout(currentLayout.filter(item => item.i !== widgetId));
        }
    };

    // 현재 레이아웃에 포함된 위젯 컴포넌트만 필터링
    const widgetsToRender = WIDGET_OPTIONS.filter(option => 
        currentLayout.some(item => item.i === option.id)
    );

    // 아직 배치되지 않은 위젯 목록
    const availableWidgets = WIDGET_OPTIONS.filter(option =>
        !currentLayout.some(item => item.i === option.id)
    );

    return (
        <div className="widget-page-container">
            <div className="widget-page-header">
                <h2>위젯 배치 설정</h2>
                <button className="save-button" onClick={handleSave}>
                    저장 (홈 화면에 반영)
                </button>
            </div>

            <div className="widget-page-content">
                {/* 위젯을 배치할 중앙 캔버스 */}
                <div 
                    className="layout-canvas"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <GridLayout
                        className="rgl-layout"
                        layout={currentLayout}
                        cols={12}
                        rowHeight={100}
                        width={layoutWidth}
                        onLayoutChange={handleLayoutChange}
                        compactType={null}
                        isDraggable={true}
                        isResizable={true}
                        preventCollision={true}
                    >
                        {widgetsToRender.map(widget => (
                            <div key={widget.id} className="widget-item-wrapper">
                                {/* 삭제 버튼 */}
                                <button 
                                    className="widget-remove-btn"
                                    onClick={(e) => handleRemoveWidget(e, widget.id)}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
                                    title="위젯 삭제"
                                >
                                    ✕
                                </button>
                                {/* 위젯 컴포넌트 */}
                                <widget.Component />
                            </div>
                        ))}
                    </GridLayout>

                    {currentLayout.length === 0 && (
                        <div className="empty-canvas-message">
                            <p>👉 오른쪽 위젯 목록에서 위젯을 드래그하여 여기에 배치하세요</p>
                        </div>
                    )}
                </div>
                
                {/* 위젯 목록 (드래그 가능한 위젯들) */}
                <div className="widget-palette">
                    <h3>위젯 목록</h3>
                    {availableWidgets.length > 0 ? (
                        <div className="widget-list">
                            {availableWidgets.map(widget => (
                                <div
                                    key={widget.id}
                                    className="widget-palette-item"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, widget)}
                                >
                                    <span className="widget-icon">📦</span>
                                    <span className="widget-name">{widget.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-widgets-message">모든 위젯이 배치되었습니다</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WidgetPage;
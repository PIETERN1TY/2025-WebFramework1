// src/components/pages/CanvasEditor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import { WIDGET_OPTIONS } from '../../App.jsx';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './CanvasEditor.css';

const CanvasEditor = () => {
    const { canvasId } = useParams();
    const navigate = useNavigate();
    
    const [currentUser, setCurrentUser] = useState(null);
    const [canvasData, setCanvasData] = useState(null);
    const [currentLayout, setCurrentLayout] = useState([]);
    const [canvasName, setCanvasName] = useState('');
    const [draggedWidget, setDraggedWidget] = useState(null);
    const [isEditingName, setIsEditingName] = useState(false);
    
    const layoutWidth = 1180;

    // 현재 사용자 및 캔버스 데이터 로드
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            navigate('/login');
            return;
        }
        setCurrentUser(user);
        loadCanvas(user.id);
    }, [canvasId, navigate]);

    const loadCanvas = (userId) => {
        const data = localStorage.getItem(`canvas_${userId}_${canvasId}`);
        if (data) {
            const parsed = JSON.parse(data);
            setCanvasData(parsed);
            setCurrentLayout(parsed.layout || []);
            setCanvasName(parsed.name || '');
        } else {
            alert('캔버스를 찾을 수 없습니다.');
            navigate('/canvas');
        }
    };

    // 레이아웃 변경 핸들러
    const handleLayoutChange = (newLayout) => {
        setCurrentLayout(newLayout);
    };

    // 저장 핸들러
    const handleSave = () => {
        const updatedCanvas = {
            ...canvasData,
            name: canvasName,
            layout: currentLayout,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(`canvas_${currentUser.id}_${canvasId}`, JSON.stringify(updatedCanvas));
        
        // 활성 캔버스인 경우 HomePage 업데이트
        const activeCanvasId = localStorage.getItem(`activeCanvas_${currentUser.id}`);
        if (activeCanvasId === canvasId) {
            window.dispatchEvent(new Event('canvasChanged'));
        }
        
        alert('캔버스가 저장되었습니다!');
    };

    // 위젯 드래그 시작
    const handleDragStart = (e, widget) => {
        setDraggedWidget(widget);
        e.dataTransfer.effectAllowed = 'move';
    };

    // 캔버스에 드롭
    const handleDrop = (e) => {
        e.preventDefault();
        
        if (!draggedWidget) return;

        const alreadyPlaced = currentLayout.some(item => item.i === draggedWidget.id);
        if (alreadyPlaced) {
            alert('이미 배치된 위젯입니다!');
            setDraggedWidget(null);
            return;
        }

        const canvas = e.currentTarget.querySelector('.canvas-grid-layout');
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const colWidth = layoutWidth / 12;
        const rowHeight = 100;
        const gridX = Math.floor(x / colWidth);
        const gridY = Math.floor(y / rowHeight);

        const newItem = {
            i: draggedWidget.id,
            x: Math.min(Math.max(gridX, 0), 10),
            y: Math.max(gridY, 0),
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
        e.stopPropagation();
        const confirmed = window.confirm('이 위젯을 삭제하시겠습니까?');
        if (confirmed) {
            setCurrentLayout(currentLayout.filter(item => item.i !== widgetId));
        }
    };

    // 이름 변경
    const handleNameChange = (e) => {
        setCanvasName(e.target.value);
    };

    const handleNameBlur = () => {
        setIsEditingName(false);
        if (!canvasName.trim()) {
            setCanvasName(canvasData.name);
        }
    };

    // 뒤로 가기
    const handleBack = () => {
        navigate('/canvas');
    };

    if (!canvasData || !currentUser) {
        return (
            <div className="canvas-editor-loading">
                <p>캔버스 로딩 중...</p>
            </div>
        );
    }

    const widgetsToRender = WIDGET_OPTIONS.filter(option => 
        currentLayout.some(item => item.i === option.id)
    );

    const availableWidgets = WIDGET_OPTIONS.filter(option =>
        !currentLayout.some(item => item.i === option.id)
    );

    return (
        <div className="canvas-editor-container">
            <div className="canvas-editor-header">
                <button className="back-button" onClick={handleBack}>
                    ← 캔버스 목록
                </button>
                
                <div className="canvas-name-section">
                    {isEditingName ? (
                        <input
                            type="text"
                            className="canvas-name-input"
                            value={canvasName}
                            onChange={handleNameChange}
                            onBlur={handleNameBlur}
                            onKeyPress={(e) => e.key === 'Enter' && handleNameBlur()}
                            autoFocus
                        />
                    ) : (
                        <h2 
                            className="canvas-name-title"
                            onClick={() => setIsEditingName(true)}
                        >
                            {canvasName} ✏️
                        </h2>
                    )}
                </div>

                <button className="save-button" onClick={handleSave}>
                    💾 저장
                </button>
            </div>

            <div className="canvas-editor-content">
                <div 
                    className="canvas-drop-area"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <GridLayout
                        className="canvas-grid-layout"
                        layout={currentLayout}
                        cols={12}
                        rowHeight={100}
                        width={layoutWidth}
                        onLayoutChange={handleLayoutChange}
                        margin={[10, 10]}
                        containerPadding={[0, 0]}
                        compactType={null}
                        isDraggable={true}
                        isResizable={true}
                        preventCollision={true}
                    >
                        {widgetsToRender.map(widget => (
                            <div key={widget.id} className="canvas-widget-wrapper">
                                <button 
                                    className="widget-remove-btn"
                                    onClick={(e) => handleRemoveWidget(e, widget.id)}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    title="위젯 삭제"
                                >
                                    ✕
                                </button>
                                <widget.Component />
                            </div>
                        ))}
                    </GridLayout>

                    {currentLayout.length === 0 && (
                        <div className="empty-canvas-hint">
                            <p>👉 오른쪽 위젯 목록에서 위젯을 드래그하여 배치하세요</p>
                        </div>
                    )}
                </div>

                <div className="widget-palette">
                    <h3>위젯 목록</h3>
                    <div className="widget-palette-scroll">
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
        </div>
    );
};

export default CanvasEditor;
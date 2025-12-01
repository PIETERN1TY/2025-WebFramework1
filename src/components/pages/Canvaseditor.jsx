// src/components/pages/CanvasEditor.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import { WIDGET_OPTIONS } from '../../config/WidgetConfig';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

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
            <div className="flex items-center justify-center h-full text-2xl text-gray-600">
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
        <div className="w-full h-full flex flex-col p-5 box-border overflow-hidden">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-5 flex-shrink-0">
                <button 
                    className="bg-gray-600 hover:bg-gray-700 text-white border-none px-5 py-2.5 rounded-lg cursor-pointer text-2xl font-semibold transition-all duration-200"
                    onClick={handleBack}
                >
                    ← 캔버스 목록
                </button>
                
                <div className="flex-1 text-center">
                    {isEditingName ? (
                        <input
                            type="text"
                            className="text-[1.8em] px-4 py-1.5 border-2 border-blue-600 rounded-lg text-center min-w-[300px]"
                            value={canvasName}
                            onChange={handleNameChange}
                            onBlur={handleNameBlur}
                            onKeyPress={(e) => e.key === 'Enter' && handleNameBlur()}
                            autoFocus
                        />
                    ) : (
                        <h2 
                            className="m-0 text-[1.8em] text-gray-800 cursor-pointer inline-block px-4 py-1.5 rounded-lg transition-colors duration-200 hover:bg-gray-100"
                            onClick={() => setIsEditingName(true)}
                        >
                            {canvasName} ✏️
                        </h2>
                    )}
                </div>

                <button 
                    className="bg-green-600 hover:bg-green-700 text-white border-none px-6 py-3 rounded-lg cursor-pointer text-2xl font-semibold transition-all duration-200"
                    onClick={handleSave}
                >
                    💾 저장
                </button>
            </div>

            {/* 콘텐츠 영역 */}
            <div className="flex gap-5 flex-1 overflow-hidden min-h-0">
                {/* 캔버스 드롭 영역 */}
                <div 
                    className="w-[1200px] h-[840px] bg-[#d1eaff] rounded-2xl p-2.5 shadow-[0_5px_15px_rgba(0,0,0,0.1)] relative overflow-hidden flex-shrink-0"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <GridLayout
                        className="canvas-grid-layout w-full h-full"
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
                            <div 
                                key={widget.id} 
                                className="bg-white border-2 border-gray-300 rounded-xl shadow-sm transition-all duration-200 relative overflow-hidden w-full h-full p-1.5 box-border hover:shadow-lg hover:border-blue-600 group"
                            >
                                <button 
                                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white border-none cursor-pointer text-lg leading-none z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                    onClick={(e) => handleRemoveWidget(e, widget.id)}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    title="위젯 삭제"
                                >
                                    ✕
                                </button>
                                <div className="w-full h-full">
                                    <widget.Component />
                                </div>
                            </div>
                        ))}
                    </GridLayout>

                    {currentLayout.length === 0 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-[1]">
                            <p className="text-2xl text-gray-600 bg-white/90 px-8 py-5 rounded-xl border-2 border-dashed border-gray-400 m-0">
                                👉 오른쪽 위젯 목록에서 위젯을 드래그하여 배치하세요
                            </p>
                        </div>
                    )}
                </div>

                {/* 위젯 팔레트 */}
                <div className="w-[200px] h-[840px] flex-shrink-0 flex flex-col bg-gray-50 rounded-xl border border-gray-300 overflow-hidden">
                    <h3 className="m-0 px-5 py-5 text-2xl text-gray-800 border-b-2 border-gray-300 bg-white">
                        위젯 목록
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto p-4">
                        {availableWidgets.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {availableWidgets.map(widget => (
                                    <div
                                        key={widget.id}
                                        className="flex items-center gap-3 px-3.5 py-3.5 bg-white border-2 border-gray-300 rounded-lg cursor-move transition-all duration-200 select-none hover:bg-blue-50 hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing active:scale-95"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, widget)}
                                    >
                                        <span className="text-3xl">📦</span>
                                        <span className="font-medium text-gray-800 text-xl">
                                            {widget.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-400 italic py-5 bg-white/50 rounded-lg">

                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* GridLayout 리사이즈 핸들 스타일 */}
            <style jsx>{`
                .canvas-grid-layout .react-resizable-handle {
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6" width="6" height="6"><path d="M6 6H4L6 4Z" fill="%23007bff"/></svg>');
                    background-position: bottom right;
                    padding: 0 3px 3px 0;
                    background-repeat: no-repeat;
                    background-origin: content-box;
                    cursor: se-resize;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .group:hover .react-resizable-handle {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

export default CanvasEditor;
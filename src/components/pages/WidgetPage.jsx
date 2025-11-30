// src/components/pages/WidgetPage.jsx

import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import { WIDGET_OPTIONS, INITIAL_LAYOUT } from '../../App.jsx';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// 저장 함수
const saveLayout = (layout) => {
    console.log("새로운 레이아웃이 저장되었습니다:", layout);
    localStorage.setItem('userLayout', JSON.stringify(layout));
};

const WidgetPage = () => {
    const savedLayout = localStorage.getItem('userLayout');
    const initialLayout = savedLayout ? JSON.parse(savedLayout) : INITIAL_LAYOUT;

    const [currentLayout, setCurrentLayout] = useState(initialLayout);
    const [draggedWidget, setDraggedWidget] = useState(null);
    
    const layoutWidth = 984;

    const handleLayoutChange = (newLayout) => {
        setCurrentLayout(newLayout);
    };

    const handleSave = () => {
        saveLayout(currentLayout);
        alert("위젯 배치가 홈 화면에 저장되었습니다!");
    };

    const handleDragStart = (e, widget) => {
        setDraggedWidget(widget);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        
        if (!draggedWidget) return;

        const alreadyPlaced = currentLayout.some(item => item.i === draggedWidget.id);
        if (alreadyPlaced) {
            alert('이미 배치된 위젯입니다!');
            setDraggedWidget(null);
            return;
        }

        const canvas = e.currentTarget.querySelector('.rgl-layout');
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const colWidth = layoutWidth / 12;
        const rowHeight = 83;
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

    const handleRemoveWidget = (e, widgetId) => {
        e.stopPropagation();
        const confirmed = window.confirm('이 위젯을 삭제하시겠습니까?');
        if (confirmed) {
            setCurrentLayout(currentLayout.filter(item => item.i !== widgetId));
        }
    };

    const widgetsToRender = WIDGET_OPTIONS.filter(option => 
        currentLayout.some(item => item.i === option.id)
    );

    const availableWidgets = WIDGET_OPTIONS.filter(option =>
        !currentLayout.some(item => item.i === option.id)
    );

    return (
        <div className="w-full h-full flex flex-col p-5 box-border overflow-hidden">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-5 flex-shrink-0">
                <h2 className="m-0 text-[1.8em] text-gray-800">위젯 배치 설정</h2>
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white border-none px-6 py-3 rounded-lg cursor-pointer text-base font-semibold transition-colors duration-200"
                    onClick={handleSave}
                >
                    저장 (홈 화면에 반영)
                </button>
            </div>

            {/* Content */}
            <div className="flex gap-5 flex-1 overflow-hidden min-h-0">
                {/* Canvas */}
                <div 
                    className="w-[1004px] h-[703px] bg-[#d1eaff] rounded-2xl p-2.5 shadow-[0_5px_15px_rgba(0,0,0,0.1)] relative overflow-hidden flex-shrink-0"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <GridLayout
                        className="rgl-layout w-full h-full"
                        layout={currentLayout}
                        cols={12}
                        rowHeight={83}
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
                            <div key={widget.id} className="bg-white border-2 border-gray-300 rounded-xl shadow-sm transition-shadow duration-200 relative overflow-hidden w-full h-full p-1.5 box-border hover:shadow-lg hover:border-blue-600 group">
                                <button 
                                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white border-none cursor-pointer text-lg leading-none z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
                                    onClick={(e) => handleRemoveWidget(e, widget.id)}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-600 text-xl z-[1]">
                            <p className="m-0 p-5 bg-white/80 rounded-xl border-2 border-dashed border-gray-400">
                                👉 오른쪽 위젯 목록에서 위젯을 드래그하여 여기에 배치하세요
                            </p>
                        </div>
                    )}
                </div>
                
                <div className="w-[280px] flex-shrink-0 p-5 border border-gray-300 rounded-xl bg-gray-50 overflow-y-auto max-h-full">
                    <h3 className="mt-0 text-xl text-gray-800 border-b-2 border-gray-300 pb-2.5 mb-4">위젯 목록</h3>
                    {availableWidgets.length > 0 ? (
                        <div className="flex flex-col gap-2.5">
                            {availableWidgets.map(widget => (
                                <div
                                    key={widget.id}
                                    className="flex items-center gap-2.5 px-3 py-3 bg-white border-2 border-gray-300 rounded-lg cursor-move transition-all duration-200 select-none hover:bg-blue-50 hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing active:scale-95"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, widget)}
                                >
                                    <span className="text-2xl">📦</span>
                                    <span className="font-medium text-gray-800">{widget.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 italic mt-5">모든 위젯이 배치되었습니다</p>
                    )}
                </div>
            </div>

            <style jsx>{`
                .rgl-layout .react-resizable-handle {
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6" width="6" height="6"><path d="M6 6H4L6 4Z" fill="%23888"/></svg>');
                    background-position: bottom right;
                    padding: 0 3px 3px 0;
                    background-repeat: no-repeat;
                    background-origin: content-box;
                    cursor: se-resize;
                    opacity: 0.7;
                }
            `}</style>
        </div>
    );
};

export default WidgetPage;
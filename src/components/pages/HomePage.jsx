import React from 'react';
import GridLayout from 'react-grid-layout';
import { WIDGET_OPTIONS, INITIAL_LAYOUT } from '../../App.jsx';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '/Users/jiwonlee/Documents/2025-2/WebFramework1/number_8/src/components/pages/HomePage.css';

const HomePage = () => {
    // 1. 저장된 레이아웃 로드
    const savedLayoutJson = localStorage.getItem('userLayout');
    const layout = savedLayoutJson ? JSON.parse(savedLayoutJson) : INITIAL_LAYOUT;

    // 2. 현재 레이아웃에 포함된 위젯만 렌더링하도록 필터링
    const widgetsToRender = WIDGET_OPTIONS.filter(option => 
        layout.some(item => item.i === option.id)
    );

    // 3. 렌더링에 필요한 위젯 컴포넌트를 쉽게 찾기 위한 맵 생성
    const widgetComponentMap = widgetsToRender.reduce((map, widget) => {
        map[widget.id] = widget.Component;
        return map;
    }, {});

    // 4. WidgetPage와 동일한 너비 계산
    const layoutWidth = window.innerWidth - 250;

    return (
        <div className="home-page-container">
            <h1 className="dashboard-title">🧩 개인 맞춤형 대시보드</h1>
            
            {/* 5. React-Grid-Layout 설정 */}
            <div className="widget-grid-area">
                <GridLayout
                    className="rgl-layout"
                    layout={layout}
                    cols={12}
                    rowHeight={100}
                    width={layoutWidth}
                    isDraggable={false}
                    isResizable={false}
                    compactType={null}
                    preventCollision={true}
                >
                    {/* 6. 레이아웃에 정의된 항목 순서대로 위젯 렌더링 */}
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
            
            {/* 레이아웃이 비어있을 때 메시지 */}
            {layout.length === 0 && (
                <p className="empty-layout-message">
                    아직 배치된 위젯이 없습니다. 'WIDGET' 메뉴에서 위젯을 추가하고 저장하세요.
                </p>
            )}
        </div>
    );
};

export default HomePage;
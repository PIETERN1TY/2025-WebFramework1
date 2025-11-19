/**
 * /src/components/layout/Grid.jsx
 *
 * 위젯이 배치될 그리드 구조를 정의 및 관리합니다.
 *
 * react-grid-layout 사용.
 * 그리드 한 칸의 비는 16:9로 한다.
 *
 * column 수
 *   large: 12-16개
 *   medium: 8-12개
 *   small: 4-6개
 *
 * gutter 넓이
 *   large: 24px
 *   medium: 최적 24px
 *   small: 최적 16px
 *
 * margin
 *   large: 최소 24px
 *   medium: 최소 24px
 *   small: 최소 16px
 *
 * 기타 KRDS(디지털 정부서비스 UI/UX 가이드라인) 참조
 */

// import { Responsive, WidthProvider } from "react-grid-layout/index.js.flow";
// src/components/pages/layout/Grid.jsx (수정된 내용)
import React from 'react';
import { Responsive, WidthProvider } from "react-grid-layout"; // 임시로 주석 처리된 부분을 복구

// WidthProvider를 사용하여 반응형 그리드를 만듭니다.
const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * 위젯이 배치될 그리드 구조를 정의 및 관리합니다.
 */
const Grid = ({ children, layout }) => {
    
    // Grid.jsx 주석에 명시된 레이아웃 설정 (KRDS 참조)
    const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
    const cols = { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 };
    const margin = [24, 24]; // [horizontal, vertical] (large/medium 기준)
    const rowHeight = 60; // 위젯 높이 단위를 조정 (픽셀 단위)

    // 레이아웃이 변경될 때마다 Context에 저장하는 함수 (구현 필요)
    // const onLayoutChange = (newLayout) => {
    //     // WidgetContext를 사용하여 새 레이아웃을 저장합니다.
    //     console.log("새 레이아웃 저장:", newLayout);
    // };

    // layout prop을 사용하여 초기 레이아웃을 정의합니다.
    const layouts = { 
        lg: layout,
        md: layout,
        sm: layout,
        // ... 필요한 모든 반응형 레이아웃 정의
    };

    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={breakpoints}
            cols={cols}
            margin={margin}
            rowHeight={rowHeight}
            // onLayoutChange={onLayoutChange} // 실제 위젯 위치 저장 시 사용
            containerPadding={[0, 0]} // 컨테이너 패딩
            isDraggable={true}
            isResizable={true}
            preventCollision={true} // 위젯이 겹치지 않도록
        >
            {/* 자식 컴포넌트(위젯)들이 여기에 렌더링됩니다. */}
            {children}
        </ResponsiveGridLayout>
    );
};

export default Grid;
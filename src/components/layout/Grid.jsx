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
/**
 * src/components/pages/settingChildren/grandChildren/colorPalette.jsx
 *
 * 직사각형 바 형태의 컬러 팔레트 컴포넌트.
 */
import "../../../../styles/css/colorPalette.css";

/**
 * @param {object} props - 컴포넌트 속성
 * @param {string} props.name - 팔레트의 이름
 * @param {string[]} props.colors - 표시할 색상 코드 배열 (e.g., ['#ff0000', '#00ff00'])
 */
const ColorPalette = ({ name, colors = [] }) => {
  return (
    <div className={"palette"}>
      <label>{name}</label>
      <div className="color-bar">
        {colors.map((color, index) => (
          <div
            key={index}
            className="color-segment"
            style={{ backgroundColor: color }}
            title={color} // 마우스를 올리면 색상 코드 표시
            onClick={() => navigator.clipboard.writeText(color)} // 클릭 시 색상 코드 복사
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
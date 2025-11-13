/**
 * src/components/pages/settingChildren/SettingTheme.jsx
 *
 * 테마 설정 컴포넌트.
 */

import ColorPalette from "./grandChildren/colorPalette";
import paletteData from "../../../assets/colorPalette.json";

const SettingTheme = () =>
{
    return(
        <div>
            <h3>테마 설정</h3>
            {paletteData.palettes.map((palette) => (
                <ColorPalette
                    key={palette.name}
                    name={palette.name}
                    colors={Object.values(palette.colors)}
                />
            ))}
        </div>
    )

}

export default SettingTheme;
/**
 * src/pages/SettingPage.jsx
 *
 * 설정 Modal 창
 *
 * TODO:
 * 1. [] Firebase Key 입력, 즉시 저장 및 불러오기 버튼
 * 2. [] 테마 및 스타일 선택
 * 3. [] 스크린 세이버 설정: On/Off, 배경화면 설정(로컬 파일 또는 디렉토리 지정)
 * 4. [] Application 정보 표시
 * 5. [] ...
 */

import React from 'react'
import SettingFirebase from "./settingChildren/SettingFirebase.jsx";
import SettingTheme from "./settingChildren/SettingTheme.jsx";
import Footer from "./settingChildren/Footer.jsx"
import Separator from "./settingChildren/Separator.jsx";
import SettingScreensaver from "./settingChildren/SettingScreensaver.jsx";


const SettingPage = () =>
{
    return (
        <div>
            <h1>설정</h1>
            <Separator />
            <SettingFirebase />
            <Separator />
            <SettingTheme />
            <Separator />
            {/*스크린 세이버 설정*/}
            <SettingScreensaver />
            <Footer />

        </div>
    );
}

export default SettingPage;
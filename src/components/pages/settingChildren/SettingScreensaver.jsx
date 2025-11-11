/**
 * src/components/pages/settingChildren/SettingScreensaver.jsx
 *
 * 스크린 세이버에 대한 설정 컴포넌트.
 */

const SettingScreensaver = () =>
{
    return(
        <>
            <h3>스크린세이버 설정</h3>

            <div className="fieldset">
                <div className="form-group">
                    <div className="form-conts">
                        <div className="krds-check-area chk-column">
                            <div className="krds-form-check ">
                                <input type="checkbox" id="chk_additional_1"/>
                                <label htmlFor="chk_additional_1">스크린세이버 켜기</label>
                                <div className="krds-form-check-cnt">
                                    <p className="krds-form-check-p">
                                        일정 시간이 지나면 위젯을 투명화해 배경화면을 표시합니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SettingScreensaver;
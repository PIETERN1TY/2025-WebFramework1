/**
 * src/components/pages/settingChildren/SettingFirebase.jsx
 *
 * Firebase에 대한 설정 컴포넌트.
 *
 */
import Button from "../../common/Button.jsx";
import '../../../styles/css/SettingFirebase.css'; // CSS 파일 임포트

const SettingFirebase = () =>
{
    return(
        <div className={"form-group setting-element"}>
            <h3>Firebase 데이터베이스 연결</h3>
            <div className="firebase-container">
                <textarea className="firebase-textarea" placeholder={" Input Key"}></textarea>
                <Button className={"primary inline-btn submit-btn firebase-button"}>연결</Button>
            </div>
        </div>
    )
}

export default SettingFirebase;
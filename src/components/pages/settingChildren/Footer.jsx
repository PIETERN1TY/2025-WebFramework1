/**
 * src/components/pages/settingChildren/Footer.jsx
 *
 * Setting page에 들어가는 푸터
 */
import "../../../styles/css/Footer.css";

const Footer = () =>
{
    const currentYear = new Date().getFullYear();

    return (
        <div className={"footer"}>
            <p>
                © {currentYear} 8조 블루 레모네이드. 한성대학교 웹프레임워크1.
            </p>
            <p>
                본 프로젝트는 행정안전부의 '<a href="https://www.krds.go.kr" target="_blank" rel="noopener noreferrer">범정부 UI/UX 디자인시스템(KRDS)</a>'을 활용하여 제작되었습니다.
            </p>
        </div>
    )
}

export default Footer;
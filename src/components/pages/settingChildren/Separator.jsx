/**
 * src/components/pages/settingChildren/Separator.jsx
 *
 * 설정 페이지의 섹션을 구분하는 시각적 구분선 컴포넌트.
 */

const Separator = () => {
    const separatorStyle = {
        height: '1px',
        backgroundColor: '#e0e0e0',
        margin: '20px 0'
    };

    return <div style={separatorStyle}></div>;
};

export default Separator;
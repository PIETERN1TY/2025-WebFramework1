import React, {useState} from 'react';
import Button from './common/Button.jsx';

const AddWidget = () =>
{
    // 선택된 위젯 타입을 관리하는 state
    const [selectedWidget, setSelectedWidget] = useState("Youtube");
    // textarea의 입력 값을 관리하는 state
    const [inputValue, setInputValue] = useState("");
    // 입력 값의 유효성 오류 상태를 관리하는 state
    const [isInvalid, setIsInvalid] = useState(false);
    // 입력 가이드 표시 여부를 관리하는 state
    const [showGuide, setShowGuide] = useState(false);

    // 위젯 타입에 따라 입력 가이드 텍스트를 결정하는 객체
    const guideTextMap = {
        Youtube: "유튜브 영상 또는 재생목록 URL을 입력하세요.",
        Weather: "도시 이름을 영문으로 입력하세요. (예: Seoul)",
        Stocks: "종목 코드를 입력하세요. (예: 005930)",
        News: "관심있는 뉴스 키워드를 입력하세요.",
        Custom: "표시할 HTML 또는 Markdown 코드를 입력하세요."
    };

    // select 값이 변경될 때 호출되는 이벤트 핸들러
    const handleWidgetChange = (event) => {
        setSelectedWidget(event.target.value);
        setShowGuide(false); // 위젯 종류 변경 시 가이드는 숨김
    };

    // textarea 값이 변경될 때 호출되는 이벤트 핸들러
    const handleInputChange = (event) => {
        const { value } = event.target;
        setInputValue(value);

        // 간단한 유효성 검사 로직
        let error = false;
        if (value.trim() === '') {
            // 값은 있지만 공백만 있는 경우도 오류로 처리할 수 있습니다.
            // 여기서는 일단 비어있지 않으면 통과시킵니다.
        } else if (selectedWidget === 'Youtube' && !value.includes('youtube.com')) {
            // Youtube 위젯일 경우 'youtube.com'을 포함하는지 검사
            error = true;
        }
        // 다른 위젯 타입에 대한 추가적인 검증 로직을 여기에 추가할 수 있습니다.

        setIsInvalid(error);
    };

    // 입력 가이드 표시를 토글하는 핸들러
    const toggleGuide = () => setShowGuide(prev => !prev);

    return (
    <div>
        <h3>위젯 추가</h3>
        <br />

        <div className="form-group">
            <select
                id={"widgetType"}
                className="krds-form-select medium"
                title={"위젯 선택"}
                value={selectedWidget} // state와 select의 값을 동기화 (제어 컴포넌트)
                onChange={handleWidgetChange} // onChange 이벤트 핸들러 연결
            >
                <option value={"Youtube"}>Youtube</option>
                <option value={"Weather"}>Weather</option>
                <option value={"Stocks"}>Stocks</option>
                <option value={"News"}>News</option>
                <option value={"Custom"}>Custom</option>
            </select>

            <div className="form-tit">
                <label htmlFor="textarea">입력</label>                
                <Button className={"icon text help-btn"} onClick={toggleGuide}>?</Button>
            </div>
            <div className={"form-conts"}>
                <div className={"textarea-wrap"}>
                    <textarea                        
                        id={"textarea"}
                        className={`krds-input ${isInvalid ? 'is-error' : ''}`}
                        placeholder="내용을 입력하세요."
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* 입력 가이드 */}
            {showGuide && (
                <div className="input-guide">
                    {guideTextMap[selectedWidget]}
                </div>
            )}

            {/* 입력 값이 있고, 유효성 오류가 없을 때 버튼 활성화 */}
            <Button
                className={"primary submit-btn"}
                disabled={inputValue.trim() === '' || isInvalid}
            >
                위젯 추가
            </Button>
        </div>

    </div>
    );
};

export default AddWidget;

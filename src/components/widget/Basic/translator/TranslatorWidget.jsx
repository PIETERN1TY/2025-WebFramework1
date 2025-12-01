import React, { useState, useEffect, useMemo, useCallback } from 'react';

const API_KEY = "AIzaSyAc5hNDVG0XlIlPqFt4qGmnY-LJqjfSX08"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;


// 지원 언어 목록 확장
const LANG_MAP = {
    'ko': '한국어',
    'en': '영어',
    'ja': '일본어',
    'fr': '프랑스어',
    'de': '독일어',
    'es': '스페인어',
    'zh': '중국어',
    'ru': '러시아어',
    'it': '이탈리아어',
    'pt': '포르투갈어',
    'ar': '아랍어',
    'hi': '힌디어',
    'th': '태국어',
    'vi': '베트남어',
};

// 드롭다운에 사용할 언어 코드와 이름 목록
const LANGUAGE_OPTIONS = Object.entries(LANG_MAP).map(([code, name]) => ({ code, name }));

const SwapIcon = (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="14" 
        height="14" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-current"
    >
        {/* 화살표 교환 아이콘: ArrowLeftRight */}
        <path d="M8 3L4 7l4 4M20 7H4M16 21l4-4-4-4M4 17h16"/>
    </svg>
);


const TranslatorWidget = () => {
    // 1. 상태 정의
    const [sourceLang, setSourceLang] = useState('ko'); // 초기: 한국어
    const [targetLang, setTargetLang] = useState('en'); // 초기: 영어
    const [inputText, setInputText] = useState(''); // 입력 텍스트
    const [translatedText, setTranslatedText] = useState(''); // 번역 결과
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태
    const [message, setMessage] = useState(null); // 메시지 상태 (오류/알림)

    // 2. 언어 교환 핸들러
    const handleSwapLanguages = () => {
        // 소스 언어와 대상 언어 값을 서로 교체
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        // 언어 교환 시 입력 텍스트와 번역 결과도 서로 교체
        setInputText(translatedText); 
        setTranslatedText(inputText);
    };

    // 3. 텍스트 입력 핸들러
    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    // 4. 소스 언어 변경 핸들러 (드롭다운)
    const handleSourceLangChange = (event) => {
        const newSourceLang = event.target.value;
        // 대상 언어와 동일하면, 대상 언어를 이전 소스 언어로 자동 교체
        if (newSourceLang === targetLang) {
            setTargetLang(sourceLang); // 이전 소스 언어(sourceLang)를 대상 언어로
        }
        setSourceLang(newSourceLang);
    };

    // 5. 대상 언어 변경 핸들러 (드롭다운)
    const handleTargetLangChange = (event) => {
        const newTargetLang = event.target.value;
        // 소스 언어와 동일하면, 소스 언어를 이전 대상 언어로 자동 교체
        if (newTargetLang === sourceLang) {
            setSourceLang(targetLang); // 이전 대상 언어(targetLang)를 소스 언어로
        }
        setTargetLang(newTargetLang);
    };


    // 6. 번역 실행 핸들러 (Gemini API 호출)
    const handleTranslate = useCallback(async () => {
        if (!inputText.trim()) {
            setMessage('번역할 내용을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setTranslatedText('');
        setMessage(null);
        
        // 시스템 명령어: 번역의 역할과 규칙을 정의
        const systemPrompt = "You are a highly accurate, professional translator. Translate the user's text from the source language to the target language accurately and concisely. Only return the translated text without any explanation or commentary.";
        
        // 사용자 질의: 소스/대상 언어와 입력 텍스트를 포함
        const userQuery = `Translate the following text from ${LANG_MAP[sourceLang]} to ${LANG_MAP[targetLang]}: ${inputText}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };
        
        let attempts = 0;
        const maxRetries = 3;
        
        while (attempts < maxRetries) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    // API 응답 상태 코드가 403이면 권한 문제로 가정하고, 다른 오류도 포착
                    if (response.status === 403) {
                         throw new Error(`Forbidden (API Key Issue). Please check the API key.`);
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text) {
                    setTranslatedText(text.trim());
                } else {
                    setTranslatedText('번역 결과를 가져오는 데 실패했습니다.');
                }
                
                break; // 성공 시 루프 종료

            } catch (error) {
                console.error(`번역 API 오류 (시도 ${attempts + 1}/${maxRetries}):`, error);
                attempts++;
                if (attempts >= maxRetries) {
                    setTranslatedText(`번역 오류 발생: ${error.message}`);
                    setMessage(`번역에 실패했습니다. (${error.message})`);
                } else {
                    // 지수 백오프 적용: 1초, 2초, 4초 대기
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
                }
            } finally {
                if (attempts < maxRetries) {
                    setIsLoading(false);
                }
            }
        }
        setIsLoading(false);

    }, [inputText, sourceLang, targetLang]);


    // 7. UI에 표시될 언어 이름 (Placeholder 등에 사용)
    const sourceLangName = LANG_MAP[sourceLang];
    const targetLangName = LANG_MAP[targetLang];
    
    return (
        <div className="min-h-full">
            {/* CSS 스타일 임베드 */}
            <style>
                {`
                .translator-widget {
                    background-color: white;
                    padding: 12px;
                    border-radius: 12px;
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
                    color: #333;
                    display: flex; 
                    flex-direction: column;
                    width: 100%;
                    min-height: 300px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .lang-select-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center; 
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 8px;
                    margin-bottom: 12px;
                }
                
                .lang-select-dropdown {
                    background: #f7f9fc;
                    border: 1px solid #e0e7ff;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-size: 1.0em;
                    font-weight: 600;
                    color: #4c6ef5;
                    flex-grow: 1; 
                    text-align: center;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    cursor: pointer;
                    /* 커스텀 드롭다운 화살표 (SVG) */
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234c6ef5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 8px center;
                    padding-right: 30px; 
                    margin: 0 5px; /* 스왑 버튼과의 간격 조정 */
                }

                /* 드롭다운 옵션의 폰트 색상 */
                .lang-select-dropdown option {
                    color: #333;
                }
                
                .lang-select-bar .swap-button {
                    flex-grow: 0; 
                    color: #4c6ef5;
                    padding: 6px;
                    margin: 0 8px;
                    border: 2px solid #e0e7ff;
                    border-radius: 50%; 
                    width: 32px;
                    height: 32px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: all 0.2s;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                }
                
                .lang-select-bar .swap-button:hover {
                    background-color: #e0e7ff;
                    transform: rotate(180deg) scale(1.05);
                }
                
                .text-area-group {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    gap: 8px;
                }

                .text-area-wrapper {
                    background-color: #f7f9fc;
                    border-radius: 8px;
                    padding: 10px;
                    border: 1px solid #e2e8f0;
                    position: relative;
                    flex: 1; 
                    display: flex;
                    flex-direction: column;
                    transition: border-color 0.2s;
                    min-height: 100px;
                }

                .text-area-wrapper.result-area {
                    background-color: #e6f0ff; 
                    border: 1px solid #a3c1ff;
                    color: #1a1a1a;
                }
                
                .text-area-wrapper textarea {
                    width: 100%;
                    height: 100%; 
                    min-height: 50px; 
                    border: none;
                    background: transparent;
                    resize: none;
                    outline: none;
                    font-size: 1em;
                    line-height: 1.5;
                    padding: 0; 
                    font-family: inherit;
                    color: #333;
                }
                
                .translated-text, .loading-text, .error-text {
                    margin: 0;
                    font-size: 1em;
                    line-height: 1.5;
                    color: #333;
                }
                
                .loading-text {
                    color: #4c6ef5;
                    font-style: italic;
                    animation: pulse 1.5s infinite;
                }

                .error-text {
                    color: #e53e3e;
                    font-weight: 600;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }

                .translate-button-container {
                    padding: 10px 0 5px 0;
                    text-align: center;
                }

                .translate-button {
                    background-color: #4c6ef5;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.95em;
                    font-weight: 600;
                    box-shadow: 0 3px 8px rgba(76, 110, 245, 0.3);
                    transition: all 0.2s;
                    min-width: 100px;
                }
                
                .translate-button:hover:not(:disabled) {
                    background-color: #3b5bdb;
                    transform: translateY(-1px);
                }
                
                .translate-button:disabled {
                    background-color: #a0c3e7;
                    cursor: not-allowed;
                    box-shadow: none;
                }
                
                .message-bar {
                    background-color: #fbd38d;
                    color: #9c4221;
                    padding: 6px;
                    border-radius: 6px;
                    margin-bottom: 8px;
                    text-align: center;
                    font-size: 0.85em;
                }
                `}
            </style>

            <div className="translator-widget">
                {/* 알림 메시지 표시 */}
                {message && (
                    <div className="message-bar">
                        {message}
                    </div>
                )}
                
                {/* 5. 언어 선택 바 (드롭다운으로 변경) */}
                <div className="lang-select-bar">
                    <select
                        className="lang-select-dropdown"
                        value={sourceLang}
                        onChange={handleSourceLangChange}
                        title="소스 언어 선택"
                    >
                        {LANGUAGE_OPTIONS.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                    
                    {/* 언어 교환 버튼 */}
                    <button className="swap-button" onClick={handleSwapLanguages} title="언어 교환">
                        {SwapIcon}
                    </button>
                    
                    <select
                        className="lang-select-dropdown"
                        value={targetLang}
                        onChange={handleTargetLangChange}
                        title="대상 언어 선택"
                    >
                        {LANGUAGE_OPTIONS.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="text-area-group">
                    {/* 6. 입력 영역 */}
                    <div className="text-area-wrapper">
                        <textarea 
                            placeholder={`${sourceLangName}로 번역할 내용을 입력하세요...`}
                            value={inputText}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* 7. 번역 버튼 */}
                    <div className="translate-button-container">
                        <button 
                            className="translate-button" 
                            onClick={handleTranslate} 
                            disabled={isLoading || !inputText.trim()}
                        >
                            {isLoading ? '번역 중...' : '번역하기'}
                        </button>
                    </div>

                    {/* 8. 번역 결과 영역 */}
                    <div className="text-area-wrapper result-area">
                        {isLoading ? (
                            <p className="loading-text">번역을 기다리는 중...</p>
                        ) : (
                            <p className="translated-text">
                                {translatedText || `${targetLangName} 번역 결과가 여기에 표시됩니다.`}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranslatorWidget;
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Gemini API 호출을 위한 설정
const API_KEY = "AIzaSyCGmkU4oV3iirP7_pLxhCB2qlLXu7I49HY"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

const LANG_MAP = {
    'ko': '한국어',
    'en': '영어',
    'ja': '일본어',
    'fr': '프랑스어',
    'de': '독일어',
    'es': '스페인어',
    'zh': '중국어',
    'ru': '러시아어',
};

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

    // 4. 번역 실행 핸들러 (Gemini API 호출)
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


    // 5. UI에 표시될 언어 이름
    const sourceLangName = LANG_MAP[sourceLang];
    const targetLangName = LANG_MAP[targetLang];
    
    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-full">
            {/* CSS 스타일 임베드 */}
            <style>
                {`
                .translator-widget {
                    background-color: white;
                    padding: 15px;
                    border-radius: 12px;
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
                    color: #333;
                    display: flex; 
                    flex-direction: column;
                    width: 100%;
                    min-height: 400px; /* 전체 위젯 최소 높이 */
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .lang-select-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center; 
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }
                
                .lang-select-bar button {
                    background: none;
                    border: none;
                    font-size: 1.1em;
                    font-weight: 600;
                    cursor: default; /* 언어 선택 버튼이므로 커서 변경 */
                    color: #4a5568;
                    padding: 5px 10px;
                    flex-grow: 1; 
                    text-align: center;
                }
                
                .lang-select-bar .swap-button {
                    flex-grow: 0; 
                    color: #4c6ef5; /* 밝은 파란색으로 변경 */
                    padding: 8px;
                    margin: 0 10px;
                    border: 2px solid #e0e7ff;
                    border-radius: 50%; 
                    width: 36px;
                    height: 36px;
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
                    gap: 10px; /* 입력 영역과 결과 영역 사이의 간격 */
                }

                .text-area-wrapper {
                    background-color: #f7f9fc;
                    border-radius: 10px;
                    padding: 15px;
                    border: 1px solid #e2e8f0;
                    position: relative;
                    flex: 1; 
                    display: flex;
                    flex-direction: column;
                    transition: border-color 0.2s;
                    min-height: 150px;
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
                    font-size: 1.05em;
                    line-height: 1.6;
                    padding: 0; 
                    font-family: inherit;
                    color: #333;
                }
                
                .translated-text, .loading-text, .error-text {
                    margin: 0;
                    font-size: 1.05em;
                    line-height: 1.6;
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
                    padding: 15px 0 5px 0;
                    text-align: center;
                }

                .translate-button {
                    background-color: #4c6ef5;
                    color: white;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1em;
                    font-weight: 600;
                    box-shadow: 0 4px 10px rgba(76, 110, 245, 0.3);
                    transition: all 0.2s;
                    min-width: 120px;
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
                    padding: 8px;
                    border-radius: 6px;
                    margin-bottom: 10px;
                    text-align: center;
                    font-size: 0.9em;
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
                
                {/* 5. 언어 선택 바 */}
                <div className="lang-select-bar">
                    <button className="text-blue-600">{sourceLangName}</button>
                    
                    {/* 언어 교환 버튼 */}
                    <button className="swap-button" onClick={handleSwapLanguages} title="언어 교환">
                        {SwapIcon}
                    </button>
                    
                    <button className="text-blue-600">{targetLangName}</button>
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
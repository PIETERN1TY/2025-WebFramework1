import React, { useState } from 'react';
import './TranslatorWidget.css';
import { FaExchangeAlt } from 'react-icons/fa';

// Gemini API 호출을 위한 설정
const API_KEY = "AIzaSyCGmkU4oV3iirP7_pLxhCB2qlLXu7I49HY"; // 캔버스 환경에서 자동 제공됨
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

// 언어 코드 및 표시 이름을 정의합니다.
const LANG_MAP = {
    'ko': '한국어',
    'en': '영어',
    // 추후 다른 언어를 추가할 때 사용됩니다.
};

const TranslatorWidget = () => {
    // 1. 상태 정의
    const [sourceLang, setSourceLang] = useState('ko'); // 초기: 한국어
    const [targetLang, setTargetLang] = useState('en'); // 초기: 영어
    const [inputText, setInputText] = useState(''); // 입력 텍스트
    const [translatedText, setTranslatedText] = useState(''); // 번역 결과
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태

    // 2. 언어 교환 핸들러
    const handleSwapLanguages = () => {
        // 소스 언어와 대상 언어 값을 서로 교체합니다.
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        // 언어 교환 시 입력 텍스트와 번역 결과도 서로 교체합니다.
        setInputText(translatedText); 
        setTranslatedText(inputText);
    };

    // 3. 텍스트 입력 핸들러
    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    // 4. 번역 실행 핸들러 (Gemini API 호출)
    const handleTranslate = async () => {
        if (!inputText.trim()) {
            setTranslatedText('번역할 내용을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setTranslatedText(''); // 이전 결과 초기화
        
        // 시스템 명령어: 번역의 역할과 규칙을 정의
        const systemPrompt = "You are a highly accurate, professional translator. Translate the user's text from the source language to the target language accurately and concisely. Only return the translated text without any explanation or commentary.";
        
        // 사용자 질의: 소스/대상 언어와 입력 텍스트를 포함
        const userQuery = `Translate from ${LANG_MAP[sourceLang]} to ${LANG_MAP[targetLang]}: ${inputText}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

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

        } catch (error) {
            console.error("번역 API 오류:", error);
            setTranslatedText(`번역 오류 발생: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // 5. UI에 표시될 언어 이름
    const sourceLangName = LANG_MAP[sourceLang];
    const targetLangName = LANG_MAP[targetLang];
    
    return (
        <div className="translator-widget">
            <div className="lang-select-bar">
                <button>{sourceLangName}</button>
                <button className="swap-button" onClick={handleSwapLanguages}>
                    <FaExchangeAlt size={10} />
                </button>
                <button>{targetLangName}</button>
            </div>
            
            {/* 6. 입력 영역 */}
            <div className="text-area-wrapper input-area">
                <textarea 
                    placeholder="번역할 내용을 입력하세요"
                    value={inputText}
                    onChange={handleInputChange}
                />
            </div>

            {/* 7. 번역 버튼 */}
            <button 
                className="translate-button" 
                onClick={handleTranslate} 
                disabled={isLoading || !inputText.trim()}
            >
                {isLoading ? '번역 중...' : '번역'}
            </button>

            {/* 8. 번역 결과 영역 */}
            <div className="text-area-wrapper result-area">
                {isLoading ? (
                    <p className="loading-text">번역을 기다리는 중...</p>
                ) : (
                    <p className="translated-text">{translatedText || '번역 결과가 여기에 표시됩니다.'}</p>
                )}
            </div>
        </div>
    );
};

export default TranslatorWidget;
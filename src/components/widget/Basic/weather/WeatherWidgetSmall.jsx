import React, { useState, useEffect, useCallback } from 'react';

const WEATHER_API_KEY = "c85ddc5c02236a80149ee6ed1acd8bf9"; 
const DEFAULT_CITY = 'Seoul';

// 날씨 아이콘 매핑 (OpenWeather 아이콘 코드 → 이모지)
const WEATHER_ICONS = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
};

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWeather = useCallback(async () => {
        if (!WEATHER_API_KEY) {
            setError('API Key가 설정되지 않았습니다.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 1. 현재 날씨 가져오기
            const currentResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
            );

            if (!currentResponse.ok) {
                throw new Error(`도시 정보를 찾을 수 없거나 HTTP 오류 발생 (${currentResponse.status})`);
            }

            const currentData = await currentResponse.json();

            // 2. 예보 데이터로 향후 24시간의 최고/최저 구하기
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${DEFAULT_CITY}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
            );

            const forecastData = forecastResponse.ok ? await forecastResponse.json() : null;

            // 향후 8개 데이터 (24시간, 3시간 간격)
            const next24Hours = forecastData?.list.slice(0, 8) || [];
            
            // 최고/최저 온도 계산
            let tempMax, tempMin;
            
            if (next24Hours.length > 0) {
                const temps = next24Hours.map(f => f.main.temp);
                tempMax = Math.round(Math.max(...temps));
                tempMin = Math.round(Math.min(...temps));
            } else {
                // fallback: 현재 날씨의 일일 최고/최저 사용
                tempMax = Math.round(currentData.main.temp_max);
                tempMin = Math.round(currentData.main.temp_min);
            }

            setWeather({
                temp: Math.round(currentData.main.temp),
                tempMax: tempMax,
                tempMin: tempMin,
                icon: currentData.weather[0].icon,
                description: currentData.weather[0].description,
                city: currentData.name
            });
        } catch (err) {
            console.error('날씨 데이터를 가져오는 데 실패:', err);
            setError('날씨를 불러올 수 없습니다. (' + (err.message || '알 수 없는 오류') + ')');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWeather();
        // 10분마다 업데이트
        const interval = setInterval(fetchWeather, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchWeather]);

    return (
        <>
            <style>
                {`
                /* Small Weather Widget Styles */
                .weather-widget {
                    background: linear-gradient(135deg, #4c6ef5 0%, #748ffc 100%);
                    border-radius: 15px;
                    color: white;
                    height: 100%;
                    min-height: 150px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    font-family: 'Inter', sans-serif;
                }
                
                .weather-widget.weather-small {
                    padding: 15px 20px;
                }

                .weather-small-header {
                    text-align: left;
                    margin-bottom: 15px;
                }

                .weather-city {
                    font-size: 0.9em;
                    font-weight: 500;
                    margin-bottom: 8px;
                    opacity: 0.95;
                }

                .weather-current-temp {
                    font-size: 3.5em;
                    font-weight: 700;
                    line-height: 1;
                    margin: 0;
                }

                .weather-small-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: auto;
                }

                .weather-icon-small {
                    font-size: 3em; 
                }

                .weather-minmax {
                    font-size: 0.8em;
                    opacity: 0.9;
                    text-align: right;
                }

                .weather-loading, .weather-error {
                    text-align: center;
                    font-size: 1em;
                    opacity: 0.9;
                    margin: auto;
                }

                .weather-loading {
                    animation: pulse 1.5s infinite;
                }

                .weather-error {
                    color: #ffcdd2;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                @media (max-width: 640px) {
                    .weather-current-temp {
                        font-size: 3em;
                    }
                    .weather-icon-small {
                        font-size: 2.5em;
                    }
                }
                `}
            </style>

            {isLoading ? (
                <div className="weather-widget weather-small flex justify-center items-center">
                    <p className="weather-loading">날씨 로딩 중...</p>
                </div>
            ) : error || !weather ? (
                <div className="weather-widget weather-small flex justify-center items-center">
                    <p className="weather-error">{error || '데이터를 가져올 수 없습니다.'}</p>
                </div>
            ) : (
                <div className="weather-widget weather-small">
                    {/* 도시명과 온도 (왼쪽 정렬) */}
                    <div className="weather-small-header">
                        <div className="weather-city">
                            {weather.city} 📍
                        </div>
                        <div className="weather-current-temp">
                            {weather.temp}°
                        </div>
                    </div>

                    {/* 날씨 아이콘과 최고/최저 온도 */}
                    <div className="weather-small-footer">
                        <div className="weather-icon-small">
                            {WEATHER_ICONS[weather.icon] || '☁️'}
                        </div>
                        <div className="weather-minmax">
                            최고: {weather.tempMax}°<br/> 최저: {weather.tempMin}°
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WeatherWidget;
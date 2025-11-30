import React, { useState, useEffect, useCallback, useMemo } from 'react';

const WEATHER_API_KEY = "c85ddc5c02236a80149ee6ed1acd8bf9";

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



const useWeatherFetcher = (city = 'Seoul') => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
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
            // 1. 현재 날씨
            const currentResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
            );

            if (!currentResponse.ok) {
                throw new Error(`도시 정보를 찾을 수 없거나 HTTP 오류 발생 (${currentResponse.status})`);
            }

            const currentData = await currentResponse.json();

            // 2. 5일 예보 (3시간 간격)
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
            );

            if (!forecastResponse.ok) {
                throw new Error('예보 데이터를 가져올 수 없습니다.');
            }

            const forecastData = await forecastResponse.json();

            // 3. 향후 24시간 (8개 데이터)의 최고/최저 온도 계산
            const next24Hours = forecastData.list.slice(0, 8);
            
            let tempMax, tempMin;
            
            if (next24Hours.length > 0) {
                const temps = next24Hours.map(f => f.main.temp);
                tempMax = Math.round(Math.max(...temps));
                tempMin = Math.round(Math.min(...temps));
            } else {
                // 폴백 (fallback)
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

            // 4. 시간대별 예보 6개 추출 및 포맷
            const hourlyForecast = forecastData.list.slice(0, 6).map(item => {
                const date = new Date(item.dt * 1000);
                const hour = date.getHours();
                
                const period = hour < 12 ? '오전' : '오후';
                const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
                
                return {
                    time: `${period} ${displayHour}시`,
                    temp: Math.round(item.main.temp),
                    icon: item.weather[0].icon
                };
            });

            setForecast(hourlyForecast);

        } catch (err) {
            console.error('날씨 데이터를 가져오는 데 실패:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [city]);

    useEffect(() => {
        fetchWeather();
        // 10분마다 업데이트
        const interval = setInterval(fetchWeather, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchWeather]);

    return { weather, forecast, isLoading, error };
};


// 날씨 위젯 소형

const WeatherWidgetSmall = ({ weather, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="weather-widget weather-small flex justify-center items-center">
                <p className="weather-loading animate-pulse">날씨 로딩 중...</p>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="weather-widget weather-small flex justify-center items-center">
                <p className="weather-error text-red-100 p-2 rounded-lg">오류: {error || '데이터 없음'}</p>
            </div>
        );
    }

    return (
        <div className="weather-widget weather-small">
            {/* 상단: 도시명과 온도 (왼쪽 정렬) */}
            <div className="weather-small-header">
                <div className="weather-city">
                    {weather.city} 📍
                </div>
                <div className="weather-current-temp">
                    {weather.temp}°
                </div>
            </div>

            {/* 하단: 날씨 아이콘과 최고/최저 온도 */}
            <div className="weather-small-footer">
                <div className="weather-icon-small">
                    {WEATHER_ICONS[weather.icon] || '☁️'}
                </div>
                <div className="weather-minmax">
                    최고: {weather.tempMax}°<br/> 최저: {weather.tempMin}°
                </div>
            </div>
        </div>
    );
};


// 날씨 위젯 대형 

const WeatherWidgetLarge = ({ weather, forecast, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="weather-widget weather-large flex justify-center items-center">
                <p className="weather-loading animate-pulse">날씨 로딩 중...</p>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="weather-widget weather-large flex justify-center items-center">
                <p className="weather-error text-red-100 p-2 rounded-lg">오류: {error || '데이터 없음'}</p>
            </div>
        );
    }

    return (
        <div className="weather-widget weather-large">
            {/* 상단: 현재 날씨 */}
            <div className="weather-current">
                <div className="weather-current-left">
                    <div className="weather-city-large">
                        {weather.city} 📍
                    </div>
                    <div className="weather-current-temp-large">
                        {weather.temp}°
                    </div>
                </div>
                <div className="weather-current-right">
                    <div className="weather-icon-large">
                        {WEATHER_ICONS[weather.icon] || '☁️'}
                    </div>
                    <div className="weather-minmax-large">
                        최고: {weather.tempMax}° 최저: {weather.tempMin}°
                    </div>
                </div>
            </div>

            {/* 하단: 시간대별 예보 */}
            <div className="weather-forecast">
                {forecast.map((item, index) => (
                    <div key={index} className="weather-forecast-item">
                        <div className="forecast-time">{item.time}</div>
                        <div className="forecast-icon">
                            {WEATHER_ICONS[item.icon] || '☁️'}
                        </div>
                        <div className="forecast-temp">{item.temp}°</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WeatherWidget = ({ isSmallView = false }) => {
    const { weather, forecast, isLoading, error } = useWeatherFetcher('Seoul');

    return (
        <>
            <style>
                {`
                /* src/components/widget/Basic/weather/WeatherWidget.css */

                .weather-widget {
                    background: linear-gradient(135deg, #4c6ef5 0%, #748ffc 100%); /* Tailwind blue 계열로 변경 */
                    border-radius: 15px;
                    color: white;
                    padding: 20px;
                    height: 100%;
                    min-height: 150px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* 그림자 진하게 */
                    font-family: 'Inter', sans-serif;
                }

                /* 날씨 위젯 소형 */
                .weather-widget.weather-small {
                    padding: 15px 20px;
                    min-height: 150px;
                }

                /* 상단: 도시명과 온도 */
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

                /* 아이콘, 최고/최저 */
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

                /* 날씨 위젯 대형 */
                .weather-widget.weather-large {
                    padding: 15px 20px;
                    min-height: 250px;
                }

                /* 현재 날씨 영역 */
                .weather-current {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.3); 
                }

                .weather-current-left {
                    flex: 1;
                }

                .weather-city-large {
                    font-size: 1.1em;
                    font-weight: 500;
                    margin-bottom: 5px;
                    opacity: 0.95;
                }

                .weather-current-temp-large {
                    font-size: 4em;
                    font-weight: 700;
                    line-height: 1;
                }

                .weather-current-right {
                    text-align: right;
                }

                .weather-icon-large {
                    font-size: 3.5em;
                    margin-bottom: 5px;
                }

                .weather-minmax-large {
                    font-size: 0.9em;
                    opacity: 0.9;
                }

                /* 시간대별 예보 */
                .weather-forecast {
                    display: flex;
                    justify-content: space-between;
                    gap: 5px;
                }
                
                .weather-forecast-item {
                    flex: 1;
                    text-align: center;
                    padding: 8px 5px;
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 10px;
                    transition: background 0.2s, transform 0.2s;
                    min-width: 0; /* flex-item overflow 방지 */
                }

                .weather-forecast-item:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }

                .forecast-time {
                    font-size: 0.7em;
                    margin-bottom: 8px;
                    opacity: 0.9;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .forecast-icon {
                    font-size: 1.5em;
                    margin: 5px 0;
                }

                .forecast-temp {
                    font-size: 0.9em;
                    font-weight: 600;
                    margin-top: 5px;
                }

                /* 로딩 및 에러 */
                .weather-loading,
                .weather-error {
                    text-align: center;
                    font-size: 1em;
                    opacity: 0.9;
                    margin: auto;
                }

                .weather-error {
                    color: #ffcdd2; /* 빨간색 계열 */
                }

                /* 반응형 */
                @media (max-width: 640px) {
                    .weather-current-temp {
                        font-size: 3em;
                    }
                    
                    .weather-current-temp-large {
                        font-size: 3.5em;
                    }
                    
                    .forecast-time {
                        font-size: 0.6em;
                    }
                    
                    .weather-forecast {
                        gap: 3px;
                    }
                }
                `}
            </style>

            {isSmallView ? (
                <WeatherWidgetSmall 
                    weather={weather} 
                    isLoading={isLoading} 
                    error={error} 
                />
            ) : (
                <WeatherWidgetLarge 
                    weather={weather} 
                    forecast={forecast} 
                    isLoading={isLoading} 
                    error={error} 
                />
            )}
        </>
    );
};

export default WeatherWidget;
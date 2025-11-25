// src/components/widget/Basic/weather/WeatherWidgetLarge.jsx

import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';

// 🔑 OpenWeather API Key
const WEATHER_API_KEY = "c85ddc5c02236a80149ee6ed1acd8bf9";

// 날씨 아이콘 매핑
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

const WeatherWidgetLarge = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // 현재 날씨
                const currentResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
                );

                if (!currentResponse.ok) {
                    throw new Error(`HTTP error! status: ${currentResponse.status}`);
                }

                const currentData = await currentResponse.json();
                
                setCurrentWeather({
                    temp: Math.round(currentData.main.temp),
                    tempMax: Math.round(currentData.main.temp_max),
                    tempMin: Math.round(currentData.main.temp_min),
                    icon: currentData.weather[0].icon,
                    city: currentData.name
                });

                // 5일 예보 (3시간 간격)
                const forecastResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
                );

                if (!forecastResponse.ok) {
                    throw new Error('예보 데이터를 가져올 수 없습니다.');
                }

                const forecastData = await forecastResponse.json();
                console.log('📊 예보 데이터:', forecastData);

                // 오늘 기준 6개 시간대 추출 (3시간 간격)
                const hourlyForecast = forecastData.list.slice(0, 6).map(item => {
                    const date = new Date(item.dt * 1000);
                    const hour = date.getHours();
                    
                    return {
                        time: `오후 ${hour > 12 ? hour - 12 : hour}시`,
                        temp: Math.round(item.main.temp),
                        icon: item.weather[0].icon
                    };
                });

                setForecast(hourlyForecast);

            } catch (err) {
                console.error('❌ 날씨 데이터를 가져오는 데 실패:', err);
                setError('날씨를 불러올 수 없습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeather();
        // 10분마다 업데이트
        const interval = setInterval(fetchWeather, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="weather-widget weather-large">
                <p className="weather-loading">날씨 로딩 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="weather-widget weather-large">
                <p className="weather-error">{error}</p>
            </div>
        );
    }

    return (
        <div className="weather-widget weather-large">
            {/* 상단: 현재 날씨 */}
            <div className="weather-current">
                <div className="weather-current-left">
                    <div className="weather-city-large">
                        {currentWeather.city} 📍
                    </div>
                    <div className="weather-current-temp-large">
                        {currentWeather.temp}°
                    </div>
                </div>
                <div className="weather-current-right">
                    <div className="weather-icon-large">
                        {WEATHER_ICONS[currentWeather.icon] || '☁️'}
                    </div>
                    <div className="weather-minmax-large">
                        최고: {currentWeather.tempMax}° 최저: {currentWeather.tempMin}°
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

export default WeatherWidgetLarge;
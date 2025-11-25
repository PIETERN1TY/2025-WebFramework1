// src/components/widget/Basic/weather/WeatherWidgetSmall.jsx

import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';

// 🔑 OpenWeather API Key
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

const WeatherWidgetSmall = () => {
    const [weather, setWeather] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // 서울 날씨 가져오기
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('📊 날씨 데이터:', data);

                setWeather({
                    temp: Math.round(data.main.temp),
                    tempMax: Math.round(data.main.temp_max),
                    tempMin: Math.round(data.main.temp_min),
                    icon: data.weather[0].icon,
                    description: data.weather[0].description,
                    city: data.name
                });
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
            <div className="weather-widget weather-small">
                <p className="weather-loading">날씨 로딩 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="weather-widget weather-small">
                <p className="weather-error">{error}</p>
            </div>
        );
    }

    return (
        <div className="weather-widget weather-small">
            {/* 도시명 */}
            <div className="weather-city">
                {weather.city} 📍
            </div>

            {/* 현재 온도 */}
            <div className="weather-current-temp">
                {weather.temp}°
            </div>

            {/* 날씨 아이콘 */}
            <div className="weather-icon-small">
                {WEATHER_ICONS[weather.icon] || '☁️'}
            </div>

            {/* 최고/최저 온도 */}
            <div className="weather-minmax">
                최고: {weather.tempMax}° 최저: {weather.tempMin}°
            </div>
        </div>
    );
};

export default WeatherWidgetSmall;
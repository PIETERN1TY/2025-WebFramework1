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
                // 1. 현재 날씨 가져오기
                const currentResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
                );

                if (!currentResponse.ok) {
                    throw new Error(`HTTP error! status: ${currentResponse.status}`);
                }

                const currentData = await currentResponse.json();
                console.log('📊 현재 날씨 데이터:', currentData);

                // 2. 예보 데이터로 향후 24시간의 최고/최저 구하기
                const forecastResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
                );

                if (!forecastResponse.ok) {
                    throw new Error('예보 데이터를 가져올 수 없습니다.');
                }

                const forecastData = await forecastResponse.json();
                console.log('📊 예보 데이터:', forecastData);

                // 향후 8개 데이터 (24시간, 3시간 간격)
                const next24Hours = forecastData.list.slice(0, 8);
                
                console.log('📅 향후 24시간 예보:', next24Hours);

                // 최고/최저 온도 계산
                let tempMax, tempMin;
                
                if (next24Hours.length > 0) {
                    const temps = next24Hours.map(f => f.main.temp);
                    tempMax = Math.round(Math.max(...temps));
                    tempMin = Math.round(Math.min(...temps));
                    
                    console.log('🌡️ 24시간 온도 범위:', temps);
                    console.log('🌡️ 계산된 최고:', tempMax, '최저:', tempMin);
                } else {
                    // fallback
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
                    최고: {weather.tempMax}° 최저: {weather.tempMin}°
                </div>
            </div>
        </div>
    );
};

export default WeatherWidgetSmall;
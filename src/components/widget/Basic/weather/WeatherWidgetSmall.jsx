// src/components/widgets/WeatherWidgetSmall.jsx (수정)

import React from 'react';
import './WeatherWidget.css';
import { FaChevronDown } from 'react-icons/fa';
import moonIcon from '../../../../assets/images/moon.png'; 

const HourlyItem = ({ time, temp, iconUrl }) => (
    <div className="weather-small-detail">
        <p style={{ margin: 0, fontSize: '0.9em' }}>{time}</p>
        <img src={iconUrl}/> {/* 이제 여기에 올바른 URL이 들어옵니다. */}
        <p style={{ margin: 0, fontWeight: 'bold' }}>{temp}°</p>
    </div>
);

const WeatherWidgetSmall = () => {
    return (
        <div className="weather-widget weather-small">
            <div className="weather-small-info">
                <h3 style={{ fontSize: '1.1em', margin: 0 }}>서울특별시 <FaChevronDown size={10} /></h3>
                <p style={{ margin: 0 }}>최고: 15° 최저: 9°</p>
            </div>
            <p className="weather-small-temp">12°</p>
            <div className="weather-small-hourly">
                <HourlyItem time="오후 10시" temp={11} iconUrl={moonIcon} />
                <HourlyItem time="오후 11시" temp={10} iconUrl={moonIcon} />
                <HourlyItem time="오전 12시" temp={9} iconUrl={moonIcon} />
                <HourlyItem time="오전 1시" temp={9} iconUrl={moonIcon} />
            </div>
        </div>
    );
};

export default WeatherWidgetSmall;
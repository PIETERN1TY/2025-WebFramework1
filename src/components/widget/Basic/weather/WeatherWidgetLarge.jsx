// src/components/widgets/WeatherWidgetLarge.jsx
import React from 'react';
import './WeatherWidget.css'; 
import { FaChevronDown } from 'react-icons/fa';
import moonIcon from '../../../../assets/images/moon.png'; 

const HourlyItem = ({ time, temp, iconUrl }) => (
    <div className="weather-small-detail">
        <p style={{ margin: 0, fontSize: '0.9em' }}>{time}</p>
        <img src={iconUrl}/>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{temp}°</p>
    </div>
);

const WeatherWidgetLarge = () => {
    return (
        <div className="weather-widget weather-large">
            <div className="weather-large-header">
                <h3 style={{ fontSize: '1.1em', margin: 0 }}>서울특별시 <FaChevronDown size={10} /></h3>
                <p style={{ margin: 0 }}>최고: 15° 최저: 9°</p>
            </div>
            <div className="weather-large-hourly">
                <HourlyItem time="오후 10시" temp={11} iconUrl={moonIcon} />
                <HourlyItem time="오후 11시" temp={10} iconUrl={moonIcon} />
                <HourlyItem time="오전 12시" temp={9} iconUrl={moonIcon} />
                <HourlyItem time="오전 1시" temp={9} iconUrl={moonIcon} />
            </div>
        </div>
    );
};

export default WeatherWidgetLarge;
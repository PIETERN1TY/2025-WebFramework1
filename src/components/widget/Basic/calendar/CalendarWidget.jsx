// src/components/widget/Basic/calendar/CalendarWidget.jsx

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './CalendarWidget.css'; 

const CalendarWidget = () => {
    const [value, onChange] = useState(new Date());

    return (
        <div className="calendar-widget-container">
            <Calendar 
                onChange={onChange}
                value={value}
                calendarType="gregory"
                formatDay={(locale, date) => date.toLocaleString("en", { day: "numeric" })}
                showNeighboringMonth={false}
                selectRange={false}
                locale="ko-KR"
                next2Label={null} // >> 버튼 숨기기
                prev2Label={null} // << 버튼 숨기기
            />
        </div>
    );
};

export default CalendarWidget;
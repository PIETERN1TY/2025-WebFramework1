import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './CalendarWidget.css'; 

const CalendarWidget = () => {
    // 캘린더의 현재 선택된 날짜 상태 관리
    const [value, onChange] = useState(new Date());

    return (
        <div className="calendar-widget-container">
            <Calendar 
                onChange={onChange} // 날짜 선택 시 호출되는 함수
                value={value} // 현재 값
                calendarType="gregory" // 달력 타입 (Gregorian calendar)
                formatDay={(locale, date) => date.toLocaleString("en", { day: "numeric" })} // 일(Day)만 보이도록 포맷
                showNeighboringMonth={false} // 이전/다음 달 날짜 숨기기
                selectRange={false} // 범위 선택 비활성화
                locale="ko-KR" // 한국어 로케일 설정
            />
        </div>
    );
};

export default CalendarWidget;
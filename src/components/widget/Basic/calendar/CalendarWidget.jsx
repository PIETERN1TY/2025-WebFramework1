import React, { useState, useMemo } from 'react';

const getThemeColor = (cssVariable, fallback) => {
    if (typeof window !== 'undefined') {
        return getComputedStyle(document.documentElement).getPropertyValue(cssVariable) || fallback;
    }
    return fallback;
};

const CalendarGrid = ({ currentDate, selectedDate, setSelectedDate }) => {
    const today = useMemo(() => new Date().toDateString(), []);
    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    
    // 현재 월의 첫 번째 날과 마지막 날 계산
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();

    // 달력 시작 요일 맞추기
    const startingDay = firstDay.getDay();

    const renderDays = () => {
        const days = [];
        
        // 이전 달의 날짜
        for (let i = 0; i < startingDay; i++) {
            days.push(<div key={`prev-${i}`} className="text-transparent p-2 text-sm"></div>);
        }

        // 현재 달의 날짜
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dateString = date.toDateString();
            const isToday = dateString === today;
            const isSelected = selectedDate && dateString === selectedDate.toDateString();
            
            const themeSecondary = getThemeColor('--theme-secondary', '#4a90e2');
            
            let classes = "p-2 text-[0.6em] font-medium rounded-full cursor-pointer transition-all duration-150 hover:bg-gray-100";
            let style = {};

            if (isSelected) {
                // 선택된 날짜 스타일
                classes = "p-2 text-sm font-bold rounded-full cursor-pointer transition-all duration-150 text-gray-800";
                style.backgroundColor = themeSecondary;
                style.color = getThemeColor('--theme-primary', '#1e3a5f');
            } else if (isToday) {
                // 오늘 날짜 스타일
                classes = "p-2 text-sm font-bold rounded-full cursor-pointer transition-all duration-150 text-gray-800";
                style.backgroundColor = themeSecondary + '66';
            }


            days.push(
                <div 
                    key={day} 
                    className={classes}
                    style={style}
                    onClick={() => setSelectedDate(date)}
                >
                    {day}
                </div>
            );
        }

        const totalCells = days.length;
        if (totalCells < 42) {
            for (let i = 0; i < 42 - totalCells; i++) {
                days.push(<div key={`next-${i}`} className="text-transparent p-2 text-sm"></div>);
            }
        }
        
        return days;
    };
    
    // 이전/다음 월로 이동 함수
    const handleNavigation = (offset) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setSelectedDate(newDate); // 선택된 날짜도 같이 이동시킴
    };

    return (
        <div className="text-gray-800">
            {/* 캘린더 헤더 */}
            <div className="flex justify-between items-center h-10 mb-2 font-bold">
                {/* 좌우 버튼 */}
                <button 
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-xl font-extrabold"
                    onClick={() => handleNavigation(-1)}
                    title="이전 달"
                >
                    &lt;
                </button>
                <div className="text-xl font-extrabold flex-1 text-center">
                    {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                </div>
                <button 
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-xl font-extrabold"
                    onClick={() => handleNavigation(1)}
                    title="다음 달"
                >
                    &gt;
                </button>
            </div>

            {/* 요일 표시 */}
            <div className="grid grid-cols-7 text-center text-[0.6em] font-extrabold text-gray-500 pb-1">
                <div>일</div>
                <div>월</div>
                <div>화</div>
                <div>수</div>
                <div>목</div>
                <div>금</div>
                <div>토</div>
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 text-center">
                {renderDays()}
            </div>
        </div>
    );
};


const CalendarWidget = () => {
    // 캘린더의 현재 표시 날짜 (CalendarGrid에 전달) 및 선택된 날짜를 하나의 상태로 관리
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div 
            className="p-2.5 h-full w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg border border-gray-100"
        >
            <CalendarGrid 
                currentDate={selectedDate} 
                selectedDate={selectedDate} 
                setSelectedDate={setSelectedDate} 
            />
        </div>
    );
};

export default CalendarWidget;
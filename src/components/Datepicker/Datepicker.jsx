import React, {useState} from 'react';
import chevronRight from "../../image/ChevronRight.svg"
import chevronLeft from "../../image/ChevronLeft.svg"

export const Datepicker = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [displayDate, setDisplayDate] = useState(new Date());
    const [isTodaySelected, setIsTodaySelected] = useState(true);
    const getDaysInMonth = (date) => {
        const month = date.getMonth();
        const year = date.getFullYear();
        return new Date(year, month + 1, 0).getDate();
    };
    const changeMonth = (increment) => {
        const newDate = new Date(displayDate);
        newDate.setMonth(displayDate.getMonth() + increment);
        setDisplayDate(newDate);
    };
    const selectDate = (day) => {
        const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
        setSelectedDate(newDate);
        setIsTodaySelected(false);
        document.getElementById('date').value = newDate.toLocaleDateString();
    };
    const resetToToday = () => {
        const today = new Date();
        setDisplayDate(today);
        setSelectedDate(today);
        setIsTodaySelected(true);
        document.getElementById('date').value = today.toLocaleDateString();
    };
    const renderDays = () => {
        const daysInMonth = getDaysInMonth(displayDate);
        const startDay = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1).getDay();
        // Приводим startDay к понедельнику
        const adjustedStartDay = (startDay === 0) ? 5 : startDay - 1;
        const days = [];
        const prevMonthDays = new Date(displayDate.getFullYear(), displayDate.getMonth(), 0).getDate();
        // Добавляем дни предыдущего месяца
        for (let i = adjustedStartDay; i >= 0; i--) {
            days.push(
                <div key={`prev-${i}`} className="day prev-month">
                    {prevMonthDays - i}
                </div>
            );
        }
        // Добавляем дни текущего месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === new Date().getDate() && displayDate.getMonth() === new Date().getMonth() && displayDate.getFullYear() === new Date().getFullYear();
            const isSelected = day === selectedDate.getDate() && displayDate.getMonth() === selectedDate.getMonth() && displayDate.getFullYear() === selectedDate.getFullYear();
            days.push(
                <div
                    key={day}
                    className={`day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => selectDate(day)}
                >
                    {day}
                </div>
            );
        }
        // Добавляем дни следующего месяца
        const totalCells = 42; // 6 рядов по 7 дней
        const remainingCells = totalCells - days.length;
        for (let day = 1; day <= remainingCells; day++) {
            days.push(
                <div key={`next-${day}`} className="day next-month">
                    {day}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="datepicker">
            <div className="header">
                <div className='monthInHeader'>
                    {displayDate.toLocaleString('default', {month: 'long'}).charAt(0).toUpperCase() +
                        displayDate.toLocaleString('default', {month: 'long'}).slice(1) + ' '}
                    {displayDate.getFullYear()}
                </div>
                <div className='monthChanger'>
                    <img src={chevronLeft} onClick={() => changeMonth(-1)}></img>
                    <input
                        type="radio"
                        name="reset"
                        checked={isTodaySelected}
                        className='radioInput'
                        onChange={resetToToday}
                    />
                    <img src={chevronRight} onClick={() => changeMonth(1)}></img>
                </div>
            </div>
            <div className="days">
                {renderDays()}
            </div>
        </div>
    )
}

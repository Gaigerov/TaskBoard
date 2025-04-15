import {FC, JSX, useState} from 'react';
import chevronRight from "../../image/ChevronRight.svg"
import chevronLeft from "../../image/ChevronLeft.svg"
import {useDispatch} from 'react-redux';
import {tasksActions} from '../../redux/tasksStore';

type Props = {
    onChangeDate: (date: string) => void;
}

export const Datepicker: FC<Props> = ({onChangeDate}) => {
    const dispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [displayDate, setDisplayDate] = useState<Date>(new Date());
    const [isTodaySelected, setIsTodaySelected] = useState<boolean>(true);

    const getDaysInMonth = (date: Date): number => {
        const month = date.getMonth();
        const year = date.getFullYear();
        return new Date(year, month + 1, 0).getDate();
    };

    const changeMonth = (increment: number): void => {
        const newDate = new Date(displayDate);
        newDate.setMonth(displayDate.getMonth() + increment);
        setDisplayDate(newDate);
    };

    const selectDate = (day: number): void => {
        const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
        setSelectedDate(newDate);
        setIsTodaySelected(false);
        onChangeDate(newDate.toLocaleDateString());
    };

    const resetToToday = (): void => {
        const today = new Date();
        setDisplayDate(today);
        setSelectedDate(today);
        setIsTodaySelected(true);
        dispatch(tasksActions.setDate(today.toLocaleDateString()));
        onChangeDate(today.toLocaleDateString());
    };
    
    const renderDays = (): JSX.Element[] => {
        const daysInMonth = getDaysInMonth(displayDate);
        const startDay = (new Date(displayDate.getFullYear(), displayDate.getMonth(), 1).getDay()) - 1;
        const adjustedStartDay = (startDay === 0) ? 6 : startDay - 1; // 0 (воскресенье) становится 6 (суббота)
        const days: JSX.Element[] = [];
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

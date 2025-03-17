import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {Task} from './Task';
import {DesktopTask} from './desktopTask';
import {useBreakpoint} from './breakpoints/useBreakpoint';
import chevronRight from "./image/ChevronRight.svg";
import chevronLeft from "./image/ChevronLeft.svg";

const parseDate = (dateString) => {
    const parts = dateString.split('.');
    return new Date(parts[2], parts[1] - 1, parts[0]);
};

export const TasksCalendar = ({onView, onEdit, onClone, onRemove}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [secondDate, setSecondDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
    const breakpoint = useBreakpoint();
    const tasks = useSelector((state) => state.tasks.tasks);

    const formatDateToDDMMYYYY = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Функция для проверки, попадает ли дата в текущую неделю
    const isDateInCurrentWeek = (date, currentDate) => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        const endOfWeek = new Date(currentDate);
        endOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 7);

        return date >= startOfWeek && date < endOfWeek;
    };

    const changeDate = (direction) => {
        const newCurrentDate = new Date(currentDate);
        if (direction === 'next') {
            if (breakpoint === 'desktop') {
                newCurrentDate.setDate(newCurrentDate.getDate() + 7);
            }
            newCurrentDate.setDate(newCurrentDate.getDate() + 1);
        } else if (direction === 'prev') {
            if (breakpoint === 'desktop') {
                newCurrentDate.setDate(newCurrentDate.getDate() - 7);
            }
            newCurrentDate.setDate(newCurrentDate.getDate() - 1);
        }
        setCurrentDate(newCurrentDate);
        setSecondDate(new Date(newCurrentDate.getTime() + 24 * 60 * 60 * 1000));
    };


    // Фильтрация задач в зависимости от breakpoint
    const filteredTasks = tasks.filter(task => {
        const taskDate = parseDate(task.date);
        if (breakpoint === 'mobile') {
            return taskDate.toDateString() === currentDate.toDateString();
        } else if (breakpoint === 'tablet') {
            return (
                taskDate.toDateString() === currentDate.toDateString() ||
                taskDate.toDateString() === new Date(currentDate.getTime() + 24 * 60 * 60 * 1000).toDateString()
            );
        } else if (breakpoint === 'desktop') {
            return isDateInCurrentWeek(taskDate, currentDate);
        }
        return false;
    });

    // Сортировка задач по времени
    const sortedTasks = filteredTasks.sort((a, b) => {
        const [aHours, aMinutes] = a.time.split(':').map(Number);
        const [bHours, bMinutes] = b.time.split(':').map(Number);
        return aHours !== bHours ? aHours - bHours : aMinutes - bMinutes;
    });

    // Группировка задач по времени
    const groupedTasksByTime = sortedTasks.reduce((acc, task) => {
        if (!acc[task.time]) {
            acc[task.time] = [];
        }
        acc[task.time].push(task);
        return acc;
    }, {});

    // Получаем все уникальные временные метки
    const uniqueTimes = Object.keys(groupedTasksByTime);

    const getWeekDates = (startDate) => {
        const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push({date, day: daysOfWeek[i]});
        }
        return dates;
    };

    const weekDates = getWeekDates(currentDate);

    return (
        <>
            {breakpoint === 'mobile' && (
                <>
                    <div className="dateInCalendarChanger">
                        <img src={chevronLeft} className='chevronButton' onClick={() => changeDate('prev')} />
                        <span className='dateInCalendar'>{formatDateToDDMMYYYY(currentDate)}</span>
                        {breakpoint === 'tablet' && (
                            <span className='dateInCalendar'>{formatDateToDDMMYYYY(secondDate)}</span>
                        )}

                        <img src={chevronRight} className='chevronButton' onClick={() => changeDate('next')} />
                    </div>
                    <div>
                        {uniqueTimes.map(time => {
                            const tasksForTimeCurrent = groupedTasksByTime[time].filter(task => parseDate(task.date).toDateString() === currentDate.toDateString());
                            return (
                                <>
                                    <span className='timeInCalendar'>{time}</span>
                                    <div key={time} className='tasksContainerMobile'>
                                        {tasksForTimeCurrent.length > 0 && (
                                            tasksForTimeCurrent.map(task => (
                                                <Task
                                                    key={task.id}
                                                    task={task}
                                                    onView={onView}
                                                    onEdit={onEdit}
                                                    onClone={onClone}
                                                    onRemove={onRemove}
                                                />
                                            ))
                                        )}
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </>
            )}
            {breakpoint === 'tablet' && (
                <>
                    <div className="dateInCalendarChanger">
                        <img src={chevronLeft} className='chevronButton' onClick={() => changeDate('prev')} />
                        <span className='dateInCalendar'>{formatDateToDDMMYYYY(currentDate)}</span>
                        <span className='dateInCalendar'>{formatDateToDDMMYYYY(secondDate)}</span>
                        <img src={chevronRight} className='chevronButton' onClick={() => changeDate('next')} />
                    </div>
                    <div>
                        {uniqueTimes.map(time => {
                            const tasksForTimeCurrent = groupedTasksByTime[time].filter(task => parseDate(task.date).toDateString() === currentDate.toDateString());
                            const tasksForTimeSecond = groupedTasksByTime[time].filter(task => parseDate(task.date).toDateString() === secondDate.toDateString());

                            return (
                                <>
                                    <span className='timeInCalendar'>{time}</span>
                                    <div key={time} className='tasksContainerTablet'>
                                        <div className='flexContainer'>
                                            {tasksForTimeCurrent.length > 0 ? (
                                                tasksForTimeCurrent.map(task => (
                                                    <Task
                                                        key={task.id}
                                                        task={task}
                                                        onView={onView}
                                                        onEdit={onEdit}
                                                        onClone={onClone}
                                                        onRemove={onRemove}
                                                    />
                                                ))
                                            ) : (
                                                <div style={{height: '50px', border: '1px dashed #ccc'}}></div> // Пустой контейнер
                                            )}
                                        </div>
                                        <div className='flexContainer'>
                                            {tasksForTimeSecond.length > 0 ? (
                                                tasksForTimeSecond.map(task => (
                                                    <Task
                                                        key={task.id}
                                                        task={task}
                                                        onView={onView}
                                                        onEdit={onEdit}
                                                        onClone={onClone}
                                                        onRemove={onRemove}
                                                    />
                                                ))
                                            ) : (
                                                <div style={{height: '50px', border: '1px dashed #ccc'}}></div> // Пустой контейнер
                                            )}
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </>
            )}

{breakpoint === 'desktop' && (
    <>
        <div className="dateInCalendarChanger">
            <img src={chevronLeft} className='chevronButton' onClick={() => changeDate('prev')} />
            <div className='datesInCalendar'>
                {weekDates.map((dateObj, index) => (
                    <div key={index} className='dateInCalendar'>
                        <span>{`${formatDateToDDMMYYYY(dateObj.date)}`}</span>
                        <span>{`${dateObj.day}`}</span>
                    </div>
                ))}
            </div>
            <img src={chevronRight} className='chevronButton' onClick={() => changeDate('next')} />
        </div>

        <div className='tasksOfCalendarDate'>
            {uniqueTimes.map(time => (
                <div key={time} className='timeSlot'>
                    <span className='timeInCalendar'>{time}</span>
                    <div className='tasksForTime'>
                        {Array.from({ length: 7 }, (_, index) => {
                            const date = new Date(currentDate);
                            date.setDate(currentDate.getDate() + index); // Увеличиваем дату на индекс
                            
                            // Фильтрация задач для текущей даты и времени
                            const tasksForTime = groupedTasksByTime[time].filter(task =>
                                parseDate(task.date).toDateString() === date.toDateString()
                            );

                            return (
                                <div key={index} className='taskOfCalendarDate'>
                                    {tasksForTime.length > 0 ? (
                                        tasksForTime.map(task => (
                                            <DesktopTask
                                                key={task.id}
                                                task={task}
                                                onView={onView}
                                            />
                                        ))
                                    ) : (
                                        <div style={{ height: '50px', border: '1px dashed #ccc' }}></div> // Пустой контейнер
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    </>
)}
        </>
    );
};

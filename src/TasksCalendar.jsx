import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {Task} from './Task';
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
    const currentTaskId = useSelector((state) => state.modal.currentTaskId);

    const formatDateToDDMMYYYY = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const currentDateFormatted = formatDateToDDMMYYYY(currentDate);

    // Функция для изменения даты
    const changeDate = (direction) => {
        if (breakpoint === 'tablet') {
            const newCurrentDate = new Date(currentDate);
            if (direction === 'next') {
                newCurrentDate.setDate(newCurrentDate.getDate() + 1);
            } else if (direction === 'prev') {
                newCurrentDate.setDate(newCurrentDate.getDate() - 1);
            }
            setCurrentDate(newCurrentDate);
            setSecondDate(new Date(newCurrentDate.getTime() + 24 * 60 * 60 * 1000)); // Устанавливаем вторую дату на один день позже
        } else {
            // Изменяем только текущую дату
            const newDate = new Date(currentDate);
            if (direction === 'next') {
                newDate.setDate(newDate.getDate() + 1);
            } else if (direction === 'prev') {
                newDate.setDate(newDate.getDate() - 1);
            }
            setCurrentDate(newDate);
        }
    };

    // Фильтрация задач по текущей дате и второй дате
    const filteredTasks = tasks.filter(task => {
        const taskDate = parseDate(task.date);
        return taskDate.toDateString() === currentDate.toDateString() || taskDate.toDateString() === secondDate.toDateString();
    });

    // Сортировка задач по времени (от меньшего к большему)
    const sortedTasks = filteredTasks.sort((a, b) => {
        const [aHours, aMinutes] = a.time.split(':').map(Number);
        const [bHours, bMinutes] = b.time.split(':').map(Number);
        return aHours !== bHours ? aHours - bHours : aMinutes - bMinutes;
    });

    // Группировка задач по времени
    const groupedTasks = sortedTasks.reduce((acc, task) => {
        const [hour] = task.time.split(':').map(Number);
        if (!acc[hour]) {
            acc[hour] = [];
        }
        acc[hour].push(task);
        return acc;
    }, {});

    return (
        <>
            <div className="dateInCalendarChanger">
                <img src={chevronLeft} className='chevronButton' onClick={() => changeDate('prev')} />
                <span className='dateInCalendar'>{currentDate.toLocaleDateString()}</span>
                {breakpoint === 'tablet' && (
                    <span className='dateInCalendar'>{secondDate.toLocaleDateString()}</span>
                )}
                <img src={chevronRight} className='chevronButton' onClick={() => changeDate('next')} />
            </div>
            <div className="listOfTasks">
                {Object.keys(groupedTasks).length === 0 ? (
                    <p>No tasks available for selected dates.</p>
                ) : (
                    Object.keys(groupedTasks)
                        .sort((a, b) => Number(a) - Number(b)) // Сортируем часы как числа
                        .map((hour) => (
                            <div key={hour} className="tasksInCalendar">
                                <h3 className="timeInCalendar">{hour}:00</h3>
                                {groupedTasks[hour].map((task) => {
                                    // Определяем, к какой дате относится задача
                                    const taskDate = task.date;
                                    const isFirstDate = taskDate === currentDateFormatted;

                                    const taskClass = isFirstDate ? 'first-date' : 'second-date';
                                    return (
                                        <Task
                                            key={task.id}
                                            taskClass={taskClass}
                                            task={task}
                                            searchedTasks={groupedTasks}
                                            currentTaskId={currentTaskId}
                                            onView={onView}
                                            onEdit={onEdit}
                                            onClone={onClone}
                                            onRemove={onRemove}
                                        />
                                    );
                                })}
                            </div>
                        ))
                )}
            </div>
        </>
    );
};

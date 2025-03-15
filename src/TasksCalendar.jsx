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

    const formatDateToDDMMYYYY = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const changeDate = (direction) => {
        const newCurrentDate = new Date(currentDate);
        if (direction === 'next') {
            newCurrentDate.setDate(newCurrentDate.getDate() + 1);
        } else if (direction === 'prev') {
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
            // Для desktop фильтруем задачи на текущую неделю
            const endOfWeek = new Date(currentDate);
            endOfWeek.setDate(endOfWeek.getDate() + 6); // Конец недели через 6 дней
            return taskDate >= currentDate && taskDate <= endOfWeek;
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

    return (
        <>
            <div className="dateInCalendarChanger">
                <img src={chevronLeft} className='chevronButton' onClick={() => changeDate('prev')} />
                <span className='dateInCalendar'>{formatDateToDDMMYYYY(currentDate)}</span>
                {breakpoint === 'tablet' && (
                    <span className='dateInCalendar'>{formatDateToDDMMYYYY(secondDate)}</span>
                )}

                <img src={chevronRight} className='chevronButton' onClick={() => changeDate('next')} />
            </div>
            {breakpoint === 'mobile' && (
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

            )}
            {breakpoint === 'tablet' && (
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
            )}
        </>
    );
};

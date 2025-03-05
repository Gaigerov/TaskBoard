import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {Task} from './Task';
import chevronRight from "./image/ChevronRight.svg";
import chevronLeft from "./image/ChevronLeft.svg";

const parseDate = (dateString) => {
    const parts = dateString.split('.');
    return new Date(parts[2], parts[1] - 1, parts[0]);
};

export const TasksCalendar = ({onView, onEdit, onClone, onRemove}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const tasks = useSelector((state) => state.tasks.tasks);
    const currentTaskId = useSelector((state) => state.modal.currentTaskId);

    // Функция для изменения даты
    const changeDate = (direction) => {
        const newDate = new Date(currentDate);
        if (direction === 'next') {
            newDate.setDate(newDate.getDate() + 1);
        } else if (direction === 'prev') {
            newDate.setDate(newDate.getDate() - 1);
        }
        setCurrentDate(newDate);
    };

    // Фильтрация задач по текущей дате
    const filteredTasks = tasks.filter(task => {
        const taskDate = parseDate(task.date);
        return taskDate.toDateString() === currentDate.toDateString();
    });

    // Сортировка задач по времени (от меньшего к большему)
    const sortedTasks = filteredTasks.sort((a, b) => {
        const [aHours, aMinutes] = a.time.split(':').map(Number);
        const [bHours, bMinutes] = b.time.split(':').map(Number);

        return aHours !== bHours ? aHours - bHours : aMinutes - bMinutes;
    });

    const groupedTasks = sortedTasks.reduce((acc, task) => {
        const [hour] = task.time.split(':').map(Number); 
        if (!acc[hour]) {
            acc[hour] = [];
        }
        acc[hour].push(task);
        return acc;
    }, {});

    return (
        <div className="listOfTasks">
            <div className="dateInCalendarChanger">
                <img src={chevronLeft} className='chevronButton' onClick={() => changeDate('prev')} />
                <span className='dateInCalendar'>{currentDate.toLocaleDateString()}</span>
                <img src={chevronRight} className='chevronButton' onClick={() => changeDate('next')} />
            </div>
            {Object.keys(groupedTasks).sort((a, b) => a - b).map(hour => (
                <div key={hour} className="tasksInCalendar">
                    <h3 className="timeInCalendar">{hour}:00</h3>
                    {groupedTasks[hour].map(task => (
                        <Task
                            key={task.id}
                            task={task}
                            searchedTasks={groupedTasks}
                            currentTaskId={currentTaskId}
                            onView={onView}
                            onEdit={onEdit}
                            onClone={onClone}
                            onRemove={onRemove}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

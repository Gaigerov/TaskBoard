import React, {useState, useEffect} from 'react';
import './config/App.css';
import {useGlobalStore, useSetGlobalStore} from './GlobalStoreContext';
import {useBreakpoint} from './breakpoints/useBreakpoint';
import {useSelector} from 'react-redux';
import {Tasks} from './Tasks';
import {Table} from './components/Table/Table';
import chevronRight from "./image/ChevronRight.svg"
import chevronLeft from "./image/ChevronLeft.svg"

export const Calendar = ({searchedTasks}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const breakpoint = useBreakpoint();
    const sortedTasks = searchedTasks.sort((a, b) => {
        const dateA = new Date(a.date.split('.').reverse().join('-') + 'T' + a.time);
        const dateB = new Date(b.date.split('.').reverse().join('-') + 'T' + b.time);

        return dateA - dateB;
    });

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const year = date.getFullYear();
        return `${day}.${month}.${year}`; // Формат DD.MM.YYYY
    };

    const changeDate = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + direction);
        setCurrentDate(newDate);
    };

    return (
        <>
            <div className='dateInCalendarChanger'>
                <img src={chevronLeft} onClick={() => changeDate(-1)}></img>
                <p className='dateInCalendar'>{formatDate(currentDate)}</p>
                <img src={chevronRight} onClick={() => changeDate(1)}></img>
            </div>
            <div className="tasksContainer">
                <div className="tasksContainer__scroller">
                    <div className='dateInCalendarContainer'>
                        <div className="taskInCalendar">
                            <ul className='ulTasksInCalendar'>
                                {breakpoint !== 'desktop' ?
                                    <Tasks searchedTasks={sortedTasks} /> :
                                    <Table searchedTasks={sortedTasks} />
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

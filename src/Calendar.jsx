import React, {useState} from 'react';
import './config/App.css';
import {useBreakpoint} from './breakpoints/useBreakpoint';
import {Tasks} from './Tasks';
import {Table} from './components/Table/Table';
import chevronRight from "./image/ChevronRight.svg";
import chevronLeft from "./image/ChevronLeft.svg";

export const Calendar = ({searchedTasks, currentTaskId, onView, onEdit, onClone, onRemove}) => {
    const [currentDateMobile, setCurrentDateMobile] = useState(new Date());
    const [currentDateTablet, setCurrentDateTablet] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    });
    const breakpoint = useBreakpoint();

    const sortedTasks = searchedTasks.sort((a, b) => {
        const dateA = new Date(a.date.split('.').reverse().join('-') + 'T' + a.time);
        const dateB = new Date(b.date.split('.').reverse().join('-') + 'T' + b.time);
        return dateA - dateB;
    });

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const changeMobileDate = (direction) => {
        const newDate = new Date(currentDateMobile);
        newDate.setDate(currentDateMobile.getDate() + direction);
        setCurrentDateMobile(newDate);
    };

    const changeTabletDate = (direction) => {
        const newTabletDate = new Date(currentDateTablet);
        newTabletDate.setDate(currentDateTablet.getDate() + direction);
        setCurrentDateTablet(newTabletDate);
    };

    const filteredTasks = sortedTasks.filter(task => {
        const taskDate = new Date(task.date.split('.').reverse().join('-'));
        return taskDate.toDateString() === currentDateMobile.toDateString();
    });

    const previousDate = new Date(currentDateTablet);
    previousDate.setDate(previousDate.getDate() - 1);

    return (
        <>
            <div className='dateInCalendarChanger'>
                {breakpoint === 'mobile' &&
                    <>
                        <img src={chevronLeft} className='chevronButton' onClick={() => changeMobileDate(-1)} />
                        <p className='dateInCalendar'>{formatDate(currentDateMobile)}</p>
                        <img src={chevronRight} className='chevronButton' onClick={() => changeMobileDate(1)} />
                    </>
                }
                {breakpoint === 'tablet' &&
                    <>
                        <img src={chevronLeft} className='chevronButton' onClick={() => {
                            changeTabletDate(-1);
                            setCurrentDateMobile(new Date(currentDateTablet));
                        }} />
                        <p className='dateInCalendar'>{formatDate(previousDate)}</p>
                        <p className='dateInCalendar'>{formatDate(currentDateTablet)}</p>
                        <img src={chevronRight} className='chevronButton' onClick={() => {
                            changeTabletDate(1);
                            setCurrentDateMobile(new Date(currentDateTablet));
                        }} />
                    </>
                }
            </div>
            <div className="tasksContainer">
                <div className="tasksContainer__scroller">
                    <div className="taskInCalendar">
                        <ul className='ulTasksInCalendar'>
                            {breakpoint !== 'desktop' ?
                                <Tasks
                                    searchedTasks={filteredTasks}
                                    currentTaskId={currentTaskId}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onClone={onClone}
                                    onRemove={onRemove}
                                /> :
                                <Table
                                    searchedTasks={filteredTasks}
                                    currentTaskId={currentTaskId}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onClone={onClone}
                                    onRemove={onRemove}
                                />
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

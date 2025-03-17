import React from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {useSelector} from 'react-redux';
import {VALID_MODE} from './constant';

export const DesktopTask = ({task, onView, taskClass}) => {
    const navigate = useNavigate();
    const currentTaskId = useSelector((state) => state.modal.currentTaskId);

    const handleNavigateToView = () => {
            navigate('/');
            navigate(`${VALID_MODE.VIEW}?id=${task.id}`);
            onView(task);
    }

    const taskDate = new Date(task.date.split('.').reverse().join('-'));
    const currentDate = new Date();
    const isPastDue = taskDate < currentDate && task.status !== 'Done';
    
    return (
        <div 
            className='taskContainerDesktopCalendar'
            onClick={() => handleNavigateToView(task)}
            style={{
                backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '',
            }}
        >
            <div className="taskContentDesktopCalendar">
                <div className='frameOfHeaderTask'>
                    <div className='textOfTaskCalendar'>
                        <h3 className="taskNameCalendar">{task.title}</h3>
                        <p className="taskDescriptionCalendar">{task.description}</p>
                    </div>
                </div>
                <div className='frameOfFooterTask'>
                        <p className="taskTimeCalendar" style={{color: isPastDue ? 'red' : 'var(--dark)'}}>
                            {task.time}
                        </p>
                </div>
            </div>
        </div>
    );
};

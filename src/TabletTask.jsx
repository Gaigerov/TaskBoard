import React from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {useSelector} from 'react-redux';
import {Popover} from './components/Popover/Popover';
import {VALID_MODE} from './constant';

export const TabletTask = ({task, onView}) => {
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
            className='taskContainer'
            onClick={() => handleNavigateToView(task)}
            style={{
                backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '',
            }}
        >
            <div className="taskContent">
                <div className='frameOfHeaderTask'>
                    <div className='textOfTask'>
                        <h3 className="taskName">{task.title}</h3>
                        <p className="taskDescription">{task.description}</p>
                    </div>
                </div>
                <div className='frameOfFooterTask'>
                    <Popover tableTask={task} />
                    <div className='frameOfTaskDate'>
                        <p className="taskTime" style={{color: isPastDue ? 'red' : 'var(--dark)'}}>
                            {task.time}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

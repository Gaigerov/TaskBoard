import React from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {useSelector} from 'react-redux';
import {VALID_MODE} from './constant';
import {TASK_STATUS} from './constant';

export const DesktopTask = ({task, onView}) => {
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

    const getStatusBackgroundColor = (status) => {
        switch (status) {
            case TASK_STATUS.TO_DO:
                return 'var(--light-grey)';
            case TASK_STATUS.INPROGRESS:
                return 'var(--primary-light)';
            case TASK_STATUS.DONE:
                return 'var(--success)';
            default:
                return '';
        }
    };

    // Получаем цвет фона для текущего статуса задачи
    const backgroundColor = getStatusBackgroundColor(task.status);

    return (
        <div
            className='taskContainerDesktopCalendar'
            onClick={() => handleNavigateToView(task)}
            style={{
                backgroundColor: currentTaskId === task.id ? 'var(--grey)' : backgroundColor,
            }}
        >
            <div className="taskContentDesktopCalendar">
                <div className='frameOfHeaderTask'>
                    <div className='textOfTaskCalendar'>
                        <p className="taskNameCalendar">{task.title}</p>
                        <p className="taskDescriptionCalendar">{task.description}</p>
                        <p className="taskTimeCalendar" style={{color: isPastDue ? 'red' : 'var(--light)'}}>
                            {task.time}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

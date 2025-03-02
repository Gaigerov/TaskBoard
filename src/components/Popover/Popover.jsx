import React, {useState, useEffect} from 'react';
import {TASK_STATUS, TASK_STATUSES} from '../../constant';
import {useSearchParams} from "react-router-dom";
import {useNotification} from '../Notification/NotificationContext';
import {useSelector, useDispatch} from 'react-redux';
import {tasksActions} from '../../redux/tasksStore';

export const Popover = ({tableTask}) => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.tasks);
    const showNotification = useNotification();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const currentTask = tasks?.find(task => task.id === Number(tableTask?.id || id));
    const initialStatus = currentTask ? currentTask.status : TASK_STATUS.TO_DO;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const handleClickOutside = (event) => {
        if (event.target.closest('.customSelect') === null) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        setSelectedStatus(initialStatus);
    }, [initialStatus]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    function updateTaskStatus(taskId, newStatus) {
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            dispatch(tasksActions.editTask({ id: taskId, task: {status: newStatus} }));
            showNotification(`Статус задачи '${taskToUpdate.title}' обновлён на '${newStatus}'`, 'info');
        } else {
            showNotification(`Задача с ID ${taskId} не найдена`, 'error');
        }
    }

    const handleStatusClick = (status) => {
        setSelectedStatus(status);
        updateTaskStatus(Number(tableTask?.id || id), status); 
        setIsOpen(false);
    };

    const getButtonClassName = (status) => {
        switch (status) {
            case TASK_STATUS.TO_DO:
                return 'toDoButton';
            case TASK_STATUS.INPROGRESS:
                return 'inProgressButton';
            case TASK_STATUS.DONE:
                return 'doneButton';
            default:
                return 'toDoButton';
        }
    }

    const getStatusClassName = (status) => {
        switch (status) {
            case TASK_STATUS.TO_DO:
                return 'customStatus toDoButton';
            case TASK_STATUS.INPROGRESS:
                return 'customStatus inProgressButton';
            case TASK_STATUS.DONE:
                return 'customStatus doneButton';
            default:
                return '';
        }
    };

    return (
        <div className="customSelector" onClick={(e) => e.stopPropagation()}>
            <div onClick={toggleDropdown} className={getButtonClassName(selectedStatus)}>
                {selectedStatus}
            </div>
            {isOpen && (
                <div className="statuses">
                    {TASK_STATUSES.map((status, index) => (
                        <div
                            key={`${status}-${index}`}
                            className={getStatusClassName(status)}
                            onClick={() => handleStatusClick(status)}
                        >
                            {status}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

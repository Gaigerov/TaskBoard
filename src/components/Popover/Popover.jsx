import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
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

    const currentTask = useMemo(() => {
        return tasks?.find(task => task.id === Number(tableTask?.id || id));
    }, [tasks, tableTask, id]);

    const initialStatus = currentTask ? currentTask.status : TASK_STATUS.TO_DO;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

    const updateTaskStatus = useCallback((taskId, newStatus) => {
        const currentTask = tasks.find(task => task.id === taskId); // Получаем текущую задачу из состояния
        if (currentTask) {
            dispatch(tasksActions.editTask({ id: taskId, status: newStatus })); // Передаем только id и новый статус
            showNotification(`Статус задачи '${currentTask.title}' обновлён на '${newStatus}'`, 'info');
        } else {
            showNotification(`Задача с ID ${taskId} не найдена`, 'error');
        }
    }, [dispatch, tasks, showNotification]);

    const handleStatusClick = (status) => {
        setSelectedStatus(status);
        updateTaskStatus(Number(tableTask?.id || id), status);
        setIsOpen(false);
    };

    const statusClassMap = {
        [TASK_STATUS.TO_DO]: 'customStatus toDoButton',
        [TASK_STATUS.INPROGRESS]: 'customStatus inProgressButton',
        [TASK_STATUS.DONE]: 'customStatus doneButton',
    };

    return (
        <div className="customSelector" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
            <div onClick={toggleDropdown} className={statusClassMap[selectedStatus]}>
                {selectedStatus}
            </div>
            {isOpen && (
                <div className="statuses">
                    {TASK_STATUSES.map((status) => (
                        <div
                            key={status}
                            className={statusClassMap[status]}
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

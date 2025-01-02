import React, {useState, useEffect} from 'react';
import {TASK_STATUS, TASK_STATUSES} from '../../constant';
import {useSearchParams} from "react-router-dom";
import {useGlobalStore} from "../../GlobalStoreContext";

export const Popover = ({newtask}) => {
    const {tasks} = useGlobalStore();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const task = tasks.find(task => task.id === Number(newtask || id));

    const initialStatus = task ? task.status : TASK_STATUS.TO_DO;
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
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    function updateTaskStatus(taskId, newStatus) {
        // Находим задачу по id и обновляем её статус
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            taskToUpdate.status = newStatus;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            console.log(`Статус задачи с ID ${taskId} обновлён на '${newStatus}'`);
        } else {
            console.log(`Задача с ID ${taskId} не найдена`);
        }
    }

    const handleStatusClick = (status) => {
        setSelectedStatus(status);
        updateTaskStatus(Number(newtask || id), status); // Обновляем статус задачи
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
        <div className="customSelect" onClick={(e) => e.stopPropagation()}>
            <div onClick={toggleDropdown} className={getButtonClassName(selectedStatus)}>
                {selectedStatus}
            </div>
            {isOpen && (
                <div className="statuses">
                    {TASK_STATUSES.map((status) => (
                        <div
                            key={status}
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

import React, {useState, useEffect} from 'react';
import {TASK_STATUS, TASK_STATUSES} from '../../constant';
import {useGlobalStore} from "../../GlobalStoreContext";
import {useSetGlobalStore} from "../../GlobalStoreContext";

export const Popover = () => {
    const setGlobalStore = useSetGlobalStore();
    const {status} = useGlobalStore();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(status);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
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

    const makeStatus = (status) => {
        setGlobalStore({
            status: status,
        });
    }

    const handleStatusClick = (status) => {
        makeStatus(status);
        setSelectedStatus(status);
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
            <div onClick={toggleDropdown} className={getButtonClassName(status)}>
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

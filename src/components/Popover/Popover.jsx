import React, {useState, useEffect} from 'react';
import { TASK_STATUS, TASK_STATUSES } from '../../constant';

export const Popover = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(TASK_STATUS.TO_DO);
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

    const handleStatusClick = (status) => {
        setSelectedStatus(status);
        setIsOpen(false);
    };

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
            <div onClick={toggleDropdown} className='toDoButton'>
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

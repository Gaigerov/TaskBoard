import React, {useState} from 'react';
import {
    Link,
    useNavigate,
} from "react-router-dom";

import editButton from './image/edit.svg';
import deleteButton from './image/delete.svg';
import cloneButton from './image/clone.svg';
import {VALID_MODE} from './constant';

export const Task = ({task, onEdit, onView, onDelete, onClone, currentTaskId}) => {
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    params.set("id", task.id);
    params.toString();

    const [isOpen, setIsOpen] = useState(false);

    const handleOpenPopup = () => {
        setIsOpen(true);
    };

    const handleClosePopup = () => {
        setIsOpen(false);
    };

    return (
        <div className="taskContainer" onClick={onView}
        style={{
            backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '', // Изменяем цвет фона
        }}
        >
        <div className="taskContent" onClick={() => navigate(`${VALID_MODE.VIEW}?${params}`)}>
            <div className='frameOfHeaderTask'>
                <div className='textOfTask'>
                        <h3 className="taskName">{task.title}</h3>
                        <p className="taskDescription">{task.description}</p>
                </div>
                <span className="controls" onClick={(e) => e.stopPropagation()}>
                    <Link to={`${VALID_MODE.EDIT}?${params}`} onClick={onEdit} className='iconButton'>
                            <img className="icon" src={editButton} />
                    </Link>
                    <Link onClick={() => {onClone(task.id)}} className='iconButton'>
                            <img className="icon" src={cloneButton} />
                    </Link>
                    <Link to={`${VALID_MODE.REMOVE}?${params}`} onClick={() => {onDelete(task.id)}} className='iconButton'>
                            <img className="icon" src={deleteButton} />
                    </Link>
                </span>
            </div>
            <div className='frameOfFooterTask'>
                <div className='statusButton'>
                    <div className="toDoButton" onClick={handleOpenPopup}>to Do
                    </div>
                    {/* {isOpen && (
                        <div className="statusContainer">
                            <div className="toDoButton">to Do</div>
                            <div className="inProgressButton">in progress</div>
                            <div className="doneButton">Done</div>
                        </div>
                    )} */}
                </div>
                <div className='frameOfTaskDate'>
                    <p className="taskTime">{task.time}</p>
                    <p className="taskDate">{task.date}</p>
                </div>
            </div>
        </div>
    </div>
    );
};

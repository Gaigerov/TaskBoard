import React from 'react';
import {
    Link,
    useNavigate,
} from "react-router-dom";

import {useGlobalStore} from './GlobalStoreContext';

const editButton = require('./image/edit.svg');
const deleteButton = require('./image/delete.svg');
const cloneButton = require('./image/clone.svg');

export const Task = ({task, onEdit, onView, onDelete, onClone, currentTaskId}) => {
    const {validMode, taskStatus} = useGlobalStore();

    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    params.set("id", task.id);
    params.toString();

    return (
        <div className="taskContainer" onClick={onView}
            style={{
                backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '', // Изменяем цвет фона
            }}>
            <div className="taskContent" onClick={() => navigate(`${validMode[1]}?${params}`)}>
                <h3 className="taskName">{task.title}</h3>
                <p className="taskDescription">{task.description}</p>
                <span className="controls" onClick={(e) => e.stopPropagation()}>
                    <span className="controlsContainer">
                        <Link to={`${validMode[2]}?${params}`} onClick={onEdit}>
                            <img className="editButton" src={editButton} />
                        </Link>
                        <Link onClick={() => {onClone(task.id)}}>
                            <img className="cloneButton" src={cloneButton} />
                        </Link>
                        <Link to={`${validMode[3]}?${params}`} onClick={() => {onDelete(task.id)}}>
                            <img className="deleteButton" src={deleteButton} />
                        </Link>
                    </span>
                </span>
                {taskStatus[0] && (
                    <>
                        <div className="toDoButton" onClick={(e) => e.stopPropagation()}>to Do
                            <div className="statusContainer">
                                <div className="toDoButton">to Do</div>
                                <div className="inProgressButton">in progress</div>
                                <div className="doneButton">Done</div>
                            </div>
                        </div>
                    </>
                )}
                <p className="taskDate">{task.date}</p>
            </div>
        </div>
    );
};

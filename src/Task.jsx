import React from 'react';
import {
    Link,
    useNavigate,
} from "react-router-dom";


import {useGlobalStore} from './GlobalStoreContext';

const editButton = require('../src/image/edit.svg');
const deleteButton = require('../src/image/delete.svg');
const cloneButton = require('../src/image/clone.png');

export const Task = ({task, onEdit, onView, onDelete, onClone}) => {
    const {currentTaskId} = useGlobalStore();

    const navigate = useNavigate();

    const url = new URL("http://localhost:3000");
    const params = new URLSearchParams(url.search);
    params.set("id", task.id);
    params.toString();

    // const id = params.get("id");

    return (
        <div className="btn taskContainer" onClick={onView}
            style={{
                backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '', // Изменяем цвет фона
            }}>
            <div className="taskContent" onClick={() => navigate(`view?${params}`)}>
                <h3 className="taskName">{task.title}</h3>
                <p className="taskDescription">{task.description}</p>
                <span className="controls" onClick={(e) => e.stopPropagation()}>
                    <span className="controlsContainer">
                        <Link to={`edit?${params}`} onClick={onEdit}>
                            <img className="editButton" src={editButton} />
                        </Link>
                        <Link onClick={() => {onClone(task.id)}}>
                            <img className="cloneButton" src={cloneButton} />
                        </Link>
                        <Link to={`remove?${params}`} onClick={() => {onDelete(task.id)}}>
                            <img className="deleteButton" src={deleteButton} />
                        </Link>
                    </span>
                </span>
                <p className="taskDate">{task.date}</p>
            </div>
        </div>
    );
};

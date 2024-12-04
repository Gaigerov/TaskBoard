import React from 'react';
import {
    Link,
    useNavigate,
} from "react-router-dom";

import {VALID_MODE} from '../constant';
import editButton from '../image/edit.svg'
import deleteButton from '../image/delete.svg';
import cloneButton from '../image/clone.svg';

export const Table = ({task, tasks, onView, onEdit, onClone, onDelete, currentTaskId}) => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    params.set("id", task.id);
    params.toString();

    return (
        <table className='tableContainer'>
            <thead>
                <tr className='trTitles'>
                    <th>
                        Status
                    </th>
                    <th>
                        Title
                    </th>
                    <th>
                        Description
                    </th>
                    <th>
                        Date
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => {
                    return (
                        <tr
                            key={task.id}
                            onClick={onView}
                            className='trContainer'
                            style={{
                                backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '', // Изменяем цвет фона
                            }}
                        >
                            <td>
                                <select defaultValue={'DEFAULT'} className='statusSelector'>
                                    <option value="DEFAULT" disabled selected className='statusSelector__selectStatus'>Select status</option>
                                    <option value="To Do" className='statusSelector__toDo'>To Do</option>
                                    <option value="In progress" className='statusSelector__inProgress'>In progress</option>
                                    <option value="Done" className='statusSelector__done'>Done</option>
                                </select>
                            </td>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td className='taskDateContainer'>
                                <span className='taskDateContainer_spanTime'>{task.time}</span>
                                <span className='taskDateContainer_spanDate'>{task.date}</span>
                            </td>
                            <td>
                                <span className="controls" onClick={(e) => e.stopPropagation()}>
                                    <Link to={`${VALID_MODE.EDIT}?${params}`} onClick={onEdit} className='iconButton'>
                                        <img className="icon editButton" src={editButton} />
                                    </Link>
                                    <Link onClick={() => {onClone(task.id)}} className='iconButton'>
                                        <img className="icon cloneButton" src={cloneButton} />
                                    </Link>
                                    <Link to={`${VALID_MODE.REMOVE}?${params}`} onClick={() => {onDelete(task.id)}} className='iconButton'>
                                        <img className="icon deleteButton" src={deleteButton} />
                                    </Link>
                                </span>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

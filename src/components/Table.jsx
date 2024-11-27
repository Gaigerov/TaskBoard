import React from 'react';
import {
    Link,
} from "react-router-dom";

import {VALID_MODE} from '../constant';
import editButton from '../image/edit.svg'
import deleteButton from '../image/delete.svg';
import cloneButton from '../image/clone.svg';

export const Table = ({tasks, onView, onEdit, onClone, onDelete}) => {
    const params = new URLSearchParams(window.location.search);
    params.set("id", tasks.map(task => {return task.id}));
    params.toString();

    return (
        <table className='tableContainer'>
            <thead>
                <tr className='titlesContainer'>
                    <th className='titlesNameContainer'>
                        <p className='titlesName'>
                            Status
                        </p>
                    </th>
                    <th className='titlesNameContainer'>
                        <p className='titlesName'>
                            Title
                        </p>
                    </th>
                    <th className='titlesNameContainer'>
                        <p className='titlesName'>
                            Description
                        </p>
                    </th>
                    <th className='titlesNameContainer'>
                        <p className='titlesName'>
                            Date
                        </p>
                    </th>
                    <th className='titlesNameContainer'></th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => {
                    return (
                        <tr
                            key={task.id}
                            onClick={onView}
                            className='trContainer'
                        >
                            <td>{'task.status'}</td>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.time}</td>
                            <td>{task.date}</td>
                            <td>
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
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

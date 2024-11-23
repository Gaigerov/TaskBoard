import React from 'react';
import {
    Link,
} from "react-router-dom";

// const params = new URLSearchParams(window.location.search);
// params.set("id", task.id);
// params.toString();

import {VALID_MODE} from '../constant';

export const Table = ({tasks, onView, onEdit, onClone, onDelete, currentTaskId}) => {

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
                        style={{
                            backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '', // Изменяем цвет фона
                        }}>
                        <td>{task.status}</td>
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>{task.time}</td>
                        <td>{task.date}</td>
                        <td>
                            {/* <span className="controls" onClick={(e) => e.stopPropagation()}>
                                <Link to={`${VALID_MODE.EDIT}?${params}`} onClick={onEdit} className='iconButton'>
                                    <img className="icon" src={editButton} />
                                </Link>
                                <Link onClick={() => {onClone(task.id)}} className='iconButton'>
                                    <img className="icon" src={cloneButton} />
                                </Link>
                                <Link to={`${VALID_MODE.REMOVE}?${params}`} onClick={() => {onDelete(task.id)}} className='iconButton'>
                                    <img className="icon" src={deleteButton} />
                                </Link>
                            </span> */}
                        </td>
                    </tr>
                    ) 
                })}
            </tbody>
        </table>
    )
}

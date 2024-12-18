import React, {useState} from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {Popover} from './Popover/Popover';
import {VALID_MODE} from '../constant';
import editButton from '../image/edit.svg'
import deleteButton from '../image/delete.svg';
import cloneButton from '../image/clone.svg';
import {PopoverRemove} from './PopoverRemove/PopoverRemove';

export const Table = ({searchedTasks, onView, onEdit, onClone, onRemove, currentTaskId}) => {
    const navigate = useNavigate();
    // const [isPopoverVisible, setPopoverVisible] = useState(false);

    // const handleNavigateToDelete = (task) => {
    //     setPopoverVisible(true);
    //     navigate(`${VALID_MODE.REMOVE}?id=${task.id}`);
    //     onRemove(task.id);
    // };

    // const closePopover = () => {
    //     setPopoverVisible(false);
    // };


    const handleNavigateToEdit = (task) => {
        navigate(`${VALID_MODE.EDIT}?id=${task.id}`);
        onEdit(task);
    }

    const handleNavigateToDelete = (task) => {
        navigate(`${VALID_MODE.REMOVE}?id=${task.id}`);
        onRemove(task.id);
    }

    const handleNavigateToView = (task) => {
        navigate(`${VALID_MODE.VIEW}?id=${task.id}`);
        onView(task);
    }


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
                {searchedTasks.map(task => {
                    return (
                        <tr
                            key={task.id}
                            onClick={() => handleNavigateToView(task)}
                            className='trContainer'
                            style={{
                                backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '', // Изменяем цвет фона
                            }}
                        >
                            <td>
                                <Popover content="Popover">
                                    <div>{task.status || 'To Do'}</div>
                                </Popover>
                            </td>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td className='taskDateContainer'>
                                <span className='taskDateContainer_spanTime'>{task.time}</span>
                                <span className='taskDateContainer_spanDate'>{task.date}</span>
                            </td>
                            <td>
                                <span className="controls" onClick={(e) => e.stopPropagation()}>
                                    <div onClick={() => handleNavigateToEdit(task)} className='iconButton'>
                                        <img className="icon editButton" src={editButton} />
                                    </div>
                                    <div onClick={() => onClone(task.id)} className='iconButton'>
                                        <img className="icon cloneButton" src={cloneButton} />
                                    </div>
                                    <div onClick={() => handleNavigateToDelete(task)} className='iconButton'>
                                        <img className="icon deleteButton" src={deleteButton} />
                                        {/* {isPopoverVisible && (
                                            <PopoverRemove
                                                onClose={closePopover}
                                                onRemove={onRemove}
                                            />
                                        )} */}
                                    </div>
                                </span>
                            </td>
                        </tr>
                    )
                })}
                <div className="gradient-top"></div>
                <div className="gradient-bottom"></div>
            </tbody>
        </table>
    )
}

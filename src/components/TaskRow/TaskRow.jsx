import React from 'react';
import {useSelector} from 'react-redux';
import {Popover} from '../Popover/Popover';
import {PopoverRemove} from '../PopoverRemove/PopoverRemove';
import editButton from '../../image/edit.svg'
import deleteButton from '../../image/delete.svg';
import cloneButton from '../../image/clone.svg';

export const TaskRow = ({ task, isPastDue, onNavigateToView, onNavigateToEdit, onClone, onDelete}) => {
    const currentTaskId = useSelector((state) => state.modal.currentTaskId);

    return (
        <tr
            onClick={() => onNavigateToView(task)}
            className='trContainer'
            style={{
                backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '',
            }}
        >
            <td>
                <Popover tableTask={task} />
            </td>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td className='taskDateContainer'>
                <div className='taskDateContainer_spanTime' style={{color: isPastDue ? 'red' : 'var(--dark)'}}>
                    {task.time}
                </div>
                <div className='taskDateContainer_spanDate' style={{color: isPastDue ? 'red' : 'var(--dark)'}}>
                    {task.date}
                </div>
            </td>
            <td>
                <div className="controls" onClick={(e) => e.stopPropagation()}>
                    <div onClick={() => onNavigateToEdit(task)} className='iconButton'>
                        <img className="icon editButton" src={editButton} alt="Edit" />
                    </div>
                    <div onClick={() => onClone(task.id)} className='iconButton'>


                        <img className="icon cloneButton" src={cloneButton} alt="Clone" />
                    </div>
                    <PopoverRemove task={task.id} onRemove={onDelete}>
                        <div className='iconButton'>
                            <img className="icon deleteButton" src={deleteButton} alt="Delete" />
                        </div>
                    </PopoverRemove>
                </div>
            </td>
        </tr>
    );
};

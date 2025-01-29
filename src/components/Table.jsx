import React, {useState} from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {useGlobalStore} from '../GlobalStoreContext';
import {Popover} from './Popover/Popover';
import {PopoverRemove} from './PopoverRemove/PopoverRemove';
import {VALID_MODE} from '../constant';
import editButton from '../image/edit.svg'
import deleteButton from '../image/delete.svg';
import cloneButton from '../image/clone.svg';
import {Pagination} from './Pagination/Pagination';

export const Table = ({searchedTasks, onView, onEdit, onClone, currentTaskId, deleteMode}) => {
    const navigate = useNavigate();
    const {tasksPerPage} = useGlobalStore();
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = searchedTasks.slice(indexOfFirstTask, indexOfLastTask);

    const handleNavigateToEdit = (task) => {
        navigate(`${VALID_MODE.EDIT}?id=${task.id}`);
        onEdit(task);
    }

    const handleNavigateToView = (task) => {
        navigate(`${VALID_MODE.VIEW}?id=${task.id}`);
        onView(task);
    }

    return (
        <div className='tablePageContainer'>
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
                    {currentTasks.map(task => {
                        const taskDate = new Date(task.date.split('.').reverse().join('-'));
                        const currentDate = new Date();
                        const isPastDue = taskDate < currentDate && task.status !== "Done";

                        return (
                            <tr
                                key={task.id}
                                onClick={() => handleNavigateToView(task)}
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
                                        <div onClick={() => handleNavigateToEdit(task)} className='iconButton'>
                                            <img className="icon editButton" src={editButton} alt="Edit" />
                                        </div>
                                        <div onClick={() => onClone(task.id)} className='iconButton'>
                                            <img className="icon cloneButton" src={cloneButton} alt="Clone" />
                                        </div>
                                        <PopoverRemove task={task.id} onRemove={deleteMode}>
                                            <div className='iconButton'>
                                                <img className="icon deleteButton" src={deleteButton} alt="Delete" />
                                            </div>
                                        </PopoverRemove>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Pagination
                searchedTasks={searchedTasks}
                tasksPerPage={tasksPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    )
}

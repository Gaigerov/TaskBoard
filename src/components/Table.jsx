import React, {useState} from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {CustomSelect} from './CustomSelect/CustomSelect';
import {Popover} from './Popover/Popover';
import {PopoverRemove} from './PopoverRemove/PopoverRemove';
import {VALID_MODE} from '../constant';
import {useGlobalStore} from '../GlobalStoreContext';
import editButton from '../image/edit.svg'
import deleteButton from '../image/delete.svg';
import cloneButton from '../image/clone.svg';
import chevronRight from "../image/ChevronRight.svg";
import chevronLeft from "../image/ChevronLeft.svg";
import chevronsRight from "../image/ChevronsRight.svg";
import chevronsLeft from "../image/ChevronsLeft.svg";

export const Table = ({searchedTasks, onView, onEdit, onClone, currentTaskId, deleteMode}) => {
    const navigate = useNavigate();
    const {tasksPerPage} = useGlobalStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState('');

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;

    const currentTasks = searchedTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(searchedTasks.length / tasksPerPage);

    const handleNavigateToEdit = (task) => {
        navigate(`${VALID_MODE.EDIT}?id=${task.id}`);
        onEdit(task);
    }

    const handleNavigateToView = (task) => {
        navigate(`${VALID_MODE.VIEW}?id=${task.id}`);
        onView(task);
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const handleInputChange = (event) => {
        const value = event.currentTarget.value;
        if (!isNaN(value) && value > 0 && value <= totalPages) {
            setPageInput(value);
            setCurrentPage(Number(value)); // Перейти на введенную страницу
        } else {
            setPageInput('');
        }
    };

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
                                    backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '', // Изменяем цвет фона
                                }}
                            >
                                <td>
                                    <Popover tableTask={task} />
                                </td>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td className='taskDateContainer'>
                                    <div className='taskDateContainer_spanTime' style={{color: isPastDue ? 'red' : 'var(--dark)'}}>{task.time}</div>
                                    <div className='taskDateContainer_spanDate' style={{color: isPastDue ? 'red' : 'var(--dark)'}}>{task.date}</div>
                                </td>
                                <td>
                                    <div className="controls" onClick={(e) => e.stopPropagation()}>
                                        <div onClick={() => handleNavigateToEdit(task)} className='iconButton'>
                                            <img className="icon editButton" src={editButton} />
                                        </div>
                                        <div onClick={() => onClone(task.id)} className='iconButton'>
                                            <img className="icon cloneButton" src={cloneButton} />
                                        </div>
                                        <PopoverRemove task={task.id} onRemove={deleteMode}>
                                            <div className='iconButton'>
                                                <img className="icon deleteButton" src={deleteButton} />
                                            </div>
                                        </PopoverRemove>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}

                </tbody>
                <td className="gradient-top"></td>
                <td className="gradient-bottom"></td>
            </table>
            <div className='footerContainer'>
                <div className="taskOnPageContainer">
                    <p className='labelTasksPerPage' htmlFor="tasksPerPage">Task on page</p>
                    <CustomSelect
                        options={[5, 10, 15, 20]}
                        value={tasksPerPage}
                    />
                </div>
                <div className="paginationPageNumber">
                    <img
                        src={chevronsLeft}
                        onClick={handleFirstPage}
                        style={{filter: currentPage === 1 ? 'invert(77%) sepia(8%) saturate(356%) hue-rotate(165deg) brightness(100%) contrast(83%)' : ''}}
                    />
                    <img
                        src={chevronLeft}
                        onClick={handlePrevPage}
                        style={{filter: currentPage === 1 ? 'invert(77%) sepia(8%) saturate(356%) hue-rotate(165deg) brightness(100%) contrast(83%)' : ''}}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageClick(index + 1)}
                            className={currentPage === index + 1 ? 'active pageActiveNumberButton' : 'pageNumberButton'}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <img
                        src={chevronRight} onClick={handleNextPage}
                        style={{filter: currentPage === totalPages ? 'invert(77%) sepia(8%) saturate(356%) hue-rotate(165deg) brightness(100%) contrast(83%)' : ''}}
                    />
                    <img
                        src={chevronsRight} onClick={handleLastPage}
                        style={{filter: currentPage === totalPages ? 'invert(77%) sepia(8%) saturate(356%) hue-rotate(165deg) brightness(100%) contrast(83%)' : ''}}
                    />
                </div>
                <div className='pageInputContainer'>
                    <p className='labelGoTo'>Go to page</p>
                    <input
                        type="text"
                        value={pageInput}
                        onChange={handleInputChange}
                        min="1"
                        max={totalPages}
                        placeholder={currentPage}
                        className="taskOnPageInput"
                    />
                </div>
            </div>
        </div>
    )
}

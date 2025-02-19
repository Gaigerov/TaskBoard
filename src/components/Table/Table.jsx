import React, {useState} from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {useSelector} from 'react-redux';
import {TaskRow} from '../TaskRow/TaskRow';
import {VALID_MODE} from '../../constant';
import {Pagination} from '../Pagination/Pagination';

export const Table = ({searchedTasks, onView, onEdit, onClone, currentTaskId, deleteMode}) => {
    const navigate = useNavigate();
    const tasksPerPage = useSelector((state) => state.tasks.tasksPerPage);
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
                {currentTasks.map((task) => {
                    const isPastDue = new Date(task.date) < new Date(); // Пример проверки на просроченность
                    return (
                        <TaskRow 
                            key={task.id} 
                            task={task} 
                            isPastDue={isPastDue}
                            onNavigateToView={handleNavigateToView}
                            onNavigateToEdit={handleNavigateToEdit}
                            onClone={onClone}
                            onDelete={deleteMode}
                            currentTaskId={currentTaskId}
                        />
                    );
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

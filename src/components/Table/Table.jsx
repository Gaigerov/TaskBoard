import React, {useState} from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {useSelector} from 'react-redux';
import {TaskRow} from '../TaskRow/TaskRow';
import {VALID_MODE} from '../../constant';
import {Pagination} from '../Pagination/Pagination';

export const Table = ({searchedTasks, onView, onEdit, onClone, deleteMode}) => {
    const navigate = useNavigate();
    const tasksPerPage = useSelector((state) => state.tasks.tasksPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = searchedTasks.slice(indexOfFirstTask, indexOfLastTask);

    const parseDDMMYYYY = (dateString) => {
        const [day, month, year] = dateString.split('.').map(Number);
        return new Date(year, month - 1, day); 
    };
    
    const currentDate = new Date();

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
                <thead className='tableHeadContainer'>
                    <tr className='trTitles'>
                        <th className='thContainer'>
                            Status
                        </th>
                        <th className='thContainer'>
                            Title
                        </th>
                        <th className='thContainer'>
                            Description
                        </th>
                        <th className='thContainer'>
                            Date
                        </th>
                        <th className='thContainer'></th>
                    </tr>
                </thead>
                <tbody className='tableBodyContainer'>
                    {currentTasks.map((task) => {
                        const taskDate = parseDDMMYYYY(task.date);
                        const isPastDue = taskDate < currentDate;
                        return (
                            <TaskRow
                                key={task.id}
                                task={task}
                                isPastDue={isPastDue}
                                onNavigateToView={handleNavigateToView}
                                onNavigateToEdit={handleNavigateToEdit}
                                onClone={onClone}
                                onDelete={deleteMode}
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

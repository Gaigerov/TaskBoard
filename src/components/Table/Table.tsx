import {useState, FC} from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {useSelector} from 'react-redux';
import {TaskRow} from '../TaskRow/TaskRow';
import {VALID_MODE} from '../../constant';
import {Pagination} from '../Pagination/Pagination';

interface Task {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    status: string;
}

interface TaskState {
    tasksPerPage: number;
}

interface Props {
    searchedTasks: Task[];
    onView: (task: Task) => void;
    onEdit: (task: Task) => void;
    onClone: (id: number) => void;
    deleteMode: (id: number) => void;
}

export const Table: FC<Props> = ({searchedTasks, onView, onEdit, onClone, deleteMode}) => {
    const navigate = useNavigate();
    const tasksPerPage = useSelector((state: {tasks: TaskState}) => state.tasks.tasksPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = searchedTasks.slice(indexOfFirstTask, indexOfLastTask);

    const parseDDMMYYYY = (dateString: string) => {
        const [day, month, year] = dateString.split('.').map(Number);
        return new Date(year, month - 1, day); 
    };
    
    const currentDate = new Date();

    const handleNavigateToEdit = (task: Task) => {
        navigate(`${VALID_MODE.EDIT}?id=${task.id}`);
        onEdit(task);
    }

    const handleNavigateToView = (task: Task) => {
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

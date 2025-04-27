import {FC} from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {useSelector} from 'react-redux';
import {Popover} from '../Popover/Popover';
import editButton from '../../image/edit.svg';
import deleteButton from '../../image/delete.svg';
import cloneButton from '../../image/clone.svg';
import {VALID_MODE} from '../../constant';

interface Task {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    status: string;
}

interface ModalState {
    currentTaskId: number | null,
}

interface TaskProps {
    task: Task;
    onEdit: (id: number) => void;
    onView: (id: number) => void;
    onRemove: (id: number) => void;
    onClone: (id: number) => void;
}

export const Task: FC<TaskProps> = ({task, onEdit, onView, onRemove, onClone}) => {
    const navigate = useNavigate();
    const currentTaskId = useSelector((state: {modal: ModalState}) => state.modal.currentTaskId);

    const handleNavigateToEdit = () => {
        navigate('/');
        navigate(`${VALID_MODE.EDIT}?id=${task.id}`);
        onEdit(task.id);
    }

    const handleNavigateToDelete = () => {
        navigate('/');
        navigate(`${VALID_MODE.REMOVE}?id=${task.id}`);
        onRemove(task.id);
    }

    const handleNavigateToView = () => {
        navigate('/');
        navigate(`${VALID_MODE.VIEW}?id=${task.id}`);
        onView(task.id);
    }

    const taskDate = new Date(task.date.split('.').reverse().join('-'));
    const currentDate = new Date();
    const isPastDue = taskDate < currentDate && task.status !== 'Done';

    return (
        <div
            className='taskContainer'
            onClick={handleNavigateToView}
            style={{
                backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '',
            }}
        >
            <div className="taskContent">
                <div className='frameOfHeaderTask'>
                    <div className='textOfTask'>
                        <h3 className="taskName">{task.title}</h3>
                        <p className="taskDescription">{task.description}</p>
                    </div>
                    <span className="controls" onClick={(e) => e.stopPropagation()}>
                        <div onClick={handleNavigateToEdit} className='iconButton'>
                            <img className="icon editButton" src={editButton} />
                        </div>
                        <div onClick={() => onClone(task.id)} className='iconButton'>
                            <img className="icon cloneButton" src={cloneButton} />
                        </div>
                        <div onClick={handleNavigateToDelete} className='iconButton'>
                            <img className="icon deleteButton" src={deleteButton} />
                        </div>
                    </span>
                </div>
                <div className='frameOfFooterTask'>
                    <Popover tableTask={task} />
                    <div className='frameOfTaskDate'>
                        <p className="taskTime" style={{color: isPastDue ? 'red' : 'var(--dark)'}}>
                            {task.time}
                        </p>
                        <p className="taskDate" style={{color: isPastDue ? 'red' : 'var(--dark)'}}>
                            {task.date}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

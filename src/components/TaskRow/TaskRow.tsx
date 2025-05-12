import {FC} from 'react';
import {useSelector} from 'react-redux';
import {Popover} from '../Popover/Popover';
import {PopoverRemove} from '../PopoverRemove/PopoverRemove';
import editButton from '../../image/edit.svg'
import deleteButton from '../../image/delete.svg';
import cloneButton from '../../image/clone.svg';
import {Task} from '../../types';

interface ModalState {
    currentTaskId: number;
}

interface Props {
    task: Task;
    isPastDue: boolean;
    onNavigateToView: (task: Task) => void;
    onNavigateToEdit: (task: Task) => void;
    onClone: (taskId: number) => void;
    onDelete: (id: number) => void;
}

export const TaskRow: FC<Props> = ({ task, isPastDue, onNavigateToView, onNavigateToEdit, onClone, onDelete}) => {
    const currentTaskId = useSelector((state: {modal: ModalState}) => state.modal.currentTaskId);

    return (
        <tr
            onClick={() => onNavigateToView(task)}
            className='tableRow'
            style={{
                backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '',
            }}
        >
            <td className='tableRow__ceil'>
                <Popover tableTask={task} />
            </td>
            <td className='tableRow__ceil'>{task.title}</td>
            <td className='tableRow__ceil'>{task.description}</td>
            <td className='tableRow__ceil taskDateContainer' style={{color: isPastDue ? 'red' : 'var(--dark)'}}>
                <div className='taskDateContainer__time'>
                    {task.time}
                </div>
                <div className='taskDateContainer__date'>
                    {task.date}
                </div>
            </td>
            <td className='tableRow__ceil'>
                <div className="controls" onClick={(e) => e.stopPropagation()}>
                    <div onClick={() => onNavigateToEdit(task)} className='iconButton'>
                        <img className="icon editButton" src={editButton} alt="Edit" />
                    </div>
                    <div onClick={() => onClone(task.id)}className='iconButton'>
                        <img className="icon cloneButton" src={cloneButton} alt="Clone" />
                    </div>
                    <PopoverRemove task={task} onRemove={onDelete}>
                        <div className='iconButton'>
                            <img className="icon deleteButton" src={deleteButton} alt="Delete" />
                        </div>
                    </PopoverRemove>
                </div>
            </td>
        </tr>
    );
};

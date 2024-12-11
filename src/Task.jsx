import React, {useState} from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {useGlobalStore} from './GlobalStoreContext';
import editButton from './image/edit.svg';
import deleteButton from './image/delete.svg';
import cloneButton from './image/clone.svg';
import {VALID_MODE} from './constant';

export const Task = ({searchedTasks, onEdit, onView, onDelete, onClone, currentTaskId}) => {
    const {tasks} = useGlobalStore();
    const navigate = useNavigate();
    // const params = new URLSearchParams(window.location.search);
    // params.set("id", task.id);
    // params.toString();


    const [isOpen, setIsOpen] = useState(false);

    const handleOpenPopup = () => {
        setIsOpen(true);
    };

    const handleClosePopup = () => {
        setIsOpen(false);
    };

    const handleNavigateToEdit = (task) => {
        navigate(`${VALID_MODE.EDIT}?id=${task.id}`);
        onEdit(task);
    }

    const handleNavigateToDelete = (task) => {
        navigate(`${VALID_MODE.REMOVE}?id=${task.id}`);
        onDelete(task.id);
    }

    const handleNavigateToView = (task) => {
        navigate(`${VALID_MODE.VIEW}?id=${task.id}`);
        onView(task);
    }

    return (
        <>
                {searchedTasks.map(task => 
                 <div key={task.id} className="taskContainer" onClick={() => handleNavigateToView(task)}
                 style={{
                     backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '', // Изменяем цвет фона
                 }}
             >
                 <div className="taskContent">
                     <div className='frameOfHeaderTask'>
                         <div className='textOfTask'>
                             <h3 className="taskName">{task.title}</h3>
                             <p className="taskDescription">{task.description}</p>
                         </div>
                         <span className="controls" onClick={(e) => e.stopPropagation()}>
                             <div onClick={() => handleNavigateToEdit(task)} className='iconButton'>
                                 <img className="icon editButton" src={editButton} />
                             </div>
                             <div onClick={() => onClone(task.id)} className='iconButton'>
                                 <img className="icon cloneButton" src={cloneButton} />
                             </div>
                             <div onClick={() => handleNavigateToDelete(task)} className='iconButton'>
                                 <img className="icon deleteButton" src={deleteButton} />
                             </div>
                         </span>
                     </div>
                     <div className='frameOfFooterTask'>
                         <div className='statusButton' onClick={(e) => e.stopPropagation()}>
                             {handleOpenPopup && (
                                 <div className="toDoButton" onClick={handleOpenPopup}>to Do
                                 </div>
                             )}
                             {isOpen && (
                                 <select className='statusSelector'>
                                     <option value="" disabled className='statusSelector__selectStatus'>Select status</option>
                                     <option value="To Do" className='statusSelector__toDo'>To Do</option>
                                     <option value="In progress" className='statusSelector__inProgress'>In progress</option>
                                     <option value="Done" className='statusSelector__done'>Done</option>
                                 </select>
                             )}
                         </div>
                         <div className='frameOfTaskDate'>
                             <p className="taskTime">{task.time}</p>
                             <p className="taskDate">{task.date}</p>
                         </div>
                     </div>
                 </div>
             </div>

)}
        </>


       
    );
};

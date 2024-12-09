import React, {useState} from 'react';
import {
    Link,
    useParams,
    useNavigate,
} from "react-router-dom";
import './config/App.css';
import {TaskModal} from './TaskModal';
import {Breakpoints} from './Breakpoints'
import {useGlobalStore} from './GlobalStoreContext';
import {useSetGlobalStore} from './GlobalStoreContext';
import plus from './image/plus.svg';
import search from './image/search.svg';
import filter from './image/filter.svg';


export const TaskBoard = () => {
    const setGlobalStore = useSetGlobalStore();

    const state = useGlobalStore();
    const {tasks} = state;
    const {mode} = useParams();
    const navigate = useNavigate();
    const [currentTaskId, setCurrentTaskId] = useState(null)
    const [searchValue, setSearchValue] = useState("");
    const [isOpenSearchInput, setIsOpenSearchInput] = useState(false);

    const handleChange = (event) => {
        setSearchValue(event.target.value);
    }

    const closeModal = () => {
        setCurrentTaskId(null);
        navigate('/')
    };

    const handleCreateTask = (newTask) => {
        const taskWithId = {...newTask, id: Date.now()}; // Генерация уникального ID
        const updatedTasks = [...tasks, taskWithId];
        setGlobalStore({
            tasks: updatedTasks,
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        closeModal();
    };

    const cloneTask = (id) => {
        const taskToClone = tasks.find(task => task.id === id);
        if (taskToClone) {
            const newTask = {
                ...taskToClone,
                title: 'Copy ' + taskToClone.title,
                id: Date.now()
            };
            const updatedTasks = [...tasks, newTask];
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setGlobalStore({
                tasks: [...tasks, newTask],
            });
        };
    };

    const handleEditTask = (updatedTask) => {
        const updatedTasks = tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
        );
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setGlobalStore({
            tasks: updatedTasks,
        });
        closeModal();
    };

    const handleDeleteTask = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setGlobalStore({
            tasks: updatedTasks,
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        closeModal();
    };

    const openCreateModal = () => {
        setCurrentTaskId(null);
        navigate('create');
    };

    const openFilterModal = () => {
        setCurrentTaskId(null);
        navigate('filter');
    };

    const openEditModal = (task) => {
        setCurrentTaskId(task.id);
    };

    const openViewModal = (task) => {
        setCurrentTaskId(task.id);
    };

    const openRemoveModal = (task) => {
        setCurrentTaskId(task.id);
    };

    const handleOpenSearchInput = () => {
        setIsOpenSearchInput(true);
    }

    return (
        <div className="taskBoard">
            <div className="headerContainer">
                <div className='taskFinderContainer'>
                    {!isOpenSearchInput && (
                        <div className='headerButtonsContainer'>
                            <div className='searchButtonContainer'>
                                <img className='searchButton' onClick={handleOpenSearchInput} src={search} />
                            </div>
                            <div className='filterButtonContainer'>
                                <Link to="/filter" onClick={openFilterModal}>
                                    <img className='filterButton' src={filter} />
                                </Link>
                            </div>
                        </div>
                    )}
                    {isOpenSearchInput && (
                        <input
                            id="searchInput"
                            type="text"
                            value={searchValue}
                            placeholder="Search"
                            className="headerFinderInput"
                            onChange={handleChange}
                        />
                    )}
                </div>
                <Link className="btn createButton" to="/create" onClick={openCreateModal}>
                    <img className="plusButton" src={plus} />
                    Create
                </Link>
            </div>
            <div className="tasksContainer">
                <div className="tasksContainer__scroller">
                        <Breakpoints
                            onView={openViewModal}
                            onEdit={openEditModal}
                            onClone={cloneTask}
                            onDelete={openRemoveModal}
                            currentTaskId={currentTaskId}
                        />
                </div>
            </div>
            <TaskModal
                task={tasks.find(task => {return task.id})}
                mode={mode}
                onCreate={handleCreateTask}
                onSave={handleEditTask}
                onEdit={openEditModal}
                onRemove={handleDeleteTask}
                onClose={closeModal}
                onClone={cloneTask}
            />
        </div>
    );
};

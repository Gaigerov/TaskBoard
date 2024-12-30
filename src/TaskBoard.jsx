import React, {useState, useEffect} from 'react';
import {
    useParams,
    useNavigate,
} from "react-router-dom";
import './config/App.css';
import {Button} from './components/Button/Button';
import {TaskModal} from './TaskModal';
import {Breakpoints} from './Breakpoints'
import {useGlobalStore} from './GlobalStoreContext';
import {useSetGlobalStore} from './GlobalStoreContext';
import loop from './image/search.svg';
import filter from './image/filter.svg';
import {FilterModal} from './components/FilterModal';

export const TaskBoard = () => {
    const setGlobalStore = useSetGlobalStore();
    const state = useGlobalStore();
    const {tasks, date} = state;
    const {mode} = useParams();
    const navigate = useNavigate();
    const [currentTaskId, setCurrentTaskId] = useState(null)
    const [isOpenSearchInput, setIsOpenSearchInput] = useState(false);

    const handleClickOutside = (event) => {
        if (!event.target.closest('.headerFinderInput')) {
            setIsOpenSearchInput(false);
           }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
        setGlobalStore({
            title: '',
            description: '',
            time: '',
            date: '',
        })
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
    const [search, setSearch] = useState('');
    const [filterDate, setFilterDate] = useState();
    const [filterStatus, setFilterStatus] = useState();

    const filteredTasks =
        filterDate ? tasks.filter(task => {
            task.date === filterDate;
        }) : tasks;

    const searchedTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()));

    const handleChange = event => {
        // const newSearchValue = event.currentTarget.value;
        // setGlobalStore({filterTo: {...state.filterTo, search: newSearchValue}});

        setSearch(event.currentTarget.value);
    };

const countChangedFields = () => {
    const initialFilterTo = {
        filterDate: 0,
    };
    let count = 0;
    // Сравниваем текущее состояние с начальными значениями
    for (const key in initialFilterTo) {
        if (initialFilterTo.hasOwnProperty(key) && date[key] !== initialFilterTo[key]) {
            count++;
        }
    }
    return count;
};

    const changedFieldsCount = countChangedFields();

    const handleSetDateFilter = (date) => {
        setFilterDate(date);
    };
    const handleSetStatusFilter = (status) => {
        setFilterStatus(status);
    };

    return (
        <div className="taskBoard">
            <div className="headerContainer">
                <div className='taskFinderContainer'>
                    <div className='headerButtonsContainer' style={{display: isOpenSearchInput ? 'none' : 'flex'}}>
                        <div className='searchButtonContainer' onClick={handleOpenSearchInput}>
                            <img className='searchButton' src={loop} />
                            {search !== '' && (
                                <div className='searchStatus'></div>
                            )}
                        </div>
                        <div className='filterButtonContainer'>
                            <div onClick={openFilterModal}>
                                <img className='filterButton' src={filter} />
                                {filterDate !== undefined && (
                                <div className='filterStatus'><span className='filterCounter'>{changedFieldsCount}</span></div>
                            )}
                            </div>
                        </div>
                    </div>
                    {isOpenSearchInput && (
                        <input
                            id="searchInput"
                            type="text"
                            placeholder="Search"
                            className="headerFinderInput"
                            onChange={handleChange}
                            value={search}
                        />
                    )}
                </div>
                <Button
                    type="createButton"
                    onClick={openCreateModal}
                    name="Create"
                />
            </div>
            <div className="tasksContainer">
                <div className="tasksContainer__scroller">
                    <Breakpoints
                        searchedTasks={searchedTasks}
                        onView={openViewModal}
                        onEdit={openEditModal}
                        onClone={cloneTask}
                        onRemove={openRemoveModal}
                        currentTaskId={currentTaskId}
                        deleteMode={handleDeleteTask}
                    />
                </div>
            </div>
            <TaskModal
                mode={mode}
                onCreate={handleCreateTask}
                onSave={handleEditTask}
                onEdit={openEditModal}
                onRemove={handleDeleteTask}
                onClose={closeModal}
                onClone={cloneTask}
                onFilter={() => handleSetDateFilter(date)}
            />
        </div>
    );
};

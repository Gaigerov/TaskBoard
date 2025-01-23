import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {ReactNotifications} from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
// import 'animate.css/animate.min.css';
// import 'animate.css/animate.compat.css'
import './config/App.css';
import {Button} from './components/Button/Button';
import {TaskModal} from './TaskModal';
import {Breakpoints} from './Breakpoints';
import {Notification} from './components/Notification/Notification';
import {useGlobalStore} from './GlobalStoreContext';
import {useSetGlobalStore} from './GlobalStoreContext';
import loop from './image/search.svg';
import filter from './image/filter.svg';

export const TaskBoard = () => {
    const setGlobalStore = useSetGlobalStore();
    const state = useGlobalStore();
    const {tasks, date} = state;
    const {mode} = useParams();
    const navigate = useNavigate();
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [isOpenSearchInput, setIsOpenSearchInput] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const handleShowNotification = () => {
        setNotifications((prevNotifications) => [
            ...prevNotifications,
            `Уведомление ${prevNotifications.length + 1}`,
        ]);
    };

    const handleCloseNotification = () => {
        setShowNotification(false);
    };

    const handleClickOutside = event => {
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
        navigate('/');
    };

    const handleCreateNotification = (type, message) => {
        setShowNotification(true);
        return <Notification type={`${type}`} message={`${message}`} />
    } 

    const handleCreateTask = newTask => {
        const taskWithId = {...newTask, id: Date.now()}; // Генерация уникального ID
        const updatedTasks = [...tasks, taskWithId];
        setGlobalStore({
            tasks: updatedTasks
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        handleCreateNotification('success', 'Задача успешно создана');
        closeModal();
    };

    const cloneTask = id => {
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
                tasks: [...tasks, newTask]
            });
        }
    };

    const handleEditTask = updatedTask => {
        const updatedTasks = tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setGlobalStore({
            tasks: updatedTasks
        });
        closeModal();
    };

    const handleDeleteTask = id => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setGlobalStore({
            tasks: updatedTasks
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
            date: ''
        });
        navigate('create');
    };

    const openFilterModal = () => {
        setCurrentTaskId(null);
        navigate('filter');
    };

    const openEditModal = task => {
        setCurrentTaskId(task.id);
    };

    const openViewModal = task => {
        setCurrentTaskId(task.id);
    };

    const openRemoveModal = task => {
        setCurrentTaskId(task.id);
    };

    const handleOpenSearchInput = () => {
        setIsOpenSearchInput(true);
    };

    // const filterAndSearchTasks = () => {
    //     return tasks.filter(task => {
    //         const matchesStatus = state.filterTo.filterStatus ? task.status === state.filterTo.filterStatus : true;
    //         const matchesDate = state.filterTo.filterDate ? task.date === state.filterTo.filterDate : true;
    //         const matchesSearch = task.title.toLowerCase().includes(state.filterTo.search.toLowerCase());

    //         return matchesStatus && matchesDate && matchesSearch;
    //     });
    // };

    const filteredTasks = tasks.filter(task => {
        const filterStatus = state.filterTo.filterStatus ? task.status === state.filterTo.filterStatus : true;
        const filterDate = state.filterTo.filterDate ? task.date === state.filterTo.filterDate : true;
        console.log('filteredT', filterStatus, filterDate)
        return filterStatus && filterDate;
    });

    const searchedTasks = filteredTasks.filter(task => {
        return task.title.toLowerCase().includes(state.filterTo.search.toLowerCase());
    });

    const handleChange = event => {
        const newSearchValue = event.currentTarget.value;
        setGlobalStore({
            filterTo: {
                ...state.filterTo,
                search: newSearchValue
            }
        });
    };

    const handleSetFilter = (date, status) => {
        setGlobalStore(prevState => ({
            ...prevState,
            filterTo: {
                ...prevState.filterTo,
                search: '',
                filterDate: date !== undefined ? date : prevState.filterTo.filterDate,
                filterStatus: status !== undefined ? status : prevState.filterTo.filterStatus
            }
        }));
    };

    const countChangedFields = () => {
        const initialFilterTo = {
            filterStatus: 0,
            filterDate: 0
        };
        return Object.keys(initialFilterTo).reduce((count, key) => {
            return count + (initialFilterTo[key] !== state.filterTo[key] ? 1 : 0);
        }, 0);
    };

    const changedFieldsCount = countChangedFields();

    return (
        <div className="taskBoard">
            <div className="headerContainer">
                <div className="taskFinderContainer">
                    <div className="headerButtonsContainer" style={{display: isOpenSearchInput ? 'none' : 'flex'}}>
                        <div className="searchButtonContainer" onClick={handleOpenSearchInput}>
                            <img className="searchButton" src={loop} />
                            {state.filterTo.search !== '' && <div className="searchStatus"></div>}
                        </div>
                        <div className="filterButtonContainer">
                            <div onClick={openFilterModal}>
                                <img className="filterButton" src={filter} />
                                {state.filterTo.filterDate !== undefined ||
                                    (state.filterTo.filterStatus !== undefined && (
                                        <div className="filterStatus">
                                            <span className="filterCounter">{changedFieldsCount}</span>
                                        </div>
                                    ))}
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
                            value={state.filterTo.search}
                        />
                    )}
                </div>
                <Button type="createButton" onClick={openCreateModal} name="Create" />
            </div>
            <div className="tasksContainer">
                <div className="tasksContainer__scroller">
                    <Breakpoints
                        searchedTasks={filteredTasks}
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
                onFilter={handleSetFilter}
            />
            {/* {notifications.map((index) => (
                <Notification
                    key={index}
                    type='success'
                    message='Задача успешно добавлена'
                    onClose={handleCloseNotification} />
            ))} */}
            <button onClick={handleShowNotification}>жми</button>
        </div>
    );
};

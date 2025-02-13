import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './config/App.css';
import {Menu} from './components/Menu/Menu';
import {DesktopMenu} from './components/DesktopMenu/DesktopMenu';
import {Button} from './components/Button/Button';
import {TaskModal} from './TaskModal';
import {Breakpoints} from './Breakpoints';
import {useGlobalStore, useSetGlobalStore} from './GlobalStoreContext';
import {useBreakpoint} from './breakpoints/useBreakpoint';
import {useNotification} from './components/Notification/NotificationContext';
import {useSelector, useDispatch} from 'react-redux';
import {tasksActions} from './redux/tasksStore';
import {modalActions} from './redux/modalStore';
import loop from './image/search.svg';
import filter from './image/filter.svg';
import desktopMenu from './image/desktop-menu.svg'

export const TaskBoard = () => {
    const setGlobalStore = useSetGlobalStore();
    const state = useGlobalStore();
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks);
    const modal = useSelector(state => state.modal);
    const {mode} = useParams();
    const navigate = useNavigate();
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [isOpenSearchInput, setIsOpenSearchInput] = useState(false);
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const breakpoint = useBreakpoint();
    const showNotification = useNotification();

    const handleClickOutside = event => {
        if (!event.target.closest('.headerFinderInput')) {
            setIsOpenSearchInput(false);
        }
    };

    useEffect(() => {
        dispatch(tasksActions.setInitialTasks(state.tasks));
    }, [dispatch, state.tasks]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const closeModal = () => {
        dispatch(modalActions.closeAllModals());
        navigate('/');
    };

    const openCreateModal = () => {
        dispatch(modalActions.openCreateModal());
        navigate('/create');
    };

    const openFilterModal = () => {
        dispatch(modalActions.openFilterModal());
        navigate('/filter');
    };

    const openEditModal = (task) => {
        dispatch(modalActions.openEditModal(task));
    };

    const openViewModal = (task) => {
        dispatch(modalActions.openViewModal(task));
    };

    const openRemoveModal = (task) => {
        dispatch(modalActions.openRemoveModal(task));
    };

    const handleCreateTask = (task) => {
        dispatch(tasksActions.addTask(task));
        showNotification('Задача создана успешно', 'success');
        closeModal();
    };

    const handleEditTask = (task) => {
        dispatch(tasksActions.editTask(task));
        showNotification('Задача отредактирована', 'success');
        closeModal();
    };

    const handleDeleteTask = (id) => {
        dispatch(tasksActions.removeTask({id}));
        showNotification('Задача удалена', 'success');
    };

    const cloneTask = (id) => {
        dispatch(tasksActions.cloneTask({id}));
        showNotification('Задача скопирована в конец списка', 'success');
    };

    const handleOpenSearchInput = () => {
        setIsOpenSearchInput(true);
    };

    const handleToggleMenu = () => {
        setIsOpenMenu(!isOpenMenu);
    };

    const filteredTasks = tasks.filter(task => {
        const filterStatus = state.filterTo.filterStatus ? task.status === state.filterTo.filterStatus : true;
        const filterDate = state.filterTo.filterDate ? task.date === state.filterTo.filterDate : true;
        return filterStatus && filterDate;
    });

    const searchedTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(state.filterTo.search.toLowerCase()));

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
        setGlobalStore({
            filterTo: {
                ...state.filterTo,
                filterDate: date !== undefined ? date : state.filterTo.filterDate,
                filterStatus: status !== undefined ? status : state.filterTo.filterStatus
            }
        });
    };

    const countChangedFields = () => {
        const initialFilterTo = {
            filterDate: undefined,
            filterStatus: undefined,
        };

        return Object.keys(initialFilterTo).reduce((count, key) => {
            const currentValue = state.filterTo[key];
            return count + (currentValue !== initialFilterTo[key] ? 1 : 0);
        }, 0);
    };

    const changedFieldsCount = countChangedFields();

    return (
        <div className="taskBoard">
            <div className="headerContainer">
                <div className="taskFinderContainer">
                    <div className="headerButtonsContainer" style={{display: isOpenSearchInput ? 'none' : 'flex'}}>
                        {breakpoint === 'desktop' &&
                            <div className="menuButtonContainer" onClick={handleToggleMenu}>
                                {isOpenMenu ? <DesktopMenu /> : null}
                                <img className="menuButton" src={desktopMenu} />
                            </div>
                        }
                        <div className="searchButtonContainer" onClick={handleOpenSearchInput}>
                            <img className="menuButton" src={loop} />
                            {state.filterTo.search !== '' && <div className="searchStatus"></div>}
                        </div>
                        <div className="filterButtonContainer">
                            <div onClick={openFilterModal}>
                                <img className="menuButton" src={filter} />
                                {(state.filterTo.filterDate !== undefined) ||
                                    (state.filterTo.filterStatus !== undefined) &&
                                    (
                                        <div className="filterStatus">
                                            <span className="filterCounter">{changedFieldsCount}</span>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                    {isOpenSearchInput && (
                        <input
                            id="searchInput"
                            type="text"
                            placeholder="Search..."
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
            {breakpoint !== 'desktop' &&
                <Menu />
            }
            {mode &&  
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
            }
        </div>
    );
};

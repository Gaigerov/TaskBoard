import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useNotification} from './components/Notification/NotificationContext';
import {useSelector, useDispatch} from 'react-redux';
import {useBreakpoint} from './breakpoints/useBreakpoint';
import './config/App.css';
import {TASK_STATUS} from './constant';

import {Menu} from './components/Menu/Menu';
import {DesktopMenu} from './components/DesktopMenu/DesktopMenu';
import {Button} from './components/Button/_Button';
import {TaskModal} from './components/TaskModal/TaskModal'; 
import {TaskBoard} from './components/TaskBoard/TaskBoard';
import {TasksCalendar} from './components/TasksCalendar/TasksCalendar';
import {tasksActions} from './redux/tasksStore';
import {modalActions} from './redux/modalStore';

import desktopMenu from './image/desktop-menu.svg';
import loop from './image/search.svg';
import filter from './image/filter.svg';

export const MainPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const breakpoint = useBreakpoint();
    const showNotification = useNotification();
    const {mode} = useParams();
    const tasks = useSelector((state) => state.tasks.tasks);
    const activePage = useSelector((state) => state.tasks.activePage);
    const filterTo = useSelector((state) => state.tasks.filterTo);
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [isOpenSearchInput, setIsOpenSearchInput] = useState(false);

    // Фильтрация задач
    const filteredTasks = tasks.filter(task => {
        const filterStatus = filterTo.filterStatus ? task.status === filterTo.filterStatus : true;
        const filterDate = filterTo.filterDate ? task.date === filterTo.filterDate : true;
        return filterStatus && filterDate;
    });

    const searchedTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(filterTo.search.toLowerCase())
    );

    const handleFilterChange = (newDate, newStatus) => {
        dispatch(tasksActions.setFilterTo({
            ...filterTo,
            filterDate: newDate,
            filterStatus: newStatus,
        }));
    };

    const handleClickOutside = event => {
        if (!event.target.closest('.headerFinderInput')) {
            setIsOpenSearchInput(false);
        }
    };

    // Эффект для добавления слушателя события клика
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOpenSearchInput = () => {
        setIsOpenSearchInput(true);
    };

    const handleToggleMenu = () => {
        setIsOpenMenu(!isOpenMenu);
    };

    // Обработчик изменения значения поиска
    const handleChange = (event) => {
        const value = event.currentTarget.value;
        dispatch(tasksActions.setFilterTo({
            ...filterTo,
            search: value,
        }));
    };

    const closeModal = () => {
        dispatch(modalActions.closeAllModals());
        navigate('/');
    };

    // Открытие модальных окон для создания, редактирования, просмотра и удаления задач
    const openCreateModal = () => {
        navigate('/create');
        dispatch(modalActions.openModal({ modalType: 'create' }));
    };

    const openEditModal = (task) => {
        dispatch(modalActions.openModal({ modalType: 'edit', payload: { id: task.id } }));
    };

    const openViewModal = (task) => {
        dispatch(modalActions.openModal({ modalType: 'view', payload: task }));
    };

    const openRemoveModal = (task) => {
        dispatch(modalActions.openModal({ modalType: 'remove', payload: { id: task.id } }));
    };

    const openFilterModal = () => {
        dispatch(modalActions.openModal({ modalType: 'filter' }));
        navigate('/filter');
    };

    const handleTaskAction = async (action, successMessage, errorMessage, params) => {
        try {
            await dispatch(action(params));
            showNotification(successMessage, 'success');
        } catch (error) {
            showNotification(errorMessage, 'error');
        } finally {
            closeModal();
        }
    };

    // Обработчики создания, редактирования, удаления и клонирования задач
    const handleCreateTask = (newTask) => {
        handleTaskAction(tasksActions.addTask, 'Задача создана успешно', 'Ошибка при создании задачи', newTask);
    };

    const handleEditTask = (task) => {
        handleTaskAction(tasksActions.editTask, 'Задача отредактирована', 'Ошибка при редактировании задачи', task);
    };

    const handleDeleteTask = (id) => {
        handleTaskAction(tasksActions.removeTask, 'Задача удалена', 'Ошибка при удалении задачи', {id});
    };

    const cloneTask = (id) => {
        handleTaskAction(tasksActions.cloneTask, 'Задача скопирована в конец списка', 'Ошибка при клонировании задачи', {id});
    };

    const countChangedFields = () => {
        const initialFilterTo = {
            filterDate: null,
            filterStatus: TASK_STATUS.EMPTY,
        };

        return Object.keys(initialFilterTo).reduce((count, key) => {
            const currentValue = filterTo[key];
            return count + (currentValue !== initialFilterTo[key] ? 1 : 0);
        }, 0);
    };

    const changedFieldsCount = countChangedFields();

    const renderPage = () => {
        switch (activePage) {
            case 'taskBoard':
                return <TaskBoard
                    searchedTasks={searchedTasks}
                    openEditModal={openEditModal}
                    openViewModal={openViewModal}
                    openRemoveModal={openRemoveModal}
                    cloneTask={cloneTask}
                    deleteMode={handleDeleteTask}
                />;
            case 'calendar':
                return <TasksCalendar
                    onView={openViewModal}
                    onEdit={openEditModal}
                    onClone={cloneTask}
                    onRemove={openRemoveModal}
                />;
            default:
                return null;
        }
    }

    return (
        <>
            <div className="pageContainer">
                <div className="headerContainer">
                    {activePage === 'taskBoard' && (
                        <div className="taskFinderContainer">
                            <div className="headerButtonsContainer" style={{display: isOpenSearchInput ? 'none' : 'flex'}}>
                                {breakpoint === 'desktop' && (
                                    <div className="menuButtonContainer" onClick={handleToggleMenu}>
                                        {isOpenMenu ? (
                                            <DesktopMenu
                                                goToTaskBoard={() => dispatch(tasksActions.setActivePage('taskBoard'))}
                                                goToCalendar={() => dispatch(tasksActions.setActivePage('calendar'))}
                                            />
                                        ) : null}
                                        <img className="menuButton" src={desktopMenu} alt="Menu" />
                                    </div>
                                )}
                                <div className="searchButtonContainer" onClick={handleOpenSearchInput}>
                                    <img className="menuButton" src={loop} alt="Search" />
                                    {filterTo.search !== '' && <div className="searchStatus"></div>}
                                </div>
                                <div className="filterButtonContainer">
                                    <div onClick={openFilterModal}>
                                        <img className="menuButton" src={filter} alt="Filter" />
                                        {changedFieldsCount > 0 &&
                                            (filterTo.filterDate !== undefined || filterTo.filterStatus !== undefined) && (
                                                <div className='filterStatusContainer'>
                                                    <div className="filterStatus">
                                                        <div className="filterCounter">{changedFieldsCount}</div>
                                                    </div>
                                                </div>
                                            )
                                        }
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
                                    value={filterTo.search}
                                />
                            )}
                        </div>
                    )}
                    {activePage === 'calendar' && (
                        <div className="taskFinderContainer">
                            <div className="headerButtonsContainer">
                                {breakpoint === 'desktop' && (
                                    <div className="menuButtonContainer" onClick={handleToggleMenu}>
                                        {isOpenMenu ? (
                                            <DesktopMenu
                                                goToTaskBoard={() => dispatch(tasksActions.setActivePage('taskBoard'))}
                                                goToCalendar={() => dispatch(tasksActions.setActivePage('calendar'))}
                                            />
                                        ) : null}
                                        <img className="menuButton" src={desktopMenu} alt="Menu" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <Button type="createButton" onClick={openCreateModal} name="Create" />
                </div>

                {renderPage()}

                {breakpoint !== 'desktop' &&
                    <Menu
                        goToTaskBoard={() => dispatch(tasksActions.setActivePage('taskBoard'))}
                        goToCalendar={() => dispatch(tasksActions.setActivePage('calendar'))}
                        goToBoard={() => dispatch(tasksActions.setActivePage('board'))}
                    />
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
                        onFilter={handleFilterChange}
                    />
                }
            </div>
        </>
    );
};

import {useState, useEffect, ChangeEvent, FC} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useNotification} from '../Notification/NotificationContext';
import {useSelector, useDispatch} from 'react-redux';
import {useBreakpoint} from '../../breakpoints/useBreakpoint';
import {TASK_STATUS, VALID_MODE} from '../../constant';
import {Menu} from '../Menu/Menu';
import {DesktopMenu} from '../DesktopMenu/DesktopMenu';
import {Button} from '../Button/Button';
import {TaskModal} from '../TaskModal/TaskModal';
import {TaskBoard} from '../TaskBoard/TaskBoard';
import {TasksCalendar} from '../TasksCalendar/TasksCalendar';
import {tasksActions} from '../../redux/tasksStore';
import {modalActions} from '../../redux/modalStore';

import desktopMenu from '../../image/desktop-menu.svg';
import loop from '../../image/search.svg';
import filter from '../../image/filter.svg';
import {Task} from '../../types';
import {RootState} from '../../redux/globalStore';

const objectKeys = <T extends Record<string, unknown>>(
    obj: T,
): Array<keyof T> => Object.keys(obj);

export const MainPage: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const breakpoint = useBreakpoint();
    const showNotification = useNotification();
    const {mode} = useParams<{mode?: string}>();
    const {title, description, date, time} = useSelector((state: RootState) => state.tasks);
    const data = useSelector((state: RootState) => state.tasks.data) as Task[];
    const activePage = useSelector((state: RootState) => state.tasks.activePage);
    const filterTo = useSelector((state: RootState) => state.tasks.filterTo);
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
    const [isOpenSearchInput, setIsOpenSearchInput] = useState<boolean>(false);
    const [currentTaskId, setCurrentTaskId] = useState<null | number>(null);

    // Фильтрация задач
    const filteredTasks = data.filter(task => {
        const filterStatus = filterTo.filterStatus ? task.status === filterTo.filterStatus : true;
        const filterDate = filterTo.filterDate ? task.date === filterTo.filterDate : true;
        return filterStatus && filterDate;
    });

    const searchedTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(filterTo.search.toLowerCase())
    );

    const handleFilterChange = (newDate: string, newStatus: string) => {
        dispatch(tasksActions.setFilterTo({
            ...filterTo,
            filterDate: newDate,
            filterStatus: newStatus,
        }));
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (event && !(event.target as HTMLElement).closest('.headerFinderInput')) {
            setIsOpenSearchInput(false);
        }
    };

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
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        dispatch(tasksActions.setFilterTo({
            ...filterTo,
            search: value,
        }));
    };

    const closeModal = () => {
        setCurrentTaskId(null);
        dispatch(modalActions.closeModal());
        navigate('/');
    };

    const openCreateModal = () => {
        const modalData = {
            title: '',
            description: '',
            time: '',
            date: ''
        };
        dispatch(modalActions.openModal({modalData}));
        navigate('create');
    };
    

    const openFilterModal = () => {
        setCurrentTaskId(null);
        navigate('filter'); 
    };

    const openEditModal = (id: number) => {
        setCurrentTaskId(id);
    };

    const openViewModal = (id: number) => {
        setCurrentTaskId(id);
    };

    const openRemoveModal = (id: number) => {
        setCurrentTaskId(id);
    };

    const handleCreateTask = () => {
        const newTask: Task = {
            id: Date.now(),
            title: title,
            description: description,
            time: time,
            date: date,
            status: TASK_STATUS.TO_DO,
        };
        if (!newTask.title || !newTask.description) {
            return;
        }
        try {
            dispatch(tasksActions.addTask(newTask));
            showNotification('Задача создана', 'success');
            dispatch(modalActions.closeModal());
        } catch (error) {
            showNotification('Ошибка при создании задачи!', 'error');
        }
    };

    const handleEditTask = (task: Task) => {
        dispatch(tasksActions.editTask(task));
        showNotification(`Задача успешно отредактирована`, 'success');
        dispatch(modalActions.closeModal());
    };

    const handleDeleteTask = (taskId: number) => {
        dispatch(tasksActions.removeTask(taskId));
        showNotification(`Задача с ID:${taskId} удалена`, 'success');
        dispatch(modalActions.closeModal());
    };
    
    const handleCloneTask = (taskId: number) => {
        const taskToClone = data.find(task => task.id === taskId);
        if (taskToClone) {
            const newTask: Task = {
                id: Date.now(), 
                title: taskToClone.title,
                description: taskToClone.description,
                time: taskToClone.time,
                date: taskToClone.date,
                status: TASK_STATUS.TO_DO,
            };
            dispatch(tasksActions.addTask(newTask));
            showNotification(`Задача с ID:${taskId} успешно скопирована`, 'success');
            dispatch(modalActions.closeModal());
        } else {
            showNotification(`Задача с ID:${taskId} не найдена`, 'error');
        }
    };

    const countChangedFields = () => {
        const initialFilterTo = {
            filterDate: null,
            filterStatus: TASK_STATUS.EMPTY,
        };

        return objectKeys(initialFilterTo).reduce((count, key) => {
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
                    cloneTask={handleCloneTask}
                    deleteMode={handleDeleteTask}
                />;
            case 'calendar':
                return <TasksCalendar
                    onView={openViewModal}
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
                    />
                }

                {mode &&
                    <TaskModal
                        mode={mode}
                        onCreate={handleCreateTask}
                        onSave={handleEditTask}
                        openEditModal={openEditModal}
                        onRemove={handleDeleteTask}
                        onClose={closeModal}
                        onClone={handleCloneTask}
                        onFilter={handleFilterChange}
                    />
                }
            </div>
        </>
    );
};

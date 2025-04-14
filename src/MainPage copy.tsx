import {useState, useEffect, ChangeEvent, FC} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useNotification} from './components/Notification/NotificationContext';
import {useSelector, useDispatch} from 'react-redux';
import {useBreakpoint} from './breakpoints/useBreakpoint';
import './config/App.css';
import {TASK_STATUS} from './constant';

import {Menu} from './components/Menu/Menu';
import {DesktopMenu} from './components/DesktopMenu/DesktopMenu';
import {Button} from './components/Button/Button';
import {TaskModal} from './TaskModal';
import {TaskBoard} from './TaskBoard';
import {TasksCalendar} from './TasksCalendar';
import {tasksActions} from './redux/tasksStore';
import {modalActions} from './redux/modalStore';

import desktopMenu from './image/desktop-menu.svg';
import loop from './image/search.svg';
import filter from './image/filter.svg';

interface FilterTo {
    search: string;
    filterDate?: string;
    filterStatus?: string;
}

interface Task {
    id: number;
    title: string;
    status: string;
    date: string;
}

interface RootState {
    tasks: {
        tasks: Task[];
        activePage: string;
        filterTo: FilterTo;
    };
}

interface Props {
    activePage: string;
    isOpenSearchInput: boolean;
    isOpenMenu: boolean;
    breakpoint: string;
    filterTo: {
        search: string;
        filterDate?: string;
        filterStatus?: string;
    };
    changedFieldsCount: number;
    handleToggleMenu: () => void;
    handleOpenSearchInput: () => void;
    openFilterModal: () => void;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const objectKeys = <T extends Record<string, unknown>>(
    obj: T,
  ): Array<keyof T> => Object.keys(obj);

export const MainPage: FC<Props> = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const breakpoint = useBreakpoint();
    const showNotification = useNotification();
    const {mode} = useParams<{mode?: string}>();
    const tasks = useSelector((state: RootState) => state.tasks.tasks) as Task[];
    const activePage = useSelector((state: RootState) => state.tasks.activePage);
    const filterTo = useSelector((state: RootState) => state.tasks.filterTo) as FilterTo;
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
    const [isOpenSearchInput, setIsOpenSearchInput] = useState<boolean>(false);

    type FilterKeys = keyof FilterTo;

    // Фильтрация задач
    const filteredTasks = tasks.filter(task => {
        const filterStatus = filterTo.filterStatus ? task.status === filterTo.filterStatus : true;
        const filterDate = filterTo.filterDate ? task.date === filterTo.filterDate : true;
        return filterStatus && filterDate;
    });

    const searchedTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(filterTo.search.toLowerCase())
    );

    const handleFilterChange = (key: FilterKeys, value: string) => {
        dispatch(tasksActions.setFilterTo({
            ...filterTo,
            [key]: value,
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
        dispatch(modalActions.closeAllModals());
        navigate('/');
    };

    // Открытие модальных окон для создания, редактирования, просмотра и удаления задач
    const openCreateModal = () => {
        navigate('/create');
        dispatch(modalActions.openModal({modalType: 'create'}));
    };

    const openEditModal = (task: Task) => {
        dispatch(modalActions.openModal({modalType: 'edit', payload: task}));
    };

    const openViewModal = (task: Task) => {
        dispatch(modalActions.openModal({modalType: 'view', payload: task}));
    };

    const openRemoveModal = (task: Task) => {
        dispatch(modalActions.openModal({modalType: 'remove', payload: {id: task.id}}));
    };

    const openFilterModal = () => {
        dispatch(modalActions.openModal({modalType: 'filter'}));
        navigate('/filter');
    };

    const handleTaskAction = async function (action: any, successMessage: string, errorMessage: string) {
        try {
            await dispatch(action());
            showNotification(successMessage, 'success');
        } catch (error) {
            showNotification(errorMessage, 'error');
        } finally {
            closeModal();
        }
    };

    // Обработчики создания, редактирования, удаления и клонирования задач
    const handleCreateTask = (newTask: Task) => {
        handleTaskAction(() => tasksActions.addTask(newTask), 'Задача создана успешно', 'Ошибка при создании задачи');
    };

    const handleEditTask = (task: Task) => {
        handleTaskAction(() => tasksActions.editTask(task), 'Задача отредактирована', 'Ошибка при редактировании задачи');
    };

    const handleDeleteTask = (id: number) => {
        handleTaskAction(() => tasksActions.removeTask(id), 'Задача удалена', 'Ошибка при удалении задачи');
    };

    const cloneTask = (id: number) => {
        handleTaskAction(() => tasksActions.cloneTask(id), 'Задача скопирована в конец списка', 'Ошибка при клонировании задачи');
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
                    cloneTask={cloneTask}
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
                        onClone={cloneTask}
                        onFilter={handleFilterChange}
                    />
                }
            </div>
        </>
    );
};

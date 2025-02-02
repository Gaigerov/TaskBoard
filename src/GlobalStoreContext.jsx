import React, {createContext, useContext, useState, useEffect} from 'react';
import {useNotification} from './components/Notification/NotificationContext';

export const GlobalStoreContext = createContext();

export const GlobalStoreController = ({children}) => {
    const showNotification = useNotification();
    const [tasks, setTasks] = useState(() => {
        const storedTasks = localStorage.getItem('tasks');
        let initialTasks = storedTasks ? JSON.parse(storedTasks) : [];

        if (!Array.isArray(initialTasks)) {
            console.log('ERROR')
            // showNotification('Данные в localStorage не являются массивом. Очищаем localStorage.', 'error');
            localStorage.removeItem('tasks');
            initialTasks = [];
        } else {
            initialTasks = initialTasks.filter((task, id) => {
                const isValid = task.title && task.description && task.time && task.date;
                if (!isValid) {
                    console.log('ERROR')
                    // showNotification(`Задача с индексом ${id} некорректна. Убедитесь, что все поля заполнены., 'error'`);
                }
                return isValid;
            });
        }
        return initialTasks;
    });

    const [state, setState] = useState({
        tasks: tasks,
        title: '',
        description: '',
        time: '',
        date: '',

        isDirty: false,

        filterTo: {
            search: '',
            filterDate: undefined,
            filterStatus: undefined,
        },

        tasksPerPage: 10,

        errors: {
            title: '',
            description: '',
            time: '',
            date: '',
        },
    });

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        setState(prevState => ({
            ...prevState,
            tasks: tasks,
        }));
    }, [tasks]);

    return (
        <GlobalStoreContext.Provider
            value={{
                state,
                setState,
                setTasks,
            }}
        >
            {children}
        </GlobalStoreContext.Provider>
    );
};

export const useGlobalStore = () => {
    const { state } = useContext(GlobalStoreContext);
    return state;
};

export const useSetGlobalStoreTasks = () => {
    const { setTasks } = useContext(GlobalStoreContext);
    const handleSetNewTasks = (newTasks) => {
        setTasks(newTasks);
    };
    return handleSetNewTasks;
};

export const useSetGlobalStore = () => {
    const { setState } = useContext(GlobalStoreContext);
    const handleSetState = (newState) => {
        setState(prevState => ({
            ...prevState,
            ...newState,
        }));
    };
    return handleSetState;
};

import React, {createContext, useContext, useState, useEffect} from 'react';
import {useNotification} from './components/Notification/NotificationContext';
import {TASK_STATUS} from './constant';

export const GlobalStoreContext = createContext();

export const GlobalStoreController = ({children}) => {
    const showNotification = useNotification();
    const [tasks] = useState(() => {
        const storedTasks = localStorage.getItem('tasks');

        function jsonParse(data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                return undefined;
            }
        }

        let initialTasks = jsonParse(storedTasks) || [];

        if (!Array.isArray(initialTasks)) {
            console.log('Отсутствует массив данных');
            localStorage.removeItem('tasks');
            initialTasks = [];
        } else {
            initialTasks = initialTasks.filter((task) => {
                const isValid = task.title && task.description && task.time && task.date;
                if (!isValid) {
                    console.log('Не все данные у задачи');
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
            filterDate: null,
            filterStatus: TASK_STATUS.EMPTY,
        },
        tasksPerPage: 10,
        errors: {
            title: '',
            description: '',
            time: '',
            date: '',
        },
        activePage: 'taskBoard',
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
            }}
        >
            {children}
        </GlobalStoreContext.Provider>
    );
};

export const useGlobalStore = () => {
    const {state} = useContext(GlobalStoreContext);
    return state
};

export const useSetGlobalStoreTasks = () => {
    const {setState} = useContext(GlobalStoreContext);
    return (newTasks) => setState((prevState) => ({
        ...prevState,
        tasks: newTasks,
    }));
};

export const useSetGlobalStore = () => {
    const {setState} = useContext(GlobalStoreContext);
    return (newState) => {
        setState(prevState => {
            const x = {
                ...prevState,
                ...newState,
            }
            return x
})
    };
};

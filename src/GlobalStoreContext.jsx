import React, {createContext, useContext, useState} from 'react';
import {TASK_STATUS} from './constant';

export const GlobalStoreContext = createContext();

const storedTasks = localStorage.getItem('tasks');
const tasks = storedTasks ? JSON.parse(storedTasks) : [];

export const GlobalStoreController = ({children}) => {

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
    return state;
};

export const useSetGlobalStoreTasks = () => {
    const {setState} = useContext(GlobalStoreContext);
    const handleSetNewTasks = (newTasks) => {
        localStorage.setItem('tasks', JSON.stringify(newTasks));
        setState(state => {
            return {
                ...state,
                tasks: newTasks,
            }
        })
    }
    return handleSetNewTasks;
}

export const useSetGlobalStore = () => {
    const {setState} = useContext(GlobalStoreContext);
    const handleSetState = (newState) => {
        setState(state => {
            return {
                ...state, ...newState,
            }
        })
    }
    return handleSetState;
};

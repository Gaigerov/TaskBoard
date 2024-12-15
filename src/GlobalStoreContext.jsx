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
        status: TASK_STATUS.TO_DO,

        isDirty: false,
       
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

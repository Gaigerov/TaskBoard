import {createSlice} from '@reduxjs/toolkit';
import {TASK_STATUS} from '../constant';
import { v4 as uuidv4 } from 'uuid';

const loadTasksFromLocalStorage = () => {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
        try {
            return JSON.parse(tasks);
        } catch (error) {
            console.error('Error parsing JSON from localStorage:', error);
            return []; 
        }
    }
    return []; 
};

const saveTasksToLocalStorage = (tasks) => {
    if (Array.isArray(tasks)) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } else {
        console.warn('Attempted to save non-array tasks to localStorage:', tasks);
    }
};

const initialState = {
    tasks: loadTasksFromLocalStorage() || [],
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
    activePage: 'taskBoard',
};

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action) => {
            const taskWithId = {...action.payload, id: Date.now()};
            state.tasks.push(taskWithId);
            saveTasksToLocalStorage(state.tasks);
        },
        editTask: (state, action) => {
            const foundedTaskIndex = state.tasks.findIndex(task => task.id === action.payload.id);
            if (foundedTaskIndex >= 0) {
                state.tasks[foundedTaskIndex] = {...state.tasks[foundedTaskIndex], ...action.payload.task};
                saveTasksToLocalStorage(state.tasks); 
            } else {
                console.warn(`Task with id ${action.payload.id} not found.`);
            }
        },
        removeTask: (state, action) => {
            const indexToRemove = state.tasks.findIndex(task => task.id === action.payload.id);
            if (indexToRemove >= 0) {
                state.tasks.splice(indexToRemove, 1);
                saveTasksToLocalStorage(state.tasks);
            }
        },
        cloneTask: (state, action) => {
            const taskToClone = state.tasks.find(task => task.id === action.payload.id);
            if (taskToClone) {
                const newTask = {
                    ...taskToClone,
                    title: 'Copy ' + taskToClone.title,
                    id: Date.now(),
                };
                state.tasks.push(newTask);
                saveTasksToLocalStorage(state.tasks);
            }
        },
        updateTask: (state, action) => {
            const {id, title, description, time, date, status} = action.payload;
            const taskIndex = state.tasks.findIndex(task => task.id === id);
            if (taskIndex >= 0) {
                state.tasks[taskIndex] = {...state.tasks[taskIndex], title, description, time, date, status};
                saveTasksToLocalStorage(state.tasks);
            }
        },   
        clearTasks(state) {
            state.tasks = [];
            saveTasksToLocalStorage(state.tasks); 
        },
        setActivePage(state, action) {
            state.activePage = action.payload;
        },
        setTitle(state, action) {
            state.title = action.payload;
            state.isDirty = true;
        },
        setDescription(state, action) {
            state.description = action.payload;
            state.isDirty = true; 
        },
        setTime(state, action) {
            state.time = action.payload;
            state.isDirty = true;
        },
        setDate(state, action) {
            state.date = action.payload;
            state.isDirty = true; 
        },
        setFilter: (state, action) => {
            const {filterDate, filterStatus} = action.payload || {};
            if (filterDate !== undefined) {
                state.filterTo.filterDate = filterDate;
            }
            if (filterStatus !== undefined) {
                state.filterTo.filterStatus = filterStatus;
            }
        },
        setFilterTo: (state, action) => {
            state.filterTo = action.payload;
        },
    },
});

export const tasksActions = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;

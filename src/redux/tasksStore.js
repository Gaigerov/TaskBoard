import {createSlice} from '@reduxjs/toolkit';
import {TASK_STATUS} from '../constant';

const initialState = {
    tasks: [],
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
};

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action) => {
            const taskWithId = { ...action.payload, id: Date.now() };
            state.tasks.push(taskWithId);
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
        },

        editTask: (state, action) => {
            const foundedTaskIndex = state.tasks.findIndex(task => task.id === action.payload.id);
            if (foundedTaskIndex >= 0) {
                state.tasks[foundedTaskIndex] = { ...state.tasks[foundedTaskIndex], ...action.payload.task };
                localStorage.setItem('tasks', JSON.stringify(state.tasks)); 
            }
        },

        removeTask: (state, action) => {
            const indexToRemove = state.tasks.findIndex(task => task.id === action.payload.id);
            if (indexToRemove >= 0) {
                state.tasks.splice(indexToRemove, 1);
                localStorage.setItem('tasks', JSON.stringify(state.tasks));
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
                localStorage.setItem('tasks', JSON.stringify(state.tasks)); 
            }
        },

        updateTask: (state, action) => {
            const {title, description, time, date} = action.payload;
            state.title = title;
            state.description = description;
            state.time = time;
            state.date = date;
        },

        setInitialTasks: (state, action) => {
            state.tasks = action.payload; 
            state.title = '';
            state.description = '';
            state.time = '';
            state.date = '';
            localStorage.setItem('tasks', JSON.stringify(state.tasks)); 
        },

        setField: (state, action) => {
            const {field, value} = action.payload;
            state[field] = value;
        },

        setFilter: (state, action) => {
            const {filterDate, filterStatus} = action.payload;
            if (filterDate !== undefined) {
                state.filterTo.filterDate = filterDate;
            }
            if (filterStatus !== undefined) {
                state.filterTo.filterStatus = filterStatus;
            }
        },
        
        setErrors(state, action) {
            const { title, description, time, date } = action.payload;
            state.errors.title = title || '';
            state.errors.description = description || '';
            state.errors.time = time || '';
            state.errors.date = date || '';
        },

        setActivePage(state, action) {
            state.activePage = action.payload;
        },

    },
});

export const tasksActions = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;

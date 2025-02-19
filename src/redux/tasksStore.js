import { createSlice } from '@reduxjs/toolkit';
import { TASK_STATUS } from '../constant';

function loadTasksFromLocalStorage() {
    const tasksString = localStorage.getItem('tasks');
    if (tasksString) {
        try {
            return JSON.parse(tasksString);
        } catch (error) {
            console.error("Ошибка при парсинге JSON:", error);
            return [];
        }
    }
    return []; 
}

const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const initialState = {
    tasks: loadTasksFromLocalStorage(),
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
            saveTasksToLocalStorage(state.tasks);
        },

        editTask: (state, action) => {
            const foundedTaskIndex = state.tasks.findIndex(task => task.id === action.payload.id);
            if (foundedTaskIndex >= 0) {
                state.tasks[foundedTaskIndex] = { ...state.tasks[foundedTaskIndex], ...action.payload.task };
                saveTasksToLocalStorage(state.tasks); 
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
            saveTasksToLocalStorage(state.tasks); 
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

        setFilterTo: (state, action) => {
            state.filterTo = action.payload;
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

        clearFields(state, action) {
            switch (action.payload) {
                case 'title':
                    state.title = '';
                    break;
                case 'description':
                    state.description = '';
                    break;
                case 'time':
                    state.time = '';
                    break;
                case 'date':
                    state.date = '';
                    break;
                default:
                    state.title = '';
                    state.description = '';
                    state.time = '';
                    state.date = '';
                    break;
            }
            state.isDirty = false;
        },

        setErrors(state, action) {
            const {title, description, time, date} = action.payload;
            state.errors.title = title || '';
            state.errors.description = description || '';
            state.errors.time = time || '';
            state.errors.date = date || '';
        },

        setActivePage(state, action) {
            state.activePage = action.payload;
        },

        clearTasks(state) {
            state.tasks = [];
            saveTasksToLocalStorage(state.tasks); 
        },

    },
});

export const tasksActions = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;

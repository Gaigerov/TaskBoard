import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TASK_STATUS} from '../constant';

interface Task {
    id: number;
    title: string;
    description: string;
    time: string;
    date: string;
    status: string;
}

interface TasksState {
    tasks: Task[];
    title: string;
    description: string;
    time: string;
    date: string;
    activePage: string;
    isDirty: boolean;
    filterTo: {
        search?: string;
        filterDate?: string;
        filterStatus?: string;
    };
    tasksPerPage: number;
}

// Начальное состояние
const initialState: TasksState = {
    tasks: [],
    title: '',
    description: '',
    time: '',
    date: '',
    activePage: 'taskBoard',
    isDirty: false,
    filterTo: {
        search: '',
        filterDate: '',
        filterStatus: TASK_STATUS.EMPTY,   
    },
    tasksPerPage: 10,
};

const saveTasksToLocalStorage = (tasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Omit<Task, 'id'>>) => {
            const taskWithId = { ...action.payload, id: Date.now() };
            state.tasks.push(taskWithId);
            saveTasksToLocalStorage(state.tasks);
            state.title = '';
            state.description = '';
            state.time = '';
            state.date = '';
        },
        editTask: (state, action: PayloadAction<Task>) => {
            const { id, title, description, time, date, status } = action.payload;
            const taskIndex = state.tasks.findIndex(task => task.id === id);
            if (taskIndex >= 0) {
                state.tasks[taskIndex] = {
                    ...state.tasks[taskIndex],
                    title: title !== undefined ? title : state.tasks[taskIndex].title,
                    description: description !== undefined ? description : state.tasks[taskIndex].description,
                    time: time !== undefined ? time : state.tasks[taskIndex].time,
                    date: date !== undefined ? date : state.tasks[taskIndex].date,
                    status: status !== undefined ? status : state.tasks[taskIndex].status,
                };
                saveTasksToLocalStorage(state.tasks);
            }
        },
        removeTask: (state, action: PayloadAction<{ id: number }>) => {
            const indexToRemove = state.tasks.findIndex(task => task.id === action.payload.id);
            if (indexToRemove >= 0) {
                state.tasks.splice(indexToRemove, 1);
                saveTasksToLocalStorage(state.tasks);
            }
        },
        cloneTask: (state, action: PayloadAction<{ id: number }>) => {
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
        clearTasks(state) {
            state.tasks = [];
            saveTasksToLocalStorage(state.tasks); 
        },
        setActivePage(state, action: PayloadAction<string>) {
            state.activePage = action.payload;
        },
        setTitle(state, action: PayloadAction<string>) {
            state.title = action.payload;
            state.isDirty = true;
        },
        setDescription(state, action: PayloadAction<string>) {
            state.description = action.payload;
            state.isDirty = true; 
        },
        setTime(state, action: PayloadAction<string>) {
            state.time = action.payload;
            state.isDirty = true;
        },
        setDate(state, action: PayloadAction<string>) {
            state.date = action.payload;
            state.isDirty = true; 
        },
        setFilter: (state, action: PayloadAction<{ filterDate?: string; filterStatus?: string; search?: string }>) => {
            const { filterDate, filterStatus } = action.payload || {};
            if (filterDate !== undefined) {
                state.filterTo.filterDate = filterDate;
            }
            if (filterStatus !== undefined) {
                state.filterTo.filterStatus = filterStatus;
            }
        },
        setFilterTo: (state, action: PayloadAction<{ filterDate?: string; filterStatus?: string; search?: string }>) => {
            state.filterTo = action.payload;
        },
        setTasksPerPage: (state, action) => {
            state.tasksPerPage = action.payload;
        },
    },
});

export const tasksActions = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;

import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {TASK_STATUS} from '../constant';
import {getSimpleData} from '../components/api/getStorage';
import {Task} from '../types';
import {addTaskToServer} from '../components/api/addTaskOnServer';
import {editTaskOnServer} from '../components/api/editTaskOnServer';
import {removeTaskFromServer} from '../components/api/removeTaskFromServer';
import {RootState} from './globalStore';

interface State {
    data: Task[],
    title: string,
    description: string,
    time: string,
    date: string,
    isDirty: boolean,
    filterTo: {
        search: string,
        filterDate: string | null,
        filterStatus: string,
    },
    tasksPerPage: number,
    activePage: string,
}

const initialState: State = {
    data: [],
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

// Thunk для получения задач
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (authToken: string) => {
        const data = await getSimpleData(authToken);
        return data;
    }
);

// Thunk для добавления задачи
export const addTask = createAsyncThunk(
    'tasks/addTask',
    async (task: Task, {getState}) => {
        const state = getState() as RootState;
        const response = await addTaskToServer(task);
        return response.data;
    }
);

// Thunk для редактирования задачи
export const editTask = createAsyncThunk(
    'tasks/editTask',
    async (task: Task) => {
        const response = await editTaskOnServer(task);
        return response.data;
    }
);

// Thunk для удаления задачи
export const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async (taskId: number) => {
        await removeTaskFromServer(taskId);
        return taskId;
    }
);

// Thunk для клонирования задачи
export const cloneTask = createAsyncThunk(
    'tasks/cloneTask',
    async (taskId: number) => {
        const response = await fetch(`/api/tasks/${taskId}`);
        if (!response.ok) {
            throw new Error('Ошибка при получении задачи');
        }
        const task = await response.json();
        return {...task, id: Date.now()};
    }
);

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            const taskWithId = {...action.payload, id: Date.now()}; 
            state.data.push(taskWithId);
            state.title = '';
            state.description = '';
            state.time = '';
            state.date = '';
        },
        editTask: (state, action: PayloadAction<Task>) => {
            const {id, title, description, time, date, status} = action.payload;
            const taskIndex = state.data.findIndex(task => task.id === id);
            if (taskIndex >= 0) {
                state.data[taskIndex] = {
                    ...state.data[taskIndex],
                    title: title !== undefined ? title : state.data[taskIndex].title,
                    description: description !== undefined ? description : state.data[taskIndex].description,
                    time: time !== undefined ? time : state.data[taskIndex].time,
                    date: date !== undefined ? date : state.data[taskIndex].date,
                    status: status !== undefined ? status : state.data[taskIndex].status,
                };
            }
        },
        removeTask: (state, action: PayloadAction<number>) => {
            const indexToRemove = state.data.findIndex(task => task.id === action.payload);
            if (indexToRemove >= 0) {
                state.data.splice(indexToRemove, 1);
            }
        },
        cloneTask: (state, action: PayloadAction<number>) => {
            const taskToClone = state.data.find(task => task.id === action.payload);
            if (taskToClone) {
                const newTask: Task = {
                    ...taskToClone,
                    title: 'Copy ' + taskToClone.title,
                    id: Date.now(),
                };
                state.data.push(newTask);
            }
        },
        clearTasks(state) {
            state.data = [];
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
        setTasksPerPage: (state, action) => {
            state.tasksPerPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            .addCase(editTask.fulfilled, (state, action) => {
                const index = state.data.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(removeTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.data = state.data.filter(task => task.id !== action.payload);
            })

            .addCase(cloneTask.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
    },
});

export const tasksActions = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;

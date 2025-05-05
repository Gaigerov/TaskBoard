import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {TASK_STATUS} from '../constant';
import {getSimpleData} from '../components/api/getStorage';
import {Task} from '../types';
import {saveTaskToStorage} from '../components/api/saveTaskToStorage';
import Cookies from 'js-cookie';

interface State {
    tasks: Task[],
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

const getAuthTokenOrThrow = () => {
    const token = Cookies.get('authToken');
    if (!token) throw new Error("Not authenticated");
    return token;
};

export const saveTask = createAsyncThunk(
    'tasks/saveTask',
    async (task: Task, { rejectWithValue }) => {
        try {
            const authToken = getAuthTokenOrThrow();
            const apiPayload = {
                data: {
                    tasks: [task], 
                },
                storageName: "tasks",
            };

            const result = await saveTaskToStorage(apiPayload, authToken);
            return result; 
        } catch {
            return rejectWithValue("HTTP error!");
        }
    }
);


// // Thunk для редактирования задачи
// export const editTask = createAsyncThunk(
//     'tasks/editTask',
//     async (task: Task) => {
//         const response = await editTaskOnServer(task); //saveTaskToStorage
//         return response.data;
//     }
// );

// // Thunk для удаления задачи
// export const removeTask = createAsyncThunk(
//     'tasks/removeTask',
//     async (taskId: number) => {
//         await removeTaskFromServer(taskId); //saveTaskToStorage
//         return taskId;
//     }
// );

// // Thunk для клонирования задачи
// export const cloneTask = createAsyncThunk(
//     'tasks/cloneTask',
//     async (taskId: number) => {
//         const response = await fetch(`/api/tasks/${taskId}`);
//         if (!response.ok) {
//             throw new Error('Ошибка при получении задачи');
//         }
//         const task = await response.json();
//         return {...task, id: Date.now()};
//     }
// );

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearTasks(state) {
            state.tasks = [];
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
                state.tasks = action.payload;
            })
            .addCase(saveTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload); 
                state.title = '';
                state.description = '';
                state.date = '';
                state.time = '';
                state.isDirty = false;
            })
    },
});

export const tasksActions = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;

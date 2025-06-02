import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {TASK_STATUS} from '../constant';
import {api, createTask, getSimpleData, saveTaskToStorage, updateTask} from '../components/api/getStorage';
import {Task} from '../types';
import Cookies from 'js-cookie';
import {AppStore} from './globalStore';

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
        return data.tasks;
    }
);

const getAuthTokenOrThrow = () => {
    const token = Cookies.get('authToken');
    if (!token) throw new Error("Not authenticated");
    return token;
};

export const saveTask = createAsyncThunk(
    'tasks/saveTask',
    async (tasks: Task[], {rejectWithValue}) => {
        try {
            const authToken = getAuthTokenOrThrow();
            const apiPayload = {
                data: {
                    tasks,
                },
            };

            const result = await saveTaskToStorage(apiPayload, authToken);
            return result;
        } catch {
            return rejectWithValue("HTTP error!");
        }
    }
);


// Создаем асинхронный thunk для сохранения данных на бэкенд
export const saveDataToBackend = createAsyncThunk(
    'data/saveDataToBackend',
    async (_, {getState}) => {
        const state = getState(); // Получаем текущее состояние store
        const response = await api.saveData(state); // Отправляем запрос на бэкенд
        return response.data;
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
        saveData: (state, action) => {
            state.tasks = action.payload;
        },
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
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload.data.tasks[action.payload.data.tasks.length - 1]);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            // .addCase(saveTask.fulfilled, (state, action) => {
            //     state.tasks.push(action.payload);
            //     state.title = '';
            //     state.description = '';
            //     state.date = '';
            //     state.time = '';
            //     state.isDirty = false;
            // })
    },
});

// // Создаем middleware для автоматического запуска сохранения на бэкенд
// export const autoSaveMiddleware = store<AppStore> => next => action => {
//     const result = next(action);

//     // Если это action saveData, запускаем сохранение на бэкенд
//     if (action.type === 'data/saveData') {
//         store.dispatch(saveDataToBackend());
//     }

//     return result;
// };

export const tasksActions = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;

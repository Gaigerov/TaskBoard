import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {TASK_STATUS} from '../constant';
import {getSimpleData} from '../components/api/getStorage';
import {Task} from '../types';


export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (authToken: string) => {
        const data = await getSimpleData(authToken); 
        return data; 
    }
);

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

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            const taskWithId = { ...action.payload, id: Date.now() };
            state.data.push(taskWithId);
            state.title = '';
            state.description = '';
            state.time = '';
            state.date = '';
        },
        editTask: (state, action) => {
            const { id, title, description, time, date, status } = action.payload;
            const taskIndex = state.data.findIndex(task => task.id === id);
            if (taskIndex >= 0) {
                state.data[taskIndex] = {
                    ...state.data[taskIndex],
                    title: title !== undefined ? title : state.data[taskIndex].title,
                    description: description !== undefined ? description : state.data[taskIndex].description,
                    time: time !== undefined ? time : state.data[taskIndex].time,
                    date: date !== undefined ? date : state.data[taskIndex].date,
                    status: status !== undefined ? status : state.data[taskIndex].status
                };
            }
        },
        removeTask: (state, action) => {
            const indexToRemove = state.data.findIndex(task => task.id === action.payload.id);
            if (indexToRemove >= 0) {
                state.data.splice(indexToRemove, 1);
            }
        },
        cloneTask: (state, action) => {
            const taskToClone = state.data.find(task => task.id === action.payload.id);
            if (taskToClone) {
                const newTask = {
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
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state.data = action.payload 
        })
    }
});

export const tasksActions = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;

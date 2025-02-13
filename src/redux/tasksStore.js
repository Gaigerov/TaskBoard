import {createSlice} from '@reduxjs/toolkit';

export const tasksSlice = createSlice({
        name: 'tasks',
        initialState: [],
        reducers: {
            addTask: (state, action) => {
                state.push(action.payload);
            },
            editTask: (state, action) => {
                const foundedTaskIndex = state.findIndex(task => task.id === action.payload.id);
                if (foundedTaskIndex >= 0) {
                    state[foundedTaskIndex] = { ...state[foundedTaskIndex], ...action.payload.task };
                }
            },
            removeTask: (state, action) => {
                const indexToRemove = state.findIndex(task => task.id === action.payload.id);
                if (indexToRemove >= 0) {
                    state.splice(indexToRemove, 1);
                }
            },
            cloneTask: (state, action) => {
                const taskToClone = state.find(task => task.id === action.payload.id);
                if (taskToClone) {
                    const newTask = {
                        ...taskToClone,
                        title: 'Copy ' + taskToClone.title,
                        id: Date.now(),
                    };
                    state.push(newTask);
                    localStorage.setItem('tasks', JSON.stringify(state));
                }
            },
    
            setInitialTasks: (state, action) => {
                return action.payload; 
            },
        },
    });
    
    export const tasksActions = tasksSlice.actions;
    export const tasksReducer = tasksSlice.reducer;

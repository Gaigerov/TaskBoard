import {configureStore} from '@reduxjs/toolkit';
import {
    // autoSaveMiddleware, 
    tasksReducer} from './tasksStore';
import {modalReducer} from './modalStore';

const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        modal: modalReducer,
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(autoSaveMiddleware)
});

export default store;

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

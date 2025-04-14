import {configureStore} from '@reduxjs/toolkit';
import {tasksReducer} from './tasksStore';
import {modalReducer} from './modalStore';
import {authReducer} from './authSlice';

export default configureStore({
    reducer: {
        auth: authReducer,
        tasks: tasksReducer,
        modal: modalReducer,
    },
});

import {configureStore} from '@reduxjs/toolkit';
import {tasksReducer} from './tasksStore';
import {modalReducer} from './modalStore';

export default configureStore({
    reducer: {
        tasks: tasksReducer,
        modal: modalReducer,
    },
});

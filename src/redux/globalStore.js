import {configureStore} from '@reduxjs/toolkit';
import {tasksReducer} from './_tasksStore';
import {modalReducer} from './_modalStore';

export default configureStore({
    reducer: {
        tasks: tasksReducer,
        modal: modalReducer,
    },
});

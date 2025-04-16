import {configureStore} from '@reduxjs/toolkit';
import {tasksReducer} from './tasksStore';
import {modalReducer} from './modalStore';

interface RootState {
    tasks: ReturnType<typeof tasksReducer>;
    modal: ReturnType<typeof modalReducer>;
}

const store = configureStore<RootState>({
    reducer: {
        tasks: tasksReducer,
        modal: modalReducer,
    },
});

export default store;

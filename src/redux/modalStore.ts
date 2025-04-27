import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ModalData {
    title: string | undefined,
    description: string | undefined,
    time: string | undefined,
    date: string | undefined,
}

interface Errors {
    title: string;
    description: string;
    time: string;
    date: string;
}

interface ModalState {
    currentTaskId: number | null,
    modalData: ModalData,
    errors: Errors,
} 

// Начальное состояние
const initialState: ModalState = {
    currentTaskId: null,
    modalData: {
        title: '',
        description: '',
        time: '',
        date: ''
    },
    errors: {
        title: '',
        description: '',
        time: '',
        date: '',
    },
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal(state, action: PayloadAction<ModalData>) {
            state.modalData = action.payload;
            state.currentTaskId = null;
        },
        resetModalData: (state) => {
            state.modalData = initialState.modalData; 
        },
        setErrors(state, action: PayloadAction<Errors>) {
            const {title, description, time, date} = action.payload;
            state.errors.title = title || '';
            state.errors.description = description || '';
            state.errors.time = time || '';
            state.errors.date = date || '';
        },
    },
});

export const modalActions = modalSlice.actions;
export const modalReducer = modalSlice.reducer;

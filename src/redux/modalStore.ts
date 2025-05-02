import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ModalData {
    title: string;
    description: string;
    time: string;
    date: string;
}

interface Errors {
    title: string;
    description: string;
    time: string;
    date: string;
}

interface ModalState {
    modalData: ModalData,
    errors: Errors,
} 

// Начальное состояние
const initialState: ModalState = {
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
        openModal(state, action: PayloadAction<{modalData: ModalData; taskId?: number}>) {
            state.modalData = action.payload.modalData;
        },
        resetModalData: (state) => {
            state.modalData = initialState.modalData; 
        },
        setErrors(state, action: PayloadAction<Errors>) {
            state.errors = { ...state.errors, ...action.payload };
        },
        closeModal(state) {
            state.modalData = initialState.modalData;
            state.errors = initialState.errors;
        },
    },
});

export const modalActions = modalSlice.actions;
export const modalReducer = modalSlice.reducer;

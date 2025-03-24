import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ModalData {
    title: string,
    description: string,
    time: string,
    date: string,
}

interface Errors {
    title: string,
    description: string,
    time: string,
    date: string,
}

interface ModalState {
    isCreateModalOpen: boolean,
    isFilterModalOpen: boolean,
    isEditModalOpen: boolean,
    isViewModalOpen: boolean,
    isRemoveModalOpen: boolean,
    currentTaskId: number | null,
    modalData: ModalData,
    errors: Errors,
}

// Начальное состояние
const initialState: ModalState = {
    isCreateModalOpen: false,
    isFilterModalOpen: false,
    isEditModalOpen: false,
    isViewModalOpen: false,
    isRemoveModalOpen: false,
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

interface OpenModalPayload {
    modalType: 'create' | 'filter' | 'edit' | 'view' | 'remove';
    payload?: any;
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<OpenModalPayload>) => {
            const {modalType, payload} = action.payload;
            state.isCreateModalOpen = false;
            state.isFilterModalOpen = false;
            state.isEditModalOpen = false;
            state.isViewModalOpen = false;
            state.isRemoveModalOpen = false;
            switch (modalType) {
                case 'create':
                    state.isCreateModalOpen = true;
                    state.currentTaskId = null;
                    state.modalData = initialState.modalData; 
                    break;
                case 'filter':
                    state.isFilterModalOpen = true;
                    state.currentTaskId = null;
                    break;
                case 'edit':
                    state.isEditModalOpen = true;
                    state.currentTaskId = payload?.id || null;
                    state.modalData = payload; 
                    break;
                case 'view':
                    state.isViewModalOpen = true;
                    state.currentTaskId = payload?.id || null;
                    break;
                case 'remove':
                    state.isRemoveModalOpen = true;
                    state.currentTaskId = payload?.id || null;
                    break;
                default:
                    break;
            }
        },
        closeAllModals: (state) => {
            state.isCreateModalOpen = false;
            state.isFilterModalOpen = false;
            state.isEditModalOpen = false;
            state.isViewModalOpen = false;
            state.isRemoveModalOpen = false;
            state.currentTaskId = null;
            state.modalData = initialState.modalData; 
            state.errors = initialState.errors; 
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
        setField: (state, action: PayloadAction<{field: keyof ModalData; value: string}>) => {
            const {field, value} = action.payload;
            if (state.modalData.hasOwnProperty(field)) {
                state.modalData[field] = value;
            }
        },
        clearFields(state, action: PayloadAction<'title' | 'description' | 'time' | 'date' | 'all'>) {
            switch (action.payload) {
                case 'title':
                    state.modalData.title = '';
                    break;
                case 'description':
                    state.modalData.description = '';
                    break;
                case 'time':
                    state.modalData.time = '';
                    break;
                case 'date':
                    state.modalData.date = '';
                    break;
                case 'all':
                default:
                    state.modalData = initialState.modalData;
                    break;
            }
        },
    },
});

export const modalActions = modalSlice.actions;
export const modalReducer = modalSlice.reducer;

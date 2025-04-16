import {createSlice} from '@reduxjs/toolkit';

const initialState = {
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

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action) => {
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
                    state.modalData = initialState.modalData; // Сброс данных модала
                    break;
                case 'filter':
                    state.isFilterModalOpen = true;
                    state.currentTaskId = null;
                    break;
                case 'edit':
                    state.isEditModalOpen = true;
                    state.currentTaskId = payload.id;
                    state.modalData = payload; 
                    break;
                case 'view':
                    state.isViewModalOpen = true;
                    state.currentTaskId = payload.id;
                    break;
                case 'remove':
                    state.isRemoveModalOpen = true;
                    state.currentTaskId = payload.id;
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
        setErrors(state, action) {
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

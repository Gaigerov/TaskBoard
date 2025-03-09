import { createSlice } from '@reduxjs/toolkit';

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
        openCreateModal: (state) => {
            state.isCreateModalOpen = true;
            state.currentTaskId = null;
            state.modalData = initialState.modalData; // Сброс данных модала
        },
        openFilterModal: (state) => {
            state.isFilterModalOpen = true;
            state.currentTaskId = null;
        },
        openEditModal: (state, action) => {
            state.isEditModalOpen = true;
            state.currentTaskId = action.payload.id;
            state.modalData = action.payload;
        },
        openViewModal: (state, action) => {
            state.isViewModalOpen = true;
            state.currentTaskId = action.payload.id;
        },
        openRemoveModal: (state, action) => {
            state.isRemoveModalOpen = true;
            state.currentTaskId = action.payload.id;
        },
        closeAllModals: (state) => {
            state.isCreateModalOpen = false;
            state.isFilterModalOpen = false;
            state.isEditModalOpen = false;
            state.isViewModalOpen = false;
            state.isRemoveModalOpen = false;
            state.currentTaskId = null;
            state.modalData = initialState.modalData; // Сброс данных модала
            state.errors = initialState.errors; // Сброс ошибок
        },
        resetModalData: (state) => {
            state.modalData = initialState.modalData; // Сброс данных модала
        },
        setErrors(state, action) {
            const { title, description, time, date } = action.payload;
            state.errors.title = title || '';
            state.errors.description = description || '';
            state.errors.time = time || '';
            state.errors.date = date || '';
        },
        setField: (state, action) => {
            const { field, value } = action.payload;
            if (state.modalData.hasOwnProperty(field)) {
                state.modalData[field] = value;
            }
        },
        clearFields(state, action) {
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
                    default:
                        state.modalData = initialState.modalData; 
                        break;
                }
            },
        },
    });
    
    export const modalActions = modalSlice.actions;
    export const modalReducer = modalSlice.reducer;
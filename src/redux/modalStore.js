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
    }
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openCreateModal: (state) => {
            state.isCreateModalOpen = true;
            state.currentTaskId = null;
            state.modalData = {
                title: '',
                description: '',
                time: '',
                date: ''
            };
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
            state.modalData = {title: '', description: '', time: '', date: ''};
        },
    },
});

export const modalActions = modalSlice.actions;
export const modalReducer = modalSlice.reducer;

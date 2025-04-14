import {createSlice} from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
    authToken: Cookies.get('authToken') || null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        getAuthToken(state, action) {
            state.authToken = action.payload;
            Cookies.get('authToken', action.payload);
        },
        clearAuthToken(state) {
            state.authToken = null;
            Cookies.remove('authToken');
        },
    },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

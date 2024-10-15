import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

interface AuthState {
    user: any;
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthTokens: (
            state,
            action: PayloadAction<{accessToken: string; refreshToken: string}>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        clearAuthTokens: (
            state
        ) => {
            state.accessToken = null;
            state.refreshToken = null;
        },
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        logout: (state) => {
            state.user = null;
            state.refreshToken = null;
            state.accessToken = null;
        },
    },
});

export const { setAuthTokens, clearAuthTokens, setUser, clearUser, logout } = authSlice.actions;
export default authSlice.reducer;
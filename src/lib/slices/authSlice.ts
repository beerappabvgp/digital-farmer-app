import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

interface AuthState {
    username: any;
    accessToken: string | null;
    refreshToken: string | null;
    imageUrl: string | null;
}

const initialState: AuthState = {
    username: null,
    imageUrl: null,
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
        setUser: (state, action: PayloadAction<{ user:string, imageUrl: string | null}>) => {
            console.log(action.payload);
            state.username = action.payload.user;
            state.imageUrl = action.payload.imageUrl;
        },
        clearUser: (state) => {
            state.username = null;
            state.imageUrl = null;
        },
        logout: (state) => {
            state.username = null;
            state.imageUrl = null;
            state.refreshToken = null;
            state.accessToken = null;
        },
    },
});

export const { setAuthTokens, clearAuthTokens, setUser, clearUser, logout } = authSlice.actions;
export default authSlice.reducer;
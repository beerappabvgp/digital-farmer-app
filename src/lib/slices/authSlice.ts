import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

interface AuthState {
    username: any;
    accessToken: string | null;
    role: string | null,
    refreshToken: string | null;
    imageUrl: string | null;
    id: string | null,
}

const initialState: AuthState = {
    username: null,
    id: null,
    imageUrl: null,
    role: null,
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
        setUser: (state, action: PayloadAction<{ user:string, imageUrl: string | null, role: string, id: string}>) => {
            console.log(action.payload);
            state.id = action.payload.id;
            state.username = action.payload.user;
            state.imageUrl = action.payload.imageUrl;
            state.role = action.payload.role;
        },
        clearUser: (state) => {
            state.username = null;
            state.imageUrl = null;
            state.role = null;
        },
        logout: (state) => {
            state.username = null;
            state.imageUrl = null;
            state.refreshToken = null;
            state.accessToken = null;
            state.role = null;
        },
    },
});

export const { setAuthTokens, clearAuthTokens, setUser, clearUser, logout } = authSlice.actions;
export default authSlice.reducer;
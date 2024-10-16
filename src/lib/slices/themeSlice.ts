import { Payload } from "@prisma/client/runtime/library";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '@/lib/store';

interface ThemeState {
    mode: 'light' | 'dark';
}

const initialState: ThemeState = {
    mode: 'dark'
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.mode = action.payload;
        }
    }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme.mode;
export default themeSlice.reducer;
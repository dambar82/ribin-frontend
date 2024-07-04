import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {ContestUser, Post} from "../types";

export interface User {
    id: number;
    email: string;
    name: string;
    password: string;
    age: number;
    address: string | null;
    phone: string | null;
    score: number | null;
    posts: Post[]; // Define more specific types if needed
    contests: ContestUser[]; // Define more specific types if needed
    image: string;
    clubs: any[];
    events: any[];
}

interface UserState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserState = {
    user: JSON.parse(localStorage.getItem('user') || '{}') as User | null,
    status: 'idle',
    error: null,
};


export const loginUser = createAsyncThunk('user/loginUser', async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post(`https://api-rubin.multfilm.tatar/api/login?email=${email}&password=${password}`);
    return response.data as User;
});

export const registerUser = createAsyncThunk('user/registerUser', async ({ email, password, name, surname }: { email: string; password: string; name: string, surname: string }) => {
    const response = await axios.post('https://api-rubin.multfilm.tatar/api/register', { email, password, name, surname });
    return response.data.data as User;
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('user');
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload)); // Сохранение пользователя в localStorage
        },
        clearUser: (state) => {
            state.user = null;
            localStorage.removeItem('user'); // Удаление пользователя из localStorage
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                state.status = 'succeeded';
                localStorage.setItem('user', JSON.stringify(action.payload));
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                console.log('action', action);
                state.error = action.error.message || null;
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                state.status = 'succeeded';
                console.log(action.payload)
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export const { logout, setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

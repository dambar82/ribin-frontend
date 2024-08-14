import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {ContestUser, Post} from "../types";
import { TEditUserRequest, TEditUserResponse } from '../shared/types/user.types'

export interface User {
    id: number;
    email: string;
    name: string;
    surname: string;
    age: number;
    password: string;
    address: string | null;
    phone: string | null;
    score: number | null;
    posts: Post[];
    contests: ContestUser[];
    image: string;
    clubs: any[];
    events: any[];
}

interface AuthResponse {
    client: User;
    token: string;
}

interface UserState {
    user: User | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const localStorageUser = JSON.parse(localStorage.getItem('user') || '{}');

const initialState: UserState = {
    user: localStorageUser.client || null,
    token: localStorageUser.token || null,
    status: 'idle',
    error: null,
};

const token = JSON.parse(localStorage.getItem('user'))?.token;

export const loginUser = createAsyncThunk('user/loginUser', async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post('https://api-rubin.multfilm.tatar/api/login', { email, password });
    return response.data as AuthResponse;
});

export const registerUser = createAsyncThunk('user/registerUser', async ({ email, password, name, surname }: { email: string; password: string; name: string; surname: string }) => {
    const response = await axios.post('https://api-rubin.multfilm.tatar/api/clients', { email, password, name, surname });
    return response.data as AuthResponse;
});

export const getCurrentUser = createAsyncThunk('user/getCurrentUser', async () => {
    const response = await axios.get('https://api-rubin.multfilm.tatar/api/clients/1',
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    )
})

export const editUser = createAsyncThunk('user/editUser', async ( sendObj: TEditUserRequest ) => {
  const response = await axios.put<TEditUserResponse>(`https://api-rubin.multfilm.tatar/api/clients/${sendObj.id}`, sendObj);
  return response.data.data
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('user');
        },
        setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload)); // Сохранение пользователя и токена в localStorage
        },
        clearUser: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user'); // Удаление пользователя и токена из localStorage
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.user = action.payload.client;
                state.token = action.payload.token;
                console.log(action.payload)
                state.status = 'succeeded';
                localStorage.setItem('user', JSON.stringify(action.payload));
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })

            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.user = action.payload.client;
                state.token = action.payload.token;
                state.status = 'succeeded';
                localStorage.setItem('user', JSON.stringify(action.payload));
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })

            .addCase(editUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify({ client: action.payload, token: state.token }));
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
    },
});

export const { logout, setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

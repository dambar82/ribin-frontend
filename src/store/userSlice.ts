import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {ContestUser, Post} from "../types";
import { TEditUserRequest, TEditUserResponse } from '../shared/types/user.types'
import { TCheckAuthResponse, TLoginUserResponse } from '../shared/types/auth.types'

export interface User {
    id: number;
    email: string;
    name: string;
    surname: string;
    birthdate: number;
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

interface UserState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserState = {
    user: null,
    status: 'idle',
    error: null,
};


export const loginUser = createAsyncThunk('user/loginUser', async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post<TLoginUserResponse>('https://api-rubin.multfilm.tatar/api/login', { email, password });
    return response.data
});

export const registerUser = createAsyncThunk('user/registerUser', async ({ email, password, name, surname }: { email: string; password: string; name: string, surname: string }) => {
    const response = await axios.post<TLoginUserResponse>('https://api-rubin.multfilm.tatar/api/clients', { email, password, name, surname });
    return response.data
});

export const checkAuth = createAsyncThunk('user/checkAuth', async () => {
  const user_id = JSON.parse(localStorage.getItem('user_id') || '')
  if ( !user_id ) return null
  const response = await axios.get<TCheckAuthResponse>(`https://api-rubin.multfilm.tatar/api/clients/${user_id}`, {
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '')}`,
    },
});
  return response.data.data
});

export const editUser = createAsyncThunk('user/editUser', async ( sendObj: TEditUserRequest ) => {
  const response = await axios.put<TEditUserResponse>(`https://api-rubin.multfilm.tatar/api/clients/${sendObj.id}`, sendObj, {
    headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '')}`,
    },
});
  return response.data.data
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
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<TLoginUserResponse>) => {
                state.user = action.payload.client;
                state.status = 'succeeded';
                localStorage.setItem('token', JSON.stringify(action.payload.token));
                localStorage.setItem('user_id', JSON.stringify(action.payload.client.id));
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
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<TLoginUserResponse>) => {
                state.user = action.payload.client;
                state.status = 'succeeded';
                localStorage.setItem('token', JSON.stringify(action.payload.token));
                localStorage.setItem('user_id', JSON.stringify(action.payload.client.id));
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })

            .addCase(checkAuth.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkAuth.fulfilled, (state, action: PayloadAction<TCheckAuthResponse['data']>) => {
                state.user = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })

            .addCase(editUser.pending, (state) => {
              state.status = 'loading';
            })
            .addCase(editUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload))
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
                throw Error(action.error.message)
            })
    },
});

export const { logout, setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

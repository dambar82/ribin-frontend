import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {User} from "./userSlice";

interface StudentsState {
    friends: {[id: string]: any[]};
    friendDetails: { [id: string]: any }; // Кэширование данных студентов по id
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: StudentsState = {
    friends: {friends: [], awaiting: [], pending: []},
    friendDetails: {},
    status: 'idle',
    error: null,
};

const $api = axios.create({
    baseURL: 'https://api-rubin.multfilm.tatar'
})

$api.interceptors.request.use(config => {
    const token = JSON.parse(localStorage.getItem('token') || '')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const fetchFriends = createAsyncThunk('friends/fetchFriends', async () => {
    const friendsUrl = `https://api-rubin.multfilm.tatar/api/friends`;

    const response = await $api.get(friendsUrl);

    return response.data as any[];
});

const friendsSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFriends.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFriends.fulfilled, (state, action: PayloadAction<any>) => {
                state.friends = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchFriends.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    }
})


export default friendsSlice.reducer;

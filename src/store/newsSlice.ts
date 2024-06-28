import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {News} from '../types';

interface NewsState {
    news: News[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: NewsState = {
    news: [],
    status: 'idle',
    error: null,
};

export const fetchNews = createAsyncThunk('news/fetchNews', async () => {
    const response = await axios.get('https://api-rubin.multfilm.tatar/api/news');
    return response.data.data as News[];
});

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNews.fulfilled, (state, action: PayloadAction<News[]>) => {
                state.news = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchNews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    }
})

export default newsSlice.reducer;
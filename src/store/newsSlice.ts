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
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = 'https://loyalfans.rubin-kazan.ru/api/v1/bitrix/news';
    const response = await axios.get(proxyUrl + targetUrl, {
        headers: {
            'Origin': 'http://localhost:3000'
        }
    });
    console.log(response.data)
    return response.data as News[];
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
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {News, NewsBack} from '../types';

interface NewsState {
    news: (News | NewsBack)[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: NewsState = {
    news: [],
    status: 'idle',
    error: null,
};

const token = JSON.parse(localStorage.getItem('token') || '0')

export const fetchNewsAndNewsBack = createAsyncThunk('news/fetchNewsAndNewsBack', async () => {
    const newsBackUrl = 'https://api-rubin.multfilm.tatar/api/news';
    const newsUrl = `https://api-rubin.multfilm.tatar/api/request/news?isTop=true`;

    const results = await Promise.allSettled([
        axios.get(newsBackUrl),
        axios.get(newsUrl, {
            headers: {
                'Origin': 'http://localhost:3000'
            }
        })
    ]);

    const newsBackData = results[0].status === 'fulfilled' ? results[0].value.data.data : [];
    const newsData = results[1].status === 'fulfilled' ? results[1].value.data : [];

    return [...newsData, ...newsBackData];
});

export const newsLikeAsync = createAsyncThunk('news/newsLike', async ({newsId} : {newsId: number}) => {
    try {
        await axios.post(
            `https://api-rubin.multfilm.tatar/api/news/${newsId}/like`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    } catch (error) {
        console.error('Failed to toggle like:', error);
    }
})

export const addViewNews = createAsyncThunk('news/addViewNews', async ({newsId} : {newsId: number}) => {
    try {
        await axios.get(
            `https://api-rubin.multfilm.tatar/api/news/${newsId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    } catch (error) {
        console.error(error);
    }
})

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNewsAndNewsBack.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNewsAndNewsBack.fulfilled, (state, action: PayloadAction<(News | NewsBack)[]>) => {
                state.news = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchNewsAndNewsBack.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    }
})

export default newsSlice.reducer;

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
    const newsBackUrl = 'https://dnevnik-api.rubin-kazan.ru/api/news';
    const newsUrl = `https://dnevnik-api.rubin-kazan.ru/api/request/news?isTop=true`;

    const results = await Promise.allSettled([
      //  axios.get(newsUrl),
        axios.get(newsBackUrl, {
            headers: {
                'Origin': 'http://localhost:3000'
            }
        })
    ]);

    const newsBackData = results[0].status === 'fulfilled' ? results[0].value.data.data : [];
 //   const newsData = results[1].status === 'fulfilled' ? results[1].value.data : [];

    return [...newsBackData];
});

export const fetchNewsApiById = createAsyncThunk('news/fetchNewsApiById', async ({newsId} : {newsId: number}) => {
    const response = await axios.get(`https://dnevnik-api.rubin-kazan.ru/api/request/news/${newsId}`);
    return response.data;
})

export const newsLikeAsync = createAsyncThunk('news/newsLike', async ({newsId} : {newsId: number}) => {
    try {
        await axios.post(
            `https://dnevnik-api.rubin-kazan.ru/api/news/${newsId}/like`,
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
            `https://dnevnik-api.rubin-kazan.ru/api/news/${newsId}`,
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
            })
            .addCase(fetchNewsApiById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNewsApiById.fulfilled, (state, action: PayloadAction<News>) => {
                console.log(action.payload)
                state.news = [action.payload];
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchNewsApiById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    }
})

export default newsSlice.reducer;

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

export const fetchNewsAndNewsBack = createAsyncThunk('news/fetchNewsAndNewsBack', async () => {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const newsBackUrl = 'https://api-rubin.multfilm.tatar/api/news';
    const newsUrl = `${proxyUrl}https://loyalfans.rubin-kazan.ru/api/v1/bitrix/news?isTop=true`;

    // Выполняем оба запроса одновременно
    const [newsBackResponse, newsResponse] = await Promise.all([
        axios.get(newsBackUrl),
        axios.get(newsUrl, {
            headers: {
                'Origin': 'http://localhost:3000'
            }
        })
    ]);

    // Преобразуем данные в нужные типы
    const newsBackData = newsBackResponse.data.data as NewsBack[];
    const newsData = newsResponse.data as News[];

    // Объединяем массивы
    return [...newsData, ...newsBackData];
});

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
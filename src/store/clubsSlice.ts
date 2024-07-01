import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {Clubs, News} from "../types";
import {fetchNews} from "./newsSlice";

interface ClubsState {
    clubs: Clubs[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ClubsState = {
    clubs: [],
    status: 'idle',
    error: null,
};

export const fetchClubs = createAsyncThunk('news/fetchClubs', async () => {
    const response = await axios.get('https://api-rubin.multfilm.tatar/api/club');
    return response.data.data as Clubs[];
});

const clubsSlice = createSlice({
    name: 'clubs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClubs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchClubs.fulfilled, (state, action: PayloadAction<Clubs[]>) => {
                state.clubs = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchClubs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    }
})


export default clubsSlice.reducer;

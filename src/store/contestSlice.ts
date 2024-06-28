import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Contest } from '../types';

interface ContestState {
    contests: Contest[];
    contestStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ContestState = {
    contests: [],
    contestStatus: 'idle',
    error: null,
};

export const fetchContests = createAsyncThunk('contests/fetchContests', async () => {
    const response = await axios.get('https://api-rubin.multfilm.tatar/api/contest');
    return response.data.data as Contest[];
});

const contestSlice = createSlice({
    name: 'contests',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContests.pending, (state) => {
                state.contestStatus = 'loading';
            })
            .addCase(fetchContests.fulfilled, (state, action: PayloadAction<Contest[]>) => {
                state.contests = action.payload;
                state.contestStatus = 'succeeded';
                state.error = null;
            })
            .addCase(fetchContests.rejected, (state, action) => {
                state.contestStatus = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export default contestSlice.reducer;
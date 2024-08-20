import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {Coach} from "../types";

interface CoachesState {
    coaches: Coach[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CoachesState = {
    coaches: [],
    status: 'idle',
    error: null,
};

export const fetchCoaches = createAsyncThunk('coaches/fetchCoaches', async () => {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const studentsUrl = `https://api-rubin.multfilm.tatar/api/request/academy-coaches`;

    const response = await axios.get(studentsUrl, {
        headers: {
            'Origin': 'http://localhost:3000'
        }
    });

    return response.data as Coach[];
});

const coachesSlice = createSlice({
    name: 'coaches',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoaches.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCoaches.fulfilled, (state, action: PayloadAction<Coach[]>) => {
                state.coaches = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchCoaches.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    }
})


export default coachesSlice.reducer;

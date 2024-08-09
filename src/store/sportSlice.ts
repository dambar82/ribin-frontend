import {Sport} from "../types";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";


interface SportState {
    sports: Sport;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SportState = {
    sports: { training_videos: [], healthy_eating_img: [], healthy_eating_video: [] },
    status: 'idle',
    error: null,
};

export const fetchSport = createAsyncThunk('sport/fetchSport', async () => {
    const response = await axios.get('https://api-rubin.multfilm.tatar/api/sport');
    return response.data as Sport;
})

const sportSlice = createSlice({
    name: 'sport',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSport.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSport.fulfilled, (state, action: PayloadAction<Sport>) => {
                state.sports = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchSport.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    }
});

export default sportSlice.reducer;
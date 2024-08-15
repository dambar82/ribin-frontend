import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {Clubs} from "../types";
import { TCreateClubRequest, TCreateClubResponse } from '../shared/types/user.types'

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

const token = JSON.parse(localStorage.getItem('user'))?.token;

export const fetchClubs = createAsyncThunk('clubs/fetchClubs', async () => {
  const response = await axios.get('https://api-rubin.multfilm.tatar/api/club');
  return response.data.data as Clubs[];
});

export const createClub = createAsyncThunk('clubs/createClubs', async ( sendObj: TCreateClubRequest ) => {
  const response = await axios.post<TCreateClubResponse>('https://api-rubin.multfilm.tatar/api/club', sendObj, {
      headers: {
          'Authorization': `Bearer ${token}`
      }
  });
  return response.data
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
                console.log('clubs', action.payload);
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchClubs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })

            .addCase(createClub.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createClub.fulfilled, (state, action: PayloadAction<any>) => {
                console.log(action.payload);
            })
            .addCase(createClub.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
    }
})


export default clubsSlice.reducer;

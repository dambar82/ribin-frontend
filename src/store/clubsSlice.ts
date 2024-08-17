import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {Clubs} from "../types";
import { TCreateClubRequest, TCreateClubResponse, TGetClubRequest, TGetClubResponse } from '../shared/types/club.types'

interface ClubsState {
    club: Clubs | null
    clubs: Clubs[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ClubsState = {
    club: null,
    clubs: [],
    status: 'idle',
    error: null,
};

const token = JSON.parse(localStorage.getItem('user'))?.token;

const $api = axios.create({
  baseURL: 'https://api-rubin.multfilm.tatar'
})

$api.interceptors.request.use(config => {
  const token = JSON.parse(localStorage.getItem('token') || '')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const fetchClubs = createAsyncThunk('clubs/fetchClubs', async () => {
  const response = await axios.get('https://api-rubin.multfilm.tatar/api/club');
  return response.data.data as Clubs[];
});

export const createClub = createAsyncThunk('clubs/createClubs', async ( sendObj: TCreateClubRequest ) => {
  const response = await $api.post<TCreateClubResponse>('/api/club', sendObj);
  return response.data
});

export const getClub = createAsyncThunk('clubs/getClub', async ( sendObj: TGetClubRequest ) => {
  const response = await $api.get<TGetClubResponse>(`/api/club/${sendObj.id}`);
  return response.data.data
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

            .addCase(getClub.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getClub.fulfilled, (state, action: PayloadAction<TGetClubResponse['data']>) => {
                state.club = action.payload
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(getClub.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
    }
})


export default clubsSlice.reducer;

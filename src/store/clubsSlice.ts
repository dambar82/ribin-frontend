import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {Clubs} from "../types";
import { TCreateClubEventRequest, TCreateClubEventResponse, TCreateClubRequest, TCreateClubResponse, TEditClubRequest, TEditClubResponse, TGetClubRequest, TGetClubResponse, TJoinTheClubRequest, TJoinTheClubResponse } from '../shared/types/club.types'
import { User } from './userSlice'

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
  try {
    const response = await $api.post<TCreateClubResponse>('/api/club', sendObj);
    return response.data
  } catch (error) {
    console.log(error);
    return error?.response.data
  }
});

export const getClub = createAsyncThunk('clubs/getClub', async ( sendObj: TGetClubRequest ) => {
  const response = await $api.get<TGetClubResponse>(`/api/club/${sendObj.id}`);
  return response.data.data
});

export const editClub = createAsyncThunk('clubs/editClub', async ( data: { id: number, formData: TEditClubRequest } ) => {
  const response = await $api.put<TEditClubResponse>(`/api/club/${data.id}`, data.formData);
  return response.data
});

export const joinTheClub = createAsyncThunk('clubs/joinTheClub', async ( data: { sendObj: TJoinTheClubRequest, club_id: number, user: User } ) => {
  const response = await $api.post<TJoinTheClubResponse>(`/api/club/${data.club_id}/join`, data.sendObj)
  return {
    ...response.data,
    user: data.user
  }
});

export const createClubEvent = createAsyncThunk('clubs/createClubEvent', async ( data: { sendObj: TCreateClubEventRequest, club_id: number } ) => {
  try {
    const response = await $api.post<TCreateClubEventResponse>(`/api/event/${data.club_id}/create`, data.sendObj)
    return response.data
  } catch (error) {
    console.log(error);
    return error?.response.data
  }
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
            })
            .addCase(createClub.fulfilled, (state, action: PayloadAction<TCreateClubResponse>): any => {
              console.log(action.payload?.id);
              if ( !action.payload?.id ) {
                return
              }
              state.club = action.payload
              console.log(action.payload);
            })
            .addCase(createClub.rejected, (state, action) => {
            })

            .addCase(getClub.pending, (state) => {
            })
            .addCase(getClub.fulfilled, (state, action: PayloadAction<TGetClubResponse['data']>) => {
                state.club = action.payload
            })
            .addCase(getClub.rejected, (state, action) => {
            })

            .addCase(editClub.pending, (state) => {
            })
            .addCase(editClub.fulfilled, (state, action: PayloadAction<TEditClubResponse>) => {
                state.club = action.payload
            })
            .addCase(editClub.rejected, (state, action) => {
            })

            .addCase(joinTheClub.pending, (state) => {
            })
            .addCase(joinTheClub.fulfilled, (state, action: PayloadAction<TJoinTheClubResponse & { user: User }>) => {
              const club = state.club
              club.clients.push(action.payload.user)
              state.clubs.map(el => {
                if ( el.id === club.id ) {
                  el.clients.push(action.payload.user)
                }
                return el
              })
              state.club = club
            })
            .addCase(joinTheClub.rejected, (state, action) => {
            })

            .addCase(createClubEvent.pending, (state) => {
            })
            .addCase(createClubEvent.fulfilled, (state, action: PayloadAction<TCreateClubEventResponse>) => {
              if ( !action.payload ) {
                return
              }
              state.club.events.push(action.payload)
            })
            .addCase(createClubEvent.rejected, (state, action) => {
            })
    }
})


export default clubsSlice.reducer;

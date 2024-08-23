import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { TCancelParticipateInEventResponse, TEvent, TGetEventResponse, TGetEventsResponse, TParticipateInEventResponse } from '../shared/types/event.types'
import { User } from './userSlice'

interface ClubsState {
  event: TEvent | null
  events: TEvent[]
}

const initialState: ClubsState = {
  event: null,
  events: []
};

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

export const fetchEvents = createAsyncThunk('clubs/fetchEvents', async () => {
  const response = await $api.get<TGetEventsResponse>('/api/event');
  return response.data.data
})

export const getEvent = createAsyncThunk('clubs/getEvent', async ( { id }: { id: string } ) => {
  const response = await $api.get<TGetEventResponse>(`/api/event/${id}`);
  return response.data.data
})

export const participateInEvent = createAsyncThunk('clubs/participateInEvent', async ( { event_id, user }: { event_id: number, user: User } ) => {
  const response = await $api.post<TParticipateInEventResponse>(`/api/event/${event_id}/take_part`);
  return { response: response.data, user }
})

export const cancelParticipateInEvent = createAsyncThunk('clubs/cancelParticipateInEvent', async ( { event_id, user }: { event_id: number, user: User } ) => {
  const response = await $api.post<TCancelParticipateInEventResponse>('');
  return { response: response.data, user }
})

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder

        .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<TGetEventsResponse['data']>) => {
          state.events = action.payload
        })

        .addCase(getEvent.fulfilled, (state, action: PayloadAction<TGetEventResponse['data']>) => {
          state.event = action.payload
        })

        .addCase(participateInEvent.fulfilled, (state, action: PayloadAction<TParticipateInEventResponse & { user: User }>) => {
          state.event.clients.push(action.payload.user)
        })

        .addCase(cancelParticipateInEvent.fulfilled, (state, action: PayloadAction<TCancelParticipateInEventResponse & { user: User }>) => {
          const clients = state.event.clients
          clients.filter(el => el.id !== action.payload.user.id)
          state.event.clients = clients
        })
    }
})


export default eventsSlice.reducer;

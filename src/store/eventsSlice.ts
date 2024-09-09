import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { TCancelParticipateInEventResponse, TCreateEventRequest, TCreateEventResponse, TDeleteEventResponse, TEvent, TGetEventResponse, TGetEventsResponse, TParticipateInEventResponse } from '../shared/types/event.types'
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
  const response = await $api.post<TCancelParticipateInEventResponse>(`/api/event/${event_id}/refuse_part`);
  return { response: response.data, user }
})

export const createEvent = createAsyncThunk('clubs/createEvent', async ( formData: TCreateEventRequest ) => {
  const response = await $api.post<TCreateEventResponse>('/api/event/create', formData);
  return response.data.data
})

export const deleteEvent = createAsyncThunk('clubs/deleteEvent', async ( event_id: number ) => {
  const response = await $api.delete<TDeleteEventResponse>(`/api/event/${event_id}/delete`);
  return response.data.data
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
          state.event?.participants.push({
            id: action.payload.user.id,
            name: action.payload.user.name,
            surname: action.payload.user.surname,
            avatar: action.payload.user.avatar
          })
        })

        .addCase(cancelParticipateInEvent.fulfilled, (state, action: PayloadAction<TCancelParticipateInEventResponse & { user: User }>) => {
          console.log(action.payload);
          
          const participants = state.event.participants
          state.event.participants = participants.filter(el => el.id !== action.payload.user.id)
        })

        .addCase(createEvent.fulfilled, (state, action: PayloadAction<TCreateEventResponse['data']>) => {
          const events = state.events
          events.push(action.payload)
          state.event = action.payload
        })

        .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<TDeleteEventResponse['data']>) => {
          console.log(action.payload);
          
        })

    }
})


export default eventsSlice.reducer;

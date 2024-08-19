import {User} from "./userSlice";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";


interface PeopleState {
    people: User[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PeopleState = {
    people: [],
    status: 'idle',
    error: null,
};


export const fetchPeople = createAsyncThunk('people/fetchPeople', async () => {
    const response = await axios.get('https://api-rubin.multfilm.tatar/api/clients');
    return response.data.data as User[];
});

const peopleSlice = createSlice({
    name: 'people',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPeople.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPeople.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.people = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchPeople.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    }
})

export default peopleSlice.reducer;

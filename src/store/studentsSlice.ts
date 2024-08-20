import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {Student} from "../types";

interface StudentsState {
    students: Student[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: StudentsState = {
    students: [],
    status: 'idle',
    error: null,
};

export const fetchStudents = createAsyncThunk('students/fetchStudents', async () => {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const studentsUrl = `https://api-rubin.multfilm.tatar/api/request/students`;

    const response = await axios.get(studentsUrl, {
        headers: {
            'Origin': 'http://localhost:3000'
        }
    });

    return response.data as Student[];
});

const studentsSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<Student[]>) => {
                state.students = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    }
})


export default studentsSlice.reducer;

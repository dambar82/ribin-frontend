import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
    email: string;
    name: string;
    password: string;
    age: number;
    address: string | null;
    phone: string | null;
    score: number | null;
    posts: any[]; // Define more specific types if needed
    contests: any[]; // Define more specific types if needed
    image: string | null;
}

interface UserState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserState = {
    user: null,
    status: 'idle',
    error: null,
};

// {
//     email: 'a@a.u',
//         name: 'Иван Иванов',
//     password: '123',
//     age: 12,
//     address: 'pushkina',
//     phone: '12123',
//     score: 23,
//     posts: ['string'],
//     contests: [4,5],
//     image: 'dsd'
// }

export const loginUser = createAsyncThunk('user/loginUser', async ({ email, password }: { email: string; password: string }) => {
    console.log(email, password);
    const response = await axios.post(`https://api-rubin.multfilm.tatar/api/login?email=${email}&password=${password}`);
    return response.data.data as User;
});

export const registerUser = createAsyncThunk('user/registerUser', async ({ email, password, name, surname }: { email: string; password: string; name: string, surname: string }) => {
    const response = await axios.post('https://api-rubin.multfilm.tatar/api/register', { email, password, name, surname });
    return response.data.data as User;
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                state.status = 'succeeded';
                console.log('action', action.payload);
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                console.log('action', action);
                state.error = action.error.message || null;
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                state.status = 'succeeded';
                console.log(action.payload)
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
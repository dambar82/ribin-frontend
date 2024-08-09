import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

export interface Client {
    rubick: number;
    address: string | null;
    client_roles_id: number;
    created_at: string | null;
    districts_id: number | null;
    email: string;
    id: number;
    image: string;
    name: string;
    phone: string | null;
    school: string | null;
    score: number | null;
    status: string | null;
    updated_at: string | null;
}

export interface Post {
    client: Client;
    comments: Comment[];
    description: string;
    id: number;
    likes_count: number;
    source: string[];
    title: string;
}

interface PostAnswer {
    all: Post[];
    image: Post[];
    video: Post[];
}

interface PostState {
    posts: PostAnswer[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PostState = {
    posts: [],
    status: 'idle',
    error: null,
};

export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
    const response = await axios.get('https://api-rubin.multfilm.tatar/api/posts');
    return response.data as PostAnswer[];
})

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.posts = action.payload;
                console.log(action.payload);
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    }
});

export default postSlice.reducer;

import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {Client, IComment} from "../types";

export interface Post {
    client: Client;
    comments: IComment[];
    description: string;
    id: number;
    likes_count: number;
    source: string[];
    title: string;
}

export interface PostAnswer {
    all: Post[];
    image: Post[];
    video: Post[];
}

interface PostState {
    posts: PostAnswer;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PostState = {
    posts: {
        all: [],
        image: [],
        video: []
    },
    status: 'idle',
    error: null,
};

export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
    const response = await axios.get('https://api-rubin.multfilm.tatar/api/posts');
    return response.data as PostAnswer;
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
            .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<PostAnswer>) => {
                console.log(state)
                // @ts-ignore
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

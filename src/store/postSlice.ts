import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {Client, IComment} from "../types";
import exp from "constants";

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
    likedPosts: number[];
}

const initialState: PostState = {
    posts: {
        all: [],
        image: [],
        video: []
    },
    status: 'idle',
    error: null,
    likedPosts: [],
};

export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
    const response = await axios.get('https://api-rubin.multfilm.tatar/api/posts');
    return response.data as PostAnswer;
})

export const createPost = createAsyncThunk('post/createPost', async (formData: FormData) => {
    const response = await axios.post('https://api-rubin.multfilm.tatar/api/posts', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
});

export const toggleLikeAsync = createAsyncThunk(
    'posts/toggleLikeAsync',
    async ({ postId, postType, userId }: { postId: number, postType: 'all' | 'image' | 'video', userId: number }, { dispatch }) => {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            console.log(token);
            await axios.post(
                `https://api-rubin.multfilm.tatar/api/posts/${postId}/like`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            dispatch(addLike({ postId, postType }));
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    }
);

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        addLike: (state, action: PayloadAction<{ postId: number, postType: 'all' | 'image' | 'video' }>) => {
            const { postId, postType } = action.payload;
            const postsArray = state.posts[postType];
            const post = postsArray.find(p => p.id === postId);
            if (post) {
                if (!state.likedPosts.includes(postId)) {
                    post.likes_count += 1;
                    state.likedPosts.push(postId);
                }
            }
        },
    },
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

export const { addLike } = postSlice.actions;

export default postSlice.reducer;

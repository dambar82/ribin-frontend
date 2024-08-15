import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {Client, IComment} from "../types";
import exp from "constants";

export interface IPost {
    client: Client;
    comments: IComment[];
    description: string;
    id: number;
    liked_by: number[];
    likes_count: number;
    source: string[];
    title: string;
    created_at: string;
}

export interface PostAnswer {
    all: IPost[];
    image: IPost[];
    video: IPost[];
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

const token = JSON.parse(localStorage.getItem('user'))?.token;

export const createComment = createAsyncThunk('post/createComment', async () => {
    await axios.post('https://rubin/api/club/1/comments')
})

export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
    const response = await axios.get('https://api-rubin.multfilm.tatar/api/posts');
    return response.data as PostAnswer;
})

export const fetchPostsByUserId = createAsyncThunk('post/fetchPostsByUserId', async ({userId} : { userId: number }) => {
    console.log(userId)
    const response = await axios.get(`https://api-rubin.multfilm.tatar/api/reposts/${userId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    )
    return response.data as PostAnswer;
})

export const createPost = createAsyncThunk('post/createPost', async (formData: FormData) => {
    const response = await axios.post('https://api-rubin.multfilm.tatar/api/posts', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
    });
    return response.data.data;
});

export const toggleLikeAsync = createAsyncThunk(
    'posts/toggleLikeAsync',
    async ({ postId, postType, userId }: { postId: number, postType: 'all' | 'image' | 'video', userId: number }, { dispatch }) => {
        console.log(token);
        try {
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
        addPost: (state, action: any) => {
            // Используем иммутабельный метод для обновления состояния
            // @ts-ignore
            console.log(action.payload);
            state.posts.all = [action.payload, ...state.posts.all]; // Добавляем новый пост в начало массива
            console.log(state.posts.all);
        },
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
            .addCase(fetchPostsByUserId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<PostAnswer>) => {
                // @ts-ignore
                state.posts = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchPostsByUserId.fulfilled, (state, action: PayloadAction<PostAnswer>) => {
                state.posts = action.payload;
                console.log(action.payload);
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(fetchPostsByUserId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
    }
});

export const { addLike, addPost } = postSlice.actions;

export default postSlice.reducer;

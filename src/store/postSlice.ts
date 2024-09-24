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
    complaint_types:  {id:number,title:string}[]
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
    complaint_types: [],
    status: 'idle',
    error: null,
    likedPosts: [],
};

const $api = axios.create({
  baseURL: 'https://api-rubin.multfilm.tatar'
})

$api.interceptors.request.use(config => {
  const token = JSON.parse(localStorage.getItem('token') || '0')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const token = JSON.parse(localStorage.getItem('token') || '0')

// export const createComment = createAsyncThunk('post/createComment', async () => {
//     await axios.post('https://rubin/api/club/1/comments')
// })

export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
    const response = await axios.get('https://api-rubin.multfilm.tatar/api/posts');
    return response.data as PostAnswer;
})

export const fetchPostsByUserId = createAsyncThunk('post/fetchPostsByUserId', async ({userId} : { userId: number }) => {
    const response = await axios.get(`https://api-rubin.multfilm.tatar/api/reposts/${userId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    )
    return response.data as PostAnswer;
})

export const fetchPostsByClubId = createAsyncThunk('post/fetchPostsByClubId', async ({clubId} : {clubId: number}) => {
    const response = await axios.get(`https://api-rubin.multfilm.tatar/api/club/posts/${clubId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data as PostAnswer;
})

export const createPostInClub = createAsyncThunk('post/createPostInClub', async ({clubId, formData} : {clubId: number, formData: FormData}) => {
    const response = await axios.post(`https://api-rubin.multfilm.tatar/api/club/${clubId}/posts`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data as PostAnswer;
})

export const deletePostAsync = createAsyncThunk('post/deletePost', async ({postId}: {postId: number}) => {
    const response = await axios.delete(`https://api-rubin.multfilm.tatar/api/posts/${postId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
})

export const editPostAsync = createAsyncThunk('post/editPostAsync', async ({postId, formData}: {postId: number, formData: FormData}) => {
    const response = await axios.post(`https://api-rubin.multfilm.tatar/api/posts/${postId}`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
})

export const createPost = createAsyncThunk('post/createPost', async (formData: FormData) => {
    const response = await axios.post('https://api-rubin.multfilm.tatar/api/posts', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
    });
    return response.data;
});

export const createComment = createAsyncThunk('post/createComment', async ({formData, postId} : {formData: FormData, postId: number}) => {
  //  console.log(token)
    const response = await axios.post(`https://api-rubin.multfilm.tatar/api/posts/${postId}/comments`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data.comment;
})

export const deleteCommentAsync = createAsyncThunk('post/deleteCommentAsync', async ({commentId}: {commentId: number}) => {
    const response = await axios.delete(`https://api-rubin.multfilm.tatar/api/comments/${commentId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
})

export const commentLikeAsync = createAsyncThunk(
    'posts/commentLikeAsync',
    async ({commentId} : {commentId: number}) => {
        try {
            await axios.post(
                `https://api-rubin.multfilm.tatar/api/comments/${commentId}/like`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    }
)

export const toggleLikeAsync = createAsyncThunk(
    'posts/toggleLikeAsync',
    async ({ postId, postType, userId }: { postId: number, postType: 'all' | 'image' | 'video', userId: number }, { dispatch }) => {
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

export const fetchComplaintTypes = createAsyncThunk('post/fetchComplaintTypes', async () => {
  const response = await axios.get<{id:number,title:string}[]>('https://api-rubin.multfilm.tatar/api/complaint_type');
  return response.data;
})

export const sendPostComplaint = createAsyncThunk('post/sendPostComplaint', async ( req: { id: number, complaint_type_id: number, complaint_type: string, description: string } ) => {
  try {
    const response = await $api.post<{status:string,message:string}>(`/api/complaints/posts/${req.id}`, req);
    return response.data;
  } catch (error) {
    console.log(error);
    return error?.response.data
  }
})
export const sendCommentComplaint = createAsyncThunk('post/sendCommentComplaint', async ( req: { id: number, complaint_type_id: number, complaint_type: string, description: string } ) => {
  try {
    const response = await $api.post<{status:string,message:string}>(`/api/complaints/comments/${req.id}`, req);
    return response.data;
  } catch (error) {
    console.log(error);
    return error?.response.data
  }
})

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        addPost: (state, action: any) => {
            state.posts.all = [action.payload, ...state.posts.all]; // Добавляем новый пост в начало массива
        },
        addComment: (state, action: any) => {
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
        deletePost: (state, action: PayloadAction<{ postId: number }>) => {
            const { postId } = action.payload;
            state.posts.all = state.posts.all.filter(post => post.id !== postId);
            state.posts.image = state.posts.image.filter(post => post.id !== postId);
            state.posts.video = state.posts.video.filter(post => post.id !== postId);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.posts = {
                    all: [],
                    video: [],
                    image: []
                };
                state.status = 'loading';
            })
            .addCase(fetchPostsByUserId.pending, (state) => {
                state.posts = {
                    all: [],
                    video: [],
                    image: []
                };
                state.status = 'loading';
            })
            .addCase(fetchPostsByClubId.pending, (state) => {
                state.posts = {
                    all: [],
                    video: [],
                    image: []
                };
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
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchPostsByClubId.fulfilled, (state, action: PayloadAction<PostAnswer>) => {
                state.posts = action.payload;
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
            .addCase(fetchPostsByClubId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })

            .addCase(fetchComplaintTypes.fulfilled, (state, action: PayloadAction<{id:number,title:string}[]>) => {
              state.complaint_types = action.payload;
            })

            .addCase(sendPostComplaint.fulfilled, (state, action: PayloadAction<any>) => {
            })
            .addCase(sendCommentComplaint.fulfilled, (state, action: PayloadAction<any>) => {
            })
    }
});

export const { addLike, addPost, addComment, deletePost } = postSlice.actions;

export default postSlice.reducer;

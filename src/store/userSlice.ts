import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {Clubs, ContestUser, Post} from "../types";
import { TEditUserRequest, TEditUserResponse, TResetPasswordRequest, TResetPasswordResponse, TRestorePasswordRequest, TRestorePasswordResponse } from '../shared/types/user.types'
import { TCheckAuthResponse, TLoginUserResponse, TConfirmEmailResponse, TRegisterUserRequest, TRegisterUserResponse, TConfirmEmailRequest } from '../shared/types/auth.types'
import { TEvent } from '../shared/types/event.types'

export interface User {
    filled: number;
    online: boolean;
    avatar: string | null;
    id: number;
    email: string;
    email_confirmed: boolean
    name: string;
    surname: string;
    birthdate: number;
    password: string;
    address: string | null;
    phone: string | null;
    score: number | null;
    posts: Post[];
    level: number | null;
    friends: User[];
    contests: ContestUser[];
    image: string;
    description: string;
    district: any;
    clubs: Clubs[];
    events: TEvent[];
    rubick: any;
    school: string;
    school_number: number;
    status: any;
    register_date: string
}

interface AuthResponse {
    client: User;
    token: string;
}

interface UserState {
    user: User | null;
    // token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    confirmEmailStatus: TConfirmEmailResponse | null
}

const initialState: UserState = {
    user: null,
    status: 'idle',
    error: null,
    confirmEmailStatus: null
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

export const loginUser = createAsyncThunk('user/loginUser', async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await axios.post<TLoginUserResponse>('https://api-rubin.multfilm.tatar/api/login', { email, password });
    return response.data
  } catch (error) {
    console.log(error);
    return error?.response.data
  }
});

export const confirmEmail = createAsyncThunk('user/confirmEmail', async (sendObj: TConfirmEmailRequest) => {
  try {
    const response = await $api.post<TConfirmEmailResponse>('/api/clients/confirm-email', sendObj);
    return response.data
  } catch (error) {
    console.log(error);
    return error?.response.data
  }
});
export const resendConfirmEmail = createAsyncThunk('user/resendConfirmEmail', async (sendObj: TConfirmEmailRequest) => {
  try {
    const response = await $api.post<TConfirmEmailResponse>('/api/clients/resend-confirmation', sendObj);
    return response.data
  } catch (error) {
    console.log(error);
    return error?.response.data
  }
});

export const registerUser = createAsyncThunk('user/registerUser', async (sendObj: TRegisterUserRequest) => {
  try {
    const response = await axios.post<TRegisterUserResponse>('https://api-rubin.multfilm.tatar/api/clients', sendObj);
    return response.data
  } catch (error) {
    console.log(error);
    return error?.response.data
  }
});

export const checkAuth = createAsyncThunk('user/checkAuth', async () => {
  const user_id = JSON.parse(localStorage.getItem('user_id') || '0')
  if ( !user_id ) return null
  const response = await $api.get<TCheckAuthResponse>(`/api/clients/${user_id}`);
  return response.data.data
});

export const editUser = createAsyncThunk('user/editUser', async ( sendObj: TEditUserRequest ) => {
  const response = await $api.put<TEditUserResponse>(`/api/clients/${sendObj.id}`, sendObj);
  return response.data.data
});

export const resetPassword = createAsyncThunk('user/resetPassword', async ( sendObj: TResetPasswordRequest ) => {
  try {
    const response = await $api.post<TResetPasswordResponse>('/api/reset-password', sendObj);
    return response.data
  } catch (error) {
    console.log(error);
    return error?.response.data
  }
});

export const restorePassword = createAsyncThunk('user/restorePassword', async (data: { req: TRestorePasswordRequest, token: string }) => {
  try {
    const response = await $api.put<TRestorePasswordResponse>(`/api/restore-password/${data.token}`, data.req);
    return response.data
  } catch (error) {
    console.log(error);
    return error?.response.data
  }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            // state.token = null;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
        },
        setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            // state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload)); // Сохранение пользователя и токена в localStorage
        },
        clearUser: (state) => {
            state.user = null;
            state.confirmEmailStatus = null
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
        },
        emailConfirmed: (state) => {
          if ( state.user ) {
            state.user.email_confirmed = true
            state.confirmEmailStatus = null
          }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<TLoginUserResponse>) => {
              console.log(action.payload);
              
              //@ts-ignore
                if ( action.payload?.status === 'error' ) {
                  return
                }
                if (action.payload?.token) {
                    state.user = action.payload.client;
                    state.status = 'succeeded';
                    localStorage.setItem('token', JSON.stringify(action.payload.token));
                    localStorage.setItem('user_id', JSON.stringify(action.payload.client.id));
                    state.error = null;
                } else {
                    // Если токен отсутствует, это может быть ошибка
                    state.status = 'failed';
                    state.error = action.payload?.message || 'Ошибка авторизации';
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })

            .addCase(confirmEmail.fulfilled, (state, action: PayloadAction<TConfirmEmailResponse>) => {
                console.log(action.payload);

                state.confirmEmailStatus = action.payload
            })

            .addCase(resendConfirmEmail.fulfilled, (state, action: PayloadAction<TConfirmEmailResponse>) => {
                console.log(action.payload);

                // state.confirmEmailStatus = action.payload
            })

            .addCase(registerUser.fulfilled, (state, action: PayloadAction<TLoginUserResponse>) => {
                if ( action.payload?.errors ) {
                  return
                }
                if (action.payload?.token) {
                // state.user = action.payload.client;
                state.status = 'succeeded';
                // localStorage.setItem('token', JSON.stringify(action.payload.token));
                // localStorage.setItem('user_id', JSON.stringify(action.payload.client.id));
                state.error = null;
                } else {
                    // Если токен отсутствует, это может быть ошибка
                    state.status = 'failed';
                    state.error = action.payload?.message || 'Ошибка авторизации';
                }
            })

            .addCase(checkAuth.fulfilled, (state, action: PayloadAction<TCheckAuthResponse['data']>) => {
                state.user = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })

            .addCase(editUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                // localStorage.setItem('user', JSON.stringify({ client: action.payload, token: state.token }));
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })

            .addCase(resetPassword.fulfilled, (state, action: PayloadAction<TResetPasswordResponse>) => {
              console.log(action.payload);
            })

            .addCase(restorePassword.fulfilled, (state, action: PayloadAction<TRestorePasswordResponse>) => {
              console.log(action.payload);
            })
    },
});

export const { logout, setUser, clearUser, emailConfirmed } = userSlice.actions;
export default userSlice.reducer;

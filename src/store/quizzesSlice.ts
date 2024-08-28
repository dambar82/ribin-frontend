import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { TFetchQuizzesResponse, TGetQuizByIdResponse, TQuiz, TSendQuizResultRequest, TSendQuizResultResponse } from '../shared/types/quiz.types'

interface PhotoGalleryState {
  quiz: TQuiz | null
  quizzes: TQuiz[] | null
}

const initialState: PhotoGalleryState = {
  quiz: null,
  quizzes: null
};

const $api = axios.create({
  baseURL: 'https://api-rubin.multfilm.tatar'
})

export const fetchQuizzes = createAsyncThunk('quizzes/fetchQuizzes', async () => {
    const response = await $api.get<TFetchQuizzesResponse>('api/quiz');
    return response.data.data
});

export const getQuizById = createAsyncThunk('quizzes/getQuizById', async ( id: string ) => {
    const response = await $api.get<TGetQuizByIdResponse>(`api/quiz/${id}`);
    return response.data.data
});

export const sendQuizResult = createAsyncThunk('quizzes/sendQuizResult', async ( sendObj: TSendQuizResultRequest ) => {
  $api.interceptors.request.use(config => {
    const token = JSON.parse(localStorage.getItem('token') || '0')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  const response = await $api.post<TSendQuizResultResponse>('api/quiz', sendObj);
  return response.data.data
});


const quizzesSlice = createSlice({
    name: 'quizzes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder

        .addCase(fetchQuizzes.fulfilled, (state, action: PayloadAction<TFetchQuizzesResponse['data']>) => {
          state.quizzes = action.payload
        })

        .addCase(getQuizById.fulfilled, (state, action: PayloadAction<TGetQuizByIdResponse['data']>) => {
          state.quiz = action.payload
        })

        .addCase(sendQuizResult.fulfilled, (state, action: PayloadAction<TSendQuizResultResponse['data']>) => {
          console.log(action.payload?.message);
        })
    }
})

export default quizzesSlice.reducer;

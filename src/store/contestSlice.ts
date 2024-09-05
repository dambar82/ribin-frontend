import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Contest } from '../types';

interface ContestState {
    contests: Contest[];
    contestStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ContestState = {
    contests: [],
    contestStatus: 'idle',
    error: null,
};

const token = JSON.parse(localStorage.getItem('token') || '0')

export const fetchContests = createAsyncThunk('contests/fetchContests', async () => {
    const response = await axios.get('https://api-rubin.multfilm.tatar/api/contest');
    return response.data.data as Contest[];
});

export const sendWorkForContest = createAsyncThunk('contests/sendWorkForContest',
    async ({description, source, video, contest_id, client_id}: {description?: string, source: File[], video: string, contest_id: number, client_id: number}) => {
        try {
            const formData = new FormData();
            formData.append('description', description);
            source.forEach((file, index) => {
                formData.append(`source[${index}]`, file);
            });
            formData.append('video', video);
            formData.append('contest_id', contest_id.toString());
            formData.append('client_id', client_id.toString());

            const response = await axios.post(`https://api-rubin.multfilm.tatar/api/contest/${contest_id}/take_part`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            if (error.response) {
                // Сервер ответил с кодом состояния, который выходит за пределы диапазона 2xx
                console.error('Ошибка при отправке формы: ', error.response.data);
                // Здесь вы можете добавить дополнительную логику обработки ошибки
            } else if (error.request) {
                // Запрос был сделан, но ответ не был получен
                console.error('Ошибка при отправке формы: ', error.request);
            } else {
                // Что-то пошло не так при настройке запроса
                console.error('Ошибка: ', error.message);
            }
        }
    });

//old version
// export const sendWorkForContest = createAsyncThunk('contests/sendWorkForContest',
//     async ({description, source, video, contest_id, client_id}: {description?: string, source: File, video: string, contest_id: number, client_id: number}) => {
//         const response = await axios.post('https://api-rubin.multfilm.tatar/api/contest', {
//         description: description,
//             source: source,
//             video: video,
//             contest_id: contest_id,
//             client_id: client_id
//     })
// console.log(response.data);
// })

const contestSlice = createSlice({
    name: 'contests',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContests.pending, (state) => {
                state.contestStatus = 'loading';
            })
            .addCase(fetchContests.fulfilled, (state, action: PayloadAction<Contest[]>) => {
                state.contests = action.payload;
                state.contestStatus = 'succeeded';
                state.error = null;
            })
            .addCase(fetchContests.rejected, (state, action) => {
                state.contestStatus = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export default contestSlice.reducer;

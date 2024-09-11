import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";

const initialState = {
    award: JSON.parse(localStorage.getItem('award')) === null ? true : false, // начальное значение из localStorage
};

const token = JSON.parse(localStorage.getItem('token') || '0')

export const buyAward = createAsyncThunk('award/buyAward', async (formData) => {
    console.log(formData)
    const response = await axios.post('https://api-rubin.multfilm.tatar/api/gifts/promo_code', formData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
})

const awardSlice = createSlice({
    name: 'award',
    initialState,
    reducers: {
        setAward(state, action) {
            state.award = action.payload;
            console.log(action.payload)
            localStorage.setItem('award', JSON.stringify(action.payload)); // сохраняем в localStorage
        },
    },
});

export const { setAward } = awardSlice.actions;
export const selectAward = (state) => state.award.award;

export default awardSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    award: JSON.parse(localStorage.getItem('award')) === null ? true : false, // начальное значение из localStorage
};




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

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import contestReducer from './contestSlice';
import newsReducer from './newsSlice';
import clubsReducer from './clubsSlice';
import peopleReducer from './peopleSlice';
import studensSlice from './studensSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        contests: contestReducer,
        news: newsReducer,
        clubs: clubsReducer,
        people: peopleReducer,
        students: studensSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

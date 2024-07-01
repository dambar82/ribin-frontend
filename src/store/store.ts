import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import contestReducer from './contestSlice';
import newsReducer from './newsSlice';
import clubsReducer from './clubsSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        contests: contestReducer,
        news: newsReducer,
        clubs: clubsReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import contestReducer from './contestSlice';
import newsReducer from './newsSlice';
import clubsReducer from './clubsSlice';
import peopleReducer from './peopleSlice';
import studentsReducer from './studentsSlice';
import coachesReducer from './coachesSlice';
import photoGalleryReducer from './photoGallerySlice';
import sportReducer from './sportSlice';
import postReducer from './postSlice';
import eventsReducer from './eventsSlice'
import quizzesReducer from './quizzesSlice'
import friendsReducer from "./friendsSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        contests: contestReducer,
        news: newsReducer,
        clubs: clubsReducer,
        people: peopleReducer,
        students: studentsReducer,
        coaches: coachesReducer,
        photoGallery: photoGalleryReducer,
        sport: sportReducer,
        post: postReducer,
        events: eventsReducer,
        quizzes: quizzesReducer,
        friends: friendsReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

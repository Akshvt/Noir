import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import movieReducer from '../features/movieSlice';
import favoriteReducer from '../features/favoriteSlice';
import watchHistoryReducer from '../features/watchHistorySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        movies: movieReducer,
        favorites: favoriteReducer,
        watchHistory: watchHistoryReducer,
    },
});

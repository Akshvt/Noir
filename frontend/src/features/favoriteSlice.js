import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import backend from '../api/backend';

export const fetchFavorites = createAsyncThunk('favorites/fetch', async (_, { rejectWithValue }) => {
    try {
        const res = await backend.get('/favorites');
        return res.data.favorites;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch favorites');
    }
});

export const addFavorite = createAsyncThunk('favorites/add', async (data, { rejectWithValue }) => {
    try {
        const res = await backend.post('/favorites', data);
        return res.data.favorite;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to add favorite');
    }
});

export const removeFavorite = createAsyncThunk('favorites/remove', async (tmdbId, { rejectWithValue }) => {
    try {
        await backend.delete(`/favorites/${tmdbId}`);
        return tmdbId;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to remove favorite');
    }
});

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => { state.loading = true; })
            .addCase(fetchFavorites.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchFavorites.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(addFavorite.fulfilled, (state, action) => { state.items.unshift(action.payload); })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.items = state.items.filter(f => f.tmdbId !== action.payload);
            });
    },
});

export default favoriteSlice.reducer;

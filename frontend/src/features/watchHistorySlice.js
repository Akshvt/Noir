import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import backend from '../api/backend';

export const fetchWatchHistory = createAsyncThunk('watchHistory/fetch', async (_, { rejectWithValue }) => {
    try {
        const res = await backend.get('/watch-history');
        return res.data.history;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch watch history');
    }
});

export const addToWatchHistory = createAsyncThunk('watchHistory/add', async (data, { rejectWithValue }) => {
    try {
        const res = await backend.post('/watch-history', data);
        return res.data.history;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to add to history');
    }
});

const watchHistorySlice = createSlice({
    name: 'watchHistory',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWatchHistory.pending, (state) => { state.loading = true; })
            .addCase(fetchWatchHistory.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchWatchHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(addToWatchHistory.fulfilled, (state, action) => {
                state.items = state.items.filter(h => h.tmdbId !== action.payload.tmdbId);
                state.items.unshift(action.payload);
            });
    },
});

export default watchHistorySlice.reducer;

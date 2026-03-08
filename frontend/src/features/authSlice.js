import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import backend from '../api/backend';

export const signup = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
    try {
        const res = await backend.post('/auth/signup', data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Signup failed');
    }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
    try {
        const res = await backend.post('/auth/login', data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    await backend.post('/auth/logout');
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
    try {
        const res = await backend.get('/auth/profile');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Not authenticated');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
    },
    reducers: {
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(signup.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.isAuthenticated = true; })
            .addCase(signup.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.isAuthenticated = true; })
            .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(logout.fulfilled, (state) => { state.user = null; state.isAuthenticated = false; })
            .addCase(getProfile.fulfilled, (state, action) => { state.user = action.payload.user; state.isAuthenticated = true; state.loading = false; })
            .addCase(getProfile.rejected, (state) => { state.user = null; state.isAuthenticated = false; state.loading = false; });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

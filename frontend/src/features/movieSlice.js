import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrending, getPopular, getTopRated, getTVPopular, getMovieDetails, getTVDetails, searchMulti, getGenres } from '../api/tmdb';

export const fetchTrending = createAsyncThunk('movies/fetchTrending', async (page = 1) => {
    const res = await getTrending(page);
    return { results: res.data.results, page: res.data.page, totalPages: res.data.total_pages };
});

export const fetchPopular = createAsyncThunk('movies/fetchPopular', async (page = 1) => {
    const res = await getPopular(page);
    return { results: res.data.results, page: res.data.page, totalPages: res.data.total_pages };
});

export const fetchTopRated = createAsyncThunk('movies/fetchTopRated', async (page = 1) => {
    const res = await getTopRated(page);
    return { results: res.data.results, page: res.data.page, totalPages: res.data.total_pages };
});

export const fetchTVPopular = createAsyncThunk('movies/fetchTVPopular', async (page = 1) => {
    const res = await getTVPopular(page);
    return { results: res.data.results, page: res.data.page, totalPages: res.data.total_pages };
});

export const fetchMovieDetails = createAsyncThunk('movies/fetchMovieDetails', async ({ id, type = 'movie' }) => {
    const res = type === 'tv' ? await getTVDetails(id) : await getMovieDetails(id);
    return res.data;
});

export const fetchSearch = createAsyncThunk('movies/fetchSearch', async ({ query, page = 1 }) => {
    const res = await searchMulti(query, page);
    return { results: res.data.results, page: res.data.page, totalPages: res.data.total_pages, query };
});

export const fetchGenres = createAsyncThunk('movies/fetchGenres', async () => {
    const res = await getGenres();
    return res.data.genres;
});

const movieSlice = createSlice({
    name: 'movies',
    initialState: {
        trending: { results: [], page: 1, totalPages: 1, loading: false },
        popular: { results: [], page: 1, totalPages: 1, loading: false },
        topRated: { results: [], page: 1, totalPages: 1, loading: false },
        tvPopular: { results: [], page: 1, totalPages: 1, loading: false },
        details: { data: null, loading: false, error: null },
        search: { results: [], page: 1, totalPages: 1, loading: false, query: '' },
        genres: [],
    },
    reducers: {
        clearDetails: (state) => { state.details = { data: null, loading: false, error: null }; },
        clearSearch: (state) => { state.search = { results: [], page: 1, totalPages: 1, loading: false, query: '' }; },
    },
    extraReducers: (builder) => {
        builder
            // Trending
            .addCase(fetchTrending.pending, (state) => { state.trending.loading = true; })
            .addCase(fetchTrending.fulfilled, (state, action) => {
                state.trending.loading = false;
                if (action.payload.page === 1) {
                    state.trending.results = action.payload.results;
                } else {
                    state.trending.results = [...state.trending.results, ...action.payload.results];
                }
                state.trending.page = action.payload.page;
                state.trending.totalPages = action.payload.totalPages;
            })
            .addCase(fetchTrending.rejected, (state) => { state.trending.loading = false; })
            // Popular
            .addCase(fetchPopular.pending, (state) => { state.popular.loading = true; })
            .addCase(fetchPopular.fulfilled, (state, action) => {
                state.popular.loading = false;
                if (action.payload.page === 1) {
                    state.popular.results = action.payload.results;
                } else {
                    state.popular.results = [...state.popular.results, ...action.payload.results];
                }
                state.popular.page = action.payload.page;
                state.popular.totalPages = action.payload.totalPages;
            })
            .addCase(fetchPopular.rejected, (state) => { state.popular.loading = false; })
            // Top Rated
            .addCase(fetchTopRated.pending, (state) => { state.topRated.loading = true; })
            .addCase(fetchTopRated.fulfilled, (state, action) => {
                state.topRated.loading = false;
                if (action.payload.page === 1) {
                    state.topRated.results = action.payload.results;
                } else {
                    state.topRated.results = [...state.topRated.results, ...action.payload.results];
                }
                state.topRated.page = action.payload.page;
                state.topRated.totalPages = action.payload.totalPages;
            })
            .addCase(fetchTopRated.rejected, (state) => { state.topRated.loading = false; })
            // TV Popular
            .addCase(fetchTVPopular.pending, (state) => { state.tvPopular.loading = true; })
            .addCase(fetchTVPopular.fulfilled, (state, action) => {
                state.tvPopular.loading = false;
                state.tvPopular.results = action.payload.results;
                state.tvPopular.page = action.payload.page;
                state.tvPopular.totalPages = action.payload.totalPages;
            })
            .addCase(fetchTVPopular.rejected, (state) => { state.tvPopular.loading = false; })
            // Details
            .addCase(fetchMovieDetails.pending, (state) => { state.details.loading = true; state.details.error = null; })
            .addCase(fetchMovieDetails.fulfilled, (state, action) => { state.details.loading = false; state.details.data = action.payload; })
            .addCase(fetchMovieDetails.rejected, (state, action) => { state.details.loading = false; state.details.error = action.error.message; })
            // Search
            .addCase(fetchSearch.pending, (state) => { state.search.loading = true; })
            .addCase(fetchSearch.fulfilled, (state, action) => {
                state.search.loading = false;
                if (action.payload.page === 1) {
                    state.search.results = action.payload.results;
                } else {
                    state.search.results = [...state.search.results, ...action.payload.results];
                }
                state.search.page = action.payload.page;
                state.search.totalPages = action.payload.totalPages;
                state.search.query = action.payload.query;
            })
            .addCase(fetchSearch.rejected, (state) => { state.search.loading = false; })
            // Genres
            .addCase(fetchGenres.fulfilled, (state, action) => { state.genres = action.payload; });
    },
});

export const { clearDetails, clearSearch } = movieSlice.actions;
export default movieSlice.reducer;

import axios from 'axios';

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const TMDB_IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

const tmdb = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
    },
});

export const getTrending = (page = 1) => tmdb.get('/trending/all/week', { params: { page } });
export const getPopular = (page = 1) => tmdb.get('/movie/popular', { params: { page } });
export const getTopRated = (page = 1) => tmdb.get('/movie/top_rated', { params: { page } });
export const getTVPopular = (page = 1) => tmdb.get('/tv/popular', { params: { page } });
export const getMovieDetails = (id) => tmdb.get(`/movie/${id}`, { params: { append_to_response: 'credits,videos,images,similar' } });
export const getTVDetails = (id) => tmdb.get(`/tv/${id}`, { params: { append_to_response: 'credits,videos,images,similar' } });
export const searchMulti = (query, page = 1) => tmdb.get('/search/multi', { params: { query, page } });
export const getMoviesByGenre = (genreId, page = 1) => tmdb.get('/discover/movie', { params: { with_genres: genreId, page } });
export const getGenres = () => tmdb.get('/genre/movie/list');

export const posterUrl = (path, size = 'w500') => path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null;
export const backdropUrl = (path, size = 'original') => path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null;

export default tmdb;

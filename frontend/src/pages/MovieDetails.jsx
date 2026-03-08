import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails, clearDetails } from '../features/movieSlice';
import { addFavorite, removeFavorite } from '../features/favoriteSlice';
import { addToWatchHistory } from '../features/watchHistorySlice';
import { posterUrl, backdropUrl } from '../api/tmdb';
import { PLACEHOLDER_POSTER, PLACEHOLDER_BACKDROP, formatRuntime, getYear, getTrailerKey } from '../utils/helpers';
import TrailerModal from '../components/TrailerModal';
import MovieCard from '../components/MovieCard';
import { SkeletonDetails } from '../components/Skeleton';
import { motion } from 'framer-motion';
import backend from '../api/backend';

export default function MovieDetails() {
    const { id } = useParams();
    const location = useLocation();
    const type = location.pathname.startsWith('/tv') ? 'tv' : 'movie';
    const dispatch = useDispatch();
    const { data: movie, loading, error } = useSelector((state) => state.movies.details);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [showTrailer, setShowTrailer] = useState(false);
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        dispatch(fetchMovieDetails({ id, type }));
        return () => dispatch(clearDetails());
    }, [dispatch, id, type]);

    // Auto add to watch history
    useEffect(() => {
        if (movie && isAuthenticated) {
            dispatch(addToWatchHistory({
                tmdbId: movie.id,
                title: movie.title || movie.name,
                posterPath: movie.poster_path || '',
                mediaType: type,
            }));
        }
    }, [movie, isAuthenticated, dispatch, type]);

    // Check if favorited
    useEffect(() => {
        if (movie && isAuthenticated) {
            backend.get(`/favorites/check/${movie.id}`).then(res => setIsFav(res.data.isFavorite)).catch(() => { });
        }
    }, [movie, isAuthenticated]);

    const handleToggleFavorite = () => {
        if (!isAuthenticated) return;
        if (isFav) {
            dispatch(removeFavorite(movie.id));
            setIsFav(false);
        } else {
            dispatch(addFavorite({
                tmdbId: movie.id,
                title: movie.title || movie.name,
                posterPath: movie.poster_path || '',
                mediaType: type,
                rating: movie.vote_average,
                releaseDate: movie.release_date || movie.first_air_date,
            }));
            setIsFav(true);
        }
    };

    if (loading) return <SkeletonDetails />;
    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center p-12 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-5xl text-primary/40">sentiment_dissatisfied</span>
                <h4 className="text-xl font-bold">Oops! Something went wrong</h4>
                <p className="text-slate-400">We couldn't load this movie. Please try again later.</p>
            </div>
        </div>
    );
    if (!movie) return null;

    const title = movie.title || movie.name || 'Untitled';
    const poster = posterUrl(movie.poster_path) || PLACEHOLDER_POSTER;
    const backdrop = backdropUrl(movie.backdrop_path) || PLACEHOLDER_BACKDROP;
    const trailerKey = getTrailerKey(movie.videos);
    const cast = movie.credits?.cast?.slice(0, 6) || [];
    const similarMovies = movie.similar?.results?.slice(0, 5) || [];
    const images = movie.images?.backdrops?.slice(0, 4) || [];

    return (
        <main className="flex-1">
            {/* Hero Backdrop */}
            <section className="relative w-full aspect-[21/9] min-h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${backdrop}")` }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #221012 0%, rgba(34,16,18,0.6) 50%, rgba(34,16,18,0) 100%)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <button onClick={() => setShowTrailer(true)} className="group flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-white shadow-xl shadow-primary/40 hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                        <span className="text-lg font-bold">Watch Trailer</span>
                    </button>
                </div>
            </section>

            {/* Main Info */}
            <div className="mx-auto max-w-7xl px-6 lg:px-20 -mt-32 relative z-10 pb-20">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Poster */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="aspect-[2/3] w-full rounded-xl shadow-2xl overflow-hidden bg-primary/20">
                            <img src={poster} alt={title} className="w-full h-full object-cover" onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-black leading-tight">{title}</h1>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-400 flex-wrap">
                                <span>{getYear(movie.release_date || movie.first_air_date)}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                <span>{movie.genres?.map(g => g.name).join(', ') || 'N/A'}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                <span>{formatRuntime(movie.runtime)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="text-xl font-bold">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                                <span className="text-sm text-slate-400">/ 10 (TMDB)</span>
                            </div>
                        </div>
                    </div>

                    {/* Synopsis */}
                    <div className="lg:col-span-5 pt-4 lg:pt-40">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">notes</span>
                            Synopsis
                        </h2>
                        <p className="text-lg leading-relaxed text-slate-300">
                            {movie.overview || 'Description not available'}
                        </p>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {movie.credits?.crew?.find(c => c.job === 'Director') && (
                                <div>
                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Director</p>
                                    <p className="font-medium">{movie.credits.crew.find(c => c.job === 'Director').name}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Status</p>
                                <p className="font-medium">{movie.status || 'Released'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-3 pt-4 lg:pt-40">
                        <div className="flex flex-col gap-3 sticky top-24">
                            <button
                                onClick={handleToggleFavorite}
                                className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 font-bold transition-colors ${isFav ? 'bg-primary text-white' : 'bg-primary/10 border border-primary/20 text-slate-100 hover:bg-primary/20'}`}
                            >
                                <span className="material-symbols-outlined" style={isFav ? { fontVariationSettings: "'FILL' 1" } : {}}>favorite</span>
                                {isFav ? 'In Favorites' : 'Add to Favorites'}
                            </button>
                            <button
                                onClick={() => setShowTrailer(true)}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-white hover:bg-primary/90 transition-colors"
                            >
                                <span className="material-symbols-outlined">play_circle</span>
                                Watch Trailer
                            </button>
                            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Available on</p>
                                <div className="flex gap-4">
                                    <span className="material-symbols-outlined text-3xl opacity-50">nest_display_max</span>
                                    <span className="material-symbols-outlined text-3xl opacity-50">tv_gen</span>
                                    <span className="material-symbols-outlined text-3xl opacity-50">devices</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Cast */}
                {cast.length > 0 && (
                    <section className="mt-20">
                        <h3 className="text-2xl font-bold mb-8">Cast & Crew</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {cast.map((person) => (
                                <div key={person.id} className="flex flex-col items-center text-center gap-3">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20">
                                        <img
                                            src={person.profile_path ? posterUrl(person.profile_path, 'w185') : PLACEHOLDER_POSTER}
                                            alt={person.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{person.name}</p>
                                        <p className="text-sm text-slate-400">{person.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Media */}
                {images.length > 0 && (
                    <section className="mt-20">
                        <h3 className="text-2xl font-bold mb-8">Media</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                                    <img src={backdropUrl(img.file_path, 'w780')} alt="Still" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Similar */}
                {similarMovies.length > 0 && (
                    <section className="mt-20">
                        <h3 className="text-2xl font-bold mb-8">Similar Movies</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {similarMovies.map((m, idx) => (
                                <MovieCard key={m.id} item={{ ...m, media_type: type }} index={idx} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Trailer Modal */}
            {showTrailer && (
                <TrailerModal videoKey={trailerKey} onClose={() => setShowTrailer(false)} />
            )}
        </main>
    );
}

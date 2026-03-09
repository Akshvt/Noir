import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails } from '../features/movieSlice';
import { addFavorite, removeFavorite, fetchFavorites } from '../features/favoriteSlice';
import { addToWatchHistory } from '../features/watchHistorySlice';
import { posterUrl, backdropUrl } from '../api/tmdb';
import { PLACEHOLDER_POSTER, PLACEHOLDER_BACKDROP, getYear } from '../utils/helpers';
import TrailerModal from '../components/TrailerModal';
import { SkeletonGrid } from '../components/Skeleton';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function MovieDetails() {
    const { id, mediaType = 'movie' } = useParams();
    const dispatch = useDispatch();
    const { details } = useSelector((state) => state.movies);
    const movie = details?.data;
    const credits = movie?.credits;
    const videos = movie?.videos;
    const similar = movie?.similar;
    const { items: favorites } = useSelector((state) => state.favorites);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [showTrailer, setShowTrailer] = useState(false);
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    const isFav = favorites.some(f => String(f.tmdbId) === String(id));

    useEffect(() => {
        dispatch(fetchMovieDetails({ id, mediaType }));
        if (isAuthenticated) {
            dispatch(fetchFavorites());
            dispatch(addToWatchHistory({ tmdbId: id, mediaType }));
        }
        window.scrollTo(0, 0);
    }, [dispatch, id, mediaType, isAuthenticated]);

    useEffect(() => {
        if (movie && contentRef.current) {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.fromTo(contentRef.current.querySelectorAll('.reveal-item'),
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
            );
        }
    }, [movie]);

    if (!movie) {
        return (
            <main className="flex-1 pt-24 px-6 lg:px-20 pb-20 min-h-screen">
                <div className="max-w-[1440px] mx-auto">
                    <div className="skeleton h-[80vh] rounded-xl mb-8"></div>
                    <SkeletonGrid count={4} />
                </div>
            </main>
        );
    }

    const title = movie.title || movie.name || 'Untitled';
    const backdrop = backdropUrl(movie.backdrop_path, 'original') || PLACEHOLDER_BACKDROP;
    const rating = movie.vote_average?.toFixed(1) || 'N/A';
    const runtime = movie.runtime || movie.episode_run_time?.[0];
    const hours = runtime ? Math.floor(runtime / 60) : 0;
    const minutes = runtime ? runtime % 60 : 0;
    const genres = movie.genres?.map(g => g.name) || [];
    const year = getYear(movie.release_date || movie.first_air_date);
    const director = credits?.crew?.find(c => c.job === 'Director');
    const cast = credits?.cast?.slice(0, 6) || [];
    const trailer = videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    const similarItems = similar?.results?.slice(0, 6) || [];

    const toggleFavorite = () => {
        if (isFav) dispatch(removeFavorite(movie.id));
        else dispatch(addFavorite({
            tmdbId: movie.id, mediaType, title,
            posterPath: movie.poster_path,
            releaseDate: movie.release_date || movie.first_air_date,
            rating: movie.vote_average,
        }));
    };

    return (
        <main className="flex-1 min-h-screen">
            {/* Hero Backdrop */}
            <section className="relative h-[85vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center scale-105"
                    style={{ backgroundImage: `url("${backdrop}")` }} />
                <div className="absolute inset-0 hero-gradient"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-transparent to-transparent"></div>

                {/* Hero Content */}
                <div ref={contentRef} className="relative h-full container mx-auto px-6 lg:px-20 flex flex-col justify-end pb-20 max-w-[1440px]">
                    <div className="max-w-4xl space-y-6">
                        <div className="reveal-item flex flex-wrap items-center gap-3 text-sm font-semibold tracking-wider uppercase text-primary">
                            <span>{year}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                            {runtime && <span>{hours}h {minutes}m</span>}
                            {runtime && <span className="w-1 h-1 rounded-full bg-slate-500"></span>}
                            <span className="px-2 py-0.5 rounded border border-primary/30 bg-primary/10">IMDb {rating}</span>
                        </div>

                        <h1 className="reveal-item text-6xl md:text-8xl font-black tracking-tight leading-none uppercase italic">
                            {title}
                        </h1>

                        <div className="reveal-item flex flex-wrap gap-2">
                            {genres.map(g => (
                                <span key={g} className="glass-morphism px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{g}</span>
                            ))}
                        </div>

                        <p className="reveal-item max-w-2xl text-lg text-slate-300 font-light leading-relaxed line-clamp-3">
                            {movie.overview}
                        </p>

                        <div className="reveal-item flex flex-wrap gap-4">
                            <button
                                onClick={() => trailer && setShowTrailer(true)}
                                className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-primary-glow glow-primary-hover"
                            >
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                WATCH NOW
                            </button>
                            <button
                                onClick={() => trailer && setShowTrailer(true)}
                                className="flex items-center gap-3 glass-morphism hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all"
                            >
                                <span className="material-symbols-outlined">movie</span>
                                WATCH TRAILER
                            </button>
                            {isAuthenticated && (
                                <button
                                    onClick={toggleFavorite}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${isFav ? 'bg-primary/20 border border-primary/50 text-primary' : 'glass-morphism hover:bg-white/10 text-white'}`}
                                >
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{isFav ? 'favorite' : 'favorite_border'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Below Hero */}
            <section className="container mx-auto px-6 lg:px-20 -mt-10 relative z-10 pb-20 max-w-[1440px]">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    <div className="glass-panel p-6 rounded-xl group hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Rating</span>
                            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        </div>
                        <p className="text-3xl font-black">{rating}<span className="text-lg text-slate-500 font-medium">/10</span></p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl group hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Duration</span>
                            <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                        </div>
                        <p className="text-3xl font-black">{runtime || '—'}<span className="text-lg text-slate-500 font-medium"> min</span></p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl group hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Year</span>
                            <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
                        </div>
                        <p className="text-3xl font-black">{year || '—'}</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl group hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Language</span>
                            <span className="material-symbols-outlined text-primary text-xl">language</span>
                        </div>
                        <p className="text-3xl font-black">{(movie.original_language || 'EN').toUpperCase()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Synopsis */}
                        <div>
                            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-6">The Synopsis</h3>
                            <p className="text-xl text-slate-300 leading-relaxed font-light first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                                {movie.overview || 'No synopsis available.'}
                            </p>
                        </div>

                        {/* Cast */}
                        {cast.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-8">Lead Ensemble</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {cast.map(actor => (
                                        <div key={actor.id} className="space-y-3 text-center group">
                                            <div className="aspect-square rounded-full border-2 border-border-dark group-hover:border-primary/60 transition-all overflow-hidden p-0.5">
                                                <img
                                                    src={actor.profile_path ? posterUrl(actor.profile_path, 'w185') : PLACEHOLDER_POSTER}
                                                    alt={actor.name}
                                                    className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                                                    onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{actor.name}</p>
                                                <p className="text-xs text-slate-500 italic">{actor.character}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Similar */}
                        {similarItems.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-8">Similar Discoveries</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {similarItems.map((item, idx) => (
                                        <MovieCard key={item.id} item={{ ...item, media_type: mediaType }} index={idx} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-8">
                        {/* Production Info */}
                        <div className="bg-surface border border-border-dark p-8 rounded-xl space-y-6">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Production Info</h3>
                            <div className="space-y-4">
                                {director && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Director</p>
                                        <p className="text-lg font-medium">{director.name}</p>
                                    </div>
                                )}
                                {movie.production_companies?.[0] && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Studio</p>
                                        <p className="text-lg font-medium">{movie.production_companies[0].name}</p>
                                    </div>
                                )}
                                {movie.budget > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Budget</p>
                                        <p className="text-lg font-medium">${(movie.budget / 1000000).toFixed(0)} Million</p>
                                    </div>
                                )}
                                {movie.revenue > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Box Office</p>
                                        <p className="text-lg font-medium">${(movie.revenue / 1000000).toFixed(1)} Million</p>
                                    </div>
                                )}
                                {movie.status && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</p>
                                        <p className="text-lg font-medium">{movie.status}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Trailer Thumbnail */}
                        {trailer && (
                            <div
                                onClick={() => setShowTrailer(true)}
                                className="relative group cursor-pointer overflow-hidden rounded-xl border border-border-dark"
                            >
                                <img
                                    src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                                    alt="Trailer"
                                    className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-bg-dark/40 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl shadow-primary/20 transition-transform group-hover:scale-110">
                                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <p className="text-xs font-bold uppercase tracking-widest">Official Trailer</p>
                                </div>
                            </div>
                        )}

                        {/* Rate this Film panel */}
                        <div className="glass-morphism p-6 rounded-xl">
                            <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">Rate this film</h3>
                            <div className="flex justify-around">
                                <button className="group flex flex-col items-center gap-2 transition-transform hover:scale-110">
                                    <span className="material-symbols-outlined text-3xl group-hover:text-primary transition-colors">favorite</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Love</span>
                                </button>
                                <button className="group flex flex-col items-center gap-2 transition-transform hover:scale-110">
                                    <span className="material-symbols-outlined text-3xl group-hover:text-primary transition-colors">thumb_up</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Like</span>
                                </button>
                                <button className="group flex flex-col items-center gap-2 transition-transform hover:scale-110 text-slate-500">
                                    <span className="material-symbols-outlined text-3xl">sentiment_dissatisfied</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Meh</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <TrailerModal videoKey={showTrailer ? trailer?.key : undefined} onClose={() => setShowTrailer(false)} />
        </main>
    );
}

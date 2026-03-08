import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, removeFavorite } from '../features/favoriteSlice';
import { posterUrl } from '../api/tmdb';
import { PLACEHOLDER_POSTER, getYear } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Favorites() {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.favorites);
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) dispatch(fetchFavorites());
    }, [dispatch, isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <main className="flex-1 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-primary/30">lock</span>
                    <h2 className="text-2xl font-bold mt-4">Sign in to view favorites</h2>
                    <Link to="/login" className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-lg font-bold">Sign In</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 pt-20 px-4 md:px-20 pb-20 min-h-screen">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    My Favorites
                </h1>
                {loading && <div className="skeleton h-40 w-full rounded-xl"></div>}
                {!loading && items.length === 0 && (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-6xl text-primary/30">heart_broken</span>
                        <p className="text-xl text-slate-400 mt-4">No favorites yet</p>
                        <p className="text-slate-500">Start adding movies you love!</p>
                    </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {items.map((fav, idx) => (
                        <motion.div key={fav._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="group relative">
                            <Link to={`/${fav.mediaType || 'movie'}/${fav.tmdbId}`} className="block">
                                <div className="aspect-[2/3] rounded-xl overflow-hidden bg-primary/10">
                                    <img
                                        src={fav.posterPath ? posterUrl(fav.posterPath) : PLACEHOLDER_POSTER}
                                        alt={fav.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }}
                                    />
                                </div>
                                <h3 className="mt-2 font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{fav.title}</h3>
                                <p className="text-xs text-slate-400">{getYear(fav.releaseDate)} • {fav.rating?.toFixed(1)} ★</p>
                            </Link>
                            <button
                                onClick={(e) => { e.preventDefault(); dispatch(removeFavorite(fav.tmdbId)); }}
                                className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur rounded-full text-red-400 hover:text-white hover:bg-primary transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}

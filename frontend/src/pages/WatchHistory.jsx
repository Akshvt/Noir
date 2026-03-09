import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWatchHistory } from '../features/watchHistorySlice';
import { posterUrl } from '../api/tmdb';
import { PLACEHOLDER_POSTER } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function WatchHistory() {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.watchHistory);
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) dispatch(fetchWatchHistory());
    }, [dispatch, isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <main className="flex-1 min-h-screen flex items-center justify-center">
                <div className="text-center glass-morphism rounded-2xl p-12">
                    <span className="material-symbols-outlined text-6xl text-primary/20">lock</span>
                    <h2 className="text-2xl font-bold mt-4">Sign in to view history</h2>
                    <Link to="/login" className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-primary-glow">Sign In</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 pt-24 px-6 lg:px-20 pb-20 min-h-screen">
            <div className="mx-auto max-w-[1440px]">
                <h1 className="text-3xl font-black mb-8 flex items-center gap-3 italic">
                    <span className="material-symbols-outlined text-primary/60 text-4xl">history</span>
                    Watch History
                </h1>
                {loading && <div className="skeleton h-40 w-full rounded-xl"></div>}
                {!loading && items.length === 0 && (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-6xl text-primary/15">history_toggle_off</span>
                        <p className="text-xl text-slate-500 mt-4">No watch history yet</p>
                    </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {items.map((h, idx) => (
                        <motion.div key={h._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
                            <Link to={`/${h.mediaType || 'movie'}/${h.tmdbId}`} className="group block">
                                <div className="aspect-[2/3] rounded-xl overflow-hidden border border-glass-border shadow-2xl">
                                    <img src={h.posterPath ? posterUrl(h.posterPath) : PLACEHOLDER_POSTER} alt={h.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }} />
                                </div>
                                <h3 className="mt-2 font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{h.title}</h3>
                                <p className="text-xs text-slate-500">
                                    Watched {new Date(h.watchedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}

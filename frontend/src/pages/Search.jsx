import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearch, clearSearch } from '../features/movieSlice';
import { useDebounce } from '../hooks/useDebounce';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/Skeleton';
import { posterUrl } from '../api/tmdb';
import { PLACEHOLDER_POSTER } from '../utils/helpers';
import { motion } from 'framer-motion';

export default function Search() {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const debouncedQuery = useDebounce(query, 300);
    const dispatch = useDispatch();
    const { search } = useSelector((state) => state.movies);

    useEffect(() => {
        if (debouncedQuery.trim()) {
            dispatch(fetchSearch({ query: debouncedQuery, page: 1 }));
        } else {
            dispatch(clearSearch());
        }
    }, [debouncedQuery, dispatch]);

    const movies = search.results?.filter(r => r.media_type === 'movie') || [];
    const tvShows = search.results?.filter(r => r.media_type === 'tv') || [];
    const people = search.results?.filter(r => r.media_type === 'person') || [];

    return (
        <main className="flex-1 pt-24 px-6 lg:px-20 pb-20 min-h-screen">
            <div className="mx-auto max-w-[1440px]">
                <h1 className="text-3xl font-black mb-6 italic">Search</h1>
                <div className="relative mb-10">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-xl bg-white/5 border border-glass-border py-4 pl-12 pr-6 text-lg placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary/30 transition-all"
                        placeholder="Search movies, TV shows, actors..."
                        type="text"
                        autoFocus
                    />
                </div>

                {search.loading && <SkeletonGrid count={10} />}

                {!search.loading && debouncedQuery && search.results.length === 0 && (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-6xl text-primary/15">search_off</span>
                        <p className="text-xl text-slate-500 mt-4">No results for "{debouncedQuery}"</p>
                    </div>
                )}

                {movies.length > 0 && (
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                        <h2 className="border-accent-left text-lg font-bold uppercase tracking-tight mb-6">Movies ({movies.length})</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {movies.map((m, idx) => <MovieCard key={m.id} item={{ ...m, media_type: 'movie' }} index={idx} />)}
                        </div>
                    </motion.section>
                )}

                {tvShows.length > 0 && (
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
                        <h2 className="border-accent-left text-lg font-bold uppercase tracking-tight mb-6">TV Shows ({tvShows.length})</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {tvShows.map((m, idx) => <MovieCard key={m.id} item={{ ...m, media_type: 'tv' }} index={idx} />)}
                        </div>
                    </motion.section>
                )}

                {people.length > 0 && (
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
                        <h2 className="border-accent-left text-lg font-bold uppercase tracking-tight mb-6">People ({people.length})</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {people.map((p) => (
                                <div key={p.id} className="flex flex-col items-center text-center gap-3 group">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border-dark group-hover:border-primary/60 transition-all p-0.5">
                                        <img
                                            src={p.profile_path ? posterUrl(p.profile_path, 'w185') : PLACEHOLDER_POSTER}
                                            alt={p.name}
                                            className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                                            onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }}
                                        />
                                    </div>
                                    <p className="font-bold text-sm">{p.name}</p>
                                    <p className="text-xs text-slate-500">{p.known_for_department}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </main>
    );
}

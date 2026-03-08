import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearch, clearSearch } from '../features/movieSlice';
import { useDebounce } from '../hooks/useDebounce';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/Skeleton';
import { posterUrl } from '../api/tmdb';
import { PLACEHOLDER_POSTER } from '../utils/helpers';
import { Link } from 'react-router-dom';

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
        <main className="flex-1 pt-20 px-4 md:px-20 pb-20 min-h-screen">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-3xl font-black mb-6">Search</h1>
                <div className="relative mb-8">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-xl bg-primary/10 border-none py-4 pl-12 pr-6 text-lg text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50"
                        placeholder="Search movies, TV shows, actors..."
                        type="text"
                        autoFocus
                    />
                </div>

                {search.loading && <SkeletonGrid count={10} />}

                {!search.loading && debouncedQuery && search.results.length === 0 && (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-6xl text-primary/30">search_off</span>
                        <p className="text-xl text-slate-400 mt-4">No results found for "{debouncedQuery}"</p>
                    </div>
                )}

                {/* Movies */}
                {movies.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">movie</span>
                            Movies ({movies.length})
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {movies.map((m, idx) => (
                                <MovieCard key={m.id} item={{ ...m, media_type: 'movie' }} index={idx} />
                            ))}
                        </div>
                    </section>
                )}

                {/* TV Shows */}
                {tvShows.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">tv</span>
                            TV Shows ({tvShows.length})
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {tvShows.map((m, idx) => (
                                <MovieCard key={m.id} item={{ ...m, media_type: 'tv' }} index={idx} />
                            ))}
                        </div>
                    </section>
                )}

                {/* People */}
                {people.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">person</span>
                            People ({people.length})
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {people.map((p) => (
                                <div key={p.id} className="flex flex-col items-center text-center gap-3">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20">
                                        <img
                                            src={p.profile_path ? posterUrl(p.profile_path, 'w185') : PLACEHOLDER_POSTER}
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }}
                                        />
                                    </div>
                                    <p className="font-bold text-sm">{p.name}</p>
                                    <p className="text-xs text-slate-400">{p.known_for_department}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}

import { useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopular, fetchTopRated, fetchTrending, fetchGenres } from '../features/movieSlice';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/Skeleton';

export default function Explore() {
    const [searchParams] = useSearchParams();
    const sortType = searchParams.get('sort') || 'popular';
    const dispatch = useDispatch();
    const { popular, topRated, trending } = useSelector((state) => state.movies);

    const currentList = sortType === 'top_rated' ? topRated : sortType === 'trending' ? trending : popular;

    useEffect(() => {
        dispatch(fetchGenres());
        if (sortType === 'top_rated') dispatch(fetchTopRated(1));
        else if (sortType === 'trending') dispatch(fetchTrending(1));
        else dispatch(fetchPopular(1));
    }, [dispatch, sortType]);

    const loadMore = useCallback(() => {
        if (currentList.loading) return;
        const nextPage = currentList.page + 1;
        if (nextPage > currentList.totalPages) return;
        if (sortType === 'top_rated') dispatch(fetchTopRated(nextPage));
        else if (sortType === 'trending') dispatch(fetchTrending(nextPage));
        else dispatch(fetchPopular(nextPage));
    }, [dispatch, sortType, currentList]);

    const hasMore = currentList.page < currentList.totalPages;
    const lastRef = useInfiniteScroll(loadMore, hasMore);

    const titleMap = { popular: 'Popular Movies', top_rated: 'Top Rated', trending: 'Trending Now' };

    return (
        <main className="flex-1 pt-24 px-6 lg:px-20 pb-20 min-h-screen">
            <div className="mx-auto max-w-[1440px]">
                <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                    <h1 className="text-3xl font-black italic">{titleMap[sortType]}</h1>
                    <div className="flex gap-2">
                        {['popular', 'top_rated', 'trending'].map(s => (
                            <Link
                                key={s}
                                to={`/explore?sort=${s}`}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortType === s
                                    ? 'bg-primary text-white font-bold shadow-primary-glow'
                                    : 'bg-white/5 border border-glass-border text-slate-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {s === 'top_rated' ? 'Top Rated' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {currentList.results.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} ref={idx === currentList.results.length - 1 ? lastRef : null}>
                            <MovieCard item={{ ...item, media_type: item.media_type || 'movie' }} index={idx} />
                        </div>
                    ))}
                </div>

                {currentList.loading && <div className="mt-8"><SkeletonGrid count={5} /></div>}

                {!hasMore && currentList.results.length > 0 && (
                    <p className="text-center text-slate-600 mt-12 uppercase tracking-widest text-xs">You've reached the end</p>
                )}
            </div>
        </main>
    );
}

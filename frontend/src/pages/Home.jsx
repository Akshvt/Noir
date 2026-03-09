import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrending, fetchPopular, fetchTopRated, fetchTVPopular } from '../features/movieSlice';
import HeroSpotlight from '../components/HeroSpotlight';
import MovieRow from '../components/MovieRow';

export default function Home() {
    const dispatch = useDispatch();
    const { trending, popular, topRated, tvPopular } = useSelector((state) => state.movies);

    useEffect(() => {
        dispatch(fetchTrending());
        dispatch(fetchPopular());
        dispatch(fetchTopRated());
        dispatch(fetchTVPopular());
    }, [dispatch]);

    const heroMovies = trending.results?.slice(0, 5) || [];

    return (
        <main className="flex-1">
            <HeroSpotlight movies={heroMovies} />
            <div className="relative -mt-20 z-10 space-y-12 pb-20">
                <MovieRow title="Trending Now" items={trending.results?.slice(5)} viewAllLink="/explore?sort=trending" />
                <MovieRow title="Popular Movies" items={popular.results} viewAllLink="/explore?sort=popular" />
                <MovieRow title="Top Rated" items={topRated.results} viewAllLink="/explore?sort=top_rated" />
                <MovieRow title="Popular TV Shows" items={tvPopular.results} type="tv" viewAllLink="/explore?type=tv" />
            </div>
        </main>
    );
}

import { Link } from 'react-router-dom';
import { backdropUrl } from '../api/tmdb';
import { PLACEHOLDER_BACKDROP, getYear } from '../utils/helpers';
import { motion } from 'framer-motion';

export default function HeroSpotlight({ movie }) {
    if (!movie) {
        return (
            <section className="relative h-[85vh] w-full overflow-hidden">
                <div className="absolute inset-0 skeleton"></div>
            </section>
        );
    }

    const title = movie.title || movie.name || 'Untitled';
    const backdrop = backdropUrl(movie.backdrop_path) || PLACEHOLDER_BACKDROP;
    const mediaType = movie.media_type || 'movie';

    return (
        <section className="relative h-[85vh] w-full overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(34, 16, 18, 1) 0%, rgba(34, 16, 18, 0.4) 50%, rgba(34, 16, 18, 0.8) 100%), url("${backdrop}")`,
                }}
            />
            <div className="relative flex h-full flex-col justify-end px-4 md:px-20 pb-20 max-w-[1440px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl space-y-6"
                >
                    <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        Trending Now
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight text-white uppercase italic">
                        {title.split(' ').length > 2 ? (
                            <>
                                {title.split(' ').slice(0, 2).join(' ')}
                                <br />
                                <span className="text-primary">{title.split(' ').slice(2).join(' ')}</span>
                            </>
                        ) : title.split(' ').length === 2 ? (
                            <>
                                {title.split(' ')[0]}
                                <br />
                                <span className="text-primary">{title.split(' ')[1]}</span>
                            </>
                        ) : (
                            <span className="text-primary">{title}</span>
                        )}
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed line-clamp-3 md:line-clamp-none">
                        {movie.overview || 'No description available.'}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link
                            to={`/${mediaType}/${movie.id}`}
                            className="flex h-14 items-center gap-3 rounded-lg bg-primary px-8 text-lg font-bold text-white hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                            Play Now
                        </Link>
                        <Link
                            to={`/${mediaType}/${movie.id}`}
                            className="flex h-14 items-center gap-3 rounded-lg bg-primary/20 backdrop-blur-md px-8 text-lg font-bold text-white hover:bg-primary/30 transition-all border border-white/10"
                        >
                            <span className="material-symbols-outlined">info</span>
                            More Info
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

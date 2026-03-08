import { Link } from 'react-router-dom';
import { posterUrl } from '../api/tmdb';
import { PLACEHOLDER_POSTER, getYear } from '../utils/helpers';
import { motion } from 'framer-motion';

export default function MovieCard({ item, index }) {
    const mediaType = item.media_type || 'movie';
    const title = item.title || item.name || 'Untitled';
    const date = item.release_date || item.first_air_date;
    const poster = posterUrl(item.poster_path) || PLACEHOLDER_POSTER;
    const rating = item.vote_average?.toFixed(1) || 'N/A';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index ? index * 0.05 : 0, duration: 0.3 }}
        >
            <Link to={`/${mediaType}/${item.id}`} className="movie-card group relative flex-none w-48 md:w-64 cursor-pointer block">
                <div
                    className="aspect-[2/3] w-full rounded-xl bg-cover bg-center overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:ring-2 ring-primary"
                    style={{ backgroundImage: `url("${poster}")` }}
                >
                    {!item.poster_path && (
                        <div className="absolute inset-0 placeholder-poster rounded-xl">
                            <span className="material-symbols-outlined text-primary/40 text-5xl">movie</span>
                        </div>
                    )}
                    <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-lg font-bold text-white line-clamp-2">{title}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <span className="flex items-center text-primary font-bold">
                                <span className="material-symbols-outlined text-xs mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                {rating}
                            </span>
                            <span>•</span>
                            <span>{getYear(date)}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

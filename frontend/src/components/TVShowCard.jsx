import { Link } from 'react-router-dom';
import { backdropUrl } from '../api/tmdb';
import { PLACEHOLDER_BACKDROP } from '../utils/helpers';

export default function TVShowCard({ item }) {
    const title = item.name || item.title || 'Untitled';
    const backdrop = backdropUrl(item.backdrop_path, 'w780') || PLACEHOLDER_BACKDROP;
    const rating = item.vote_average?.toFixed(1) || 'N/A';

    return (
        <Link to={`/tv/${item.id}`} className="movie-card group relative flex-none w-72 md:w-96 cursor-pointer block">
            <div
                className="aspect-video w-full rounded-xl bg-cover bg-center overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:ring-2 ring-primary"
                style={{ backgroundImage: `url("${backdrop}")` }}
            >
                <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">Popular</span>
                    <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
                    <p className="text-xs text-slate-300">{rating} ★ | {item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'N/A'}</p>
                </div>
            </div>
        </Link>
    );
}

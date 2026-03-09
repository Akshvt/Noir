import { Link } from 'react-router-dom';
import { backdropUrl } from '../api/tmdb';
import { PLACEHOLDER_BACKDROP } from '../utils/helpers';
import { useRef, useState, useCallback } from 'react';

export default function TVShowCard({ item }) {
    const title = item.name || item.title || 'Untitled';
    const backdrop = backdropUrl(item.backdrop_path, 'w780') || PLACEHOLDER_BACKDROP;
    const rating = item.vote_average?.toFixed(1) || 'N/A';
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('');

    const handleMouseMove = useCallback((e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
        setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTransform('');
    }, []);

    return (
        <Link to={`/tv/${item.id}`} className="movie-card group relative flex-none w-72 md:w-96 cursor-pointer block">
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative aspect-video w-full rounded-2xl bg-cover bg-center overflow-hidden transition-all duration-500 ease-out will-change-transform border border-glass-border shadow-2xl"
                style={{
                    backgroundImage: `url("${backdrop}")`,
                    transform: transform || undefined,
                }}
            >
                <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <button className="w-full bg-white text-black py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                        Watch
                    </button>
                </div>
            </div>
            <h4 className="mt-3 text-white font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">{title}</h4>
            <p className="text-slate-500 text-xs">Series • {item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'N/A'}</p>
        </Link>
    );
}

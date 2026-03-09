import { Link } from 'react-router-dom';
import { posterUrl } from '../api/tmdb';
import { PLACEHOLDER_POSTER, getYear } from '../utils/helpers';
import { motion } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';

export default function MovieCard({ item, index, className }) {
    const mediaType = item.media_type || 'movie';
    const title = item.title || item.name || 'Untitled';
    const date = item.release_date || item.first_air_date;
    const poster = posterUrl(item.poster_path) || PLACEHOLDER_POSTER;
    const rating = item.vote_average?.toFixed(1) || 'N/A';
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('');

    const handleMouseMove = useCallback((e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index ? Math.min(index * 0.06, 0.5) : 0, duration: 0.4, ease: 'easeOut' }}
        >
            <Link to={`/${mediaType}/${item.id}`} className={`movie-card group relative cursor-pointer block ${className || 'flex-none w-52 md:w-72'}`}>
                <div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative aspect-[2/3] w-full rounded-2xl bg-cover bg-center overflow-hidden transition-all duration-500 ease-out will-change-transform border border-glass-border shadow-2xl"
                    style={{
                        backgroundImage: `url("${poster}")`,
                        transform: transform || 'perspective(800px) rotateX(0deg) rotateY(0deg)',
                    }}
                >
                    {!item.poster_path && (
                        <div className="absolute inset-0 placeholder-poster rounded-2xl">
                            <span className="material-symbols-outlined text-white/20 text-5xl">movie</span>
                        </div>
                    )}
                    {/* Hover overlay with Watch button */}
                    <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 flex flex-col justify-end p-6">
                        <button className="w-full bg-white text-black py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                            Watch
                        </button>
                    </div>
                    {/* Badge */}
                    <div className="absolute top-3 right-3 bg-primary text-[10px] font-bold px-2 py-1 rounded text-white">
                        {rating} ★
                    </div>
                </div>
                <h4 className="mt-3 text-white font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">{title}</h4>
                <p className="text-slate-500 text-sm">{getYear(date)}</p>
            </Link>
        </motion.div>
    );
}

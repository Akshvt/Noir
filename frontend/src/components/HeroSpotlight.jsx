import { Link } from 'react-router-dom';
import { backdropUrl } from '../api/tmdb';
import { PLACEHOLDER_BACKDROP } from '../utils/helpers';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

export default function HeroSpotlight({ movies = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const contentRef = useRef(null);
    const buttonsRef = useRef(null);
    const particlesRef = useRef(null);

    const movie = movies[currentIndex];

    useEffect(() => {
        if (!movies.length) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % movies.length);
        }, 8000); // 8 seconds auto-rotation

        return () => clearInterval(timer);
    }, [movies.length, currentIndex]);

    useEffect(() => {
        if (!movie || !contentRef.current) return;

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(contentRef.current.querySelector('.hero-badge'),
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.5 }
        )
            .fromTo(contentRef.current.querySelector('.hero-title'),
                { opacity: 0, y: 60, skewY: 2 },
                { opacity: 1, y: 0, skewY: 0, duration: 1 },
                '-=0.3'
            )
            .fromTo(contentRef.current.querySelector('.hero-desc'),
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7 },
                '-=0.5'
            )
            .fromTo(buttonsRef.current?.children || [],
                { opacity: 0, y: 20, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.12 },
                '-=0.3'
            );

        // Floating particles
        if (particlesRef.current) {
            Array.from(particlesRef.current.children).forEach((p, i) => {
                gsap.to(p, {
                    y: `random(-30, 30)`,
                    x: `random(-15, 15)`,
                    opacity: `random(0.1, 0.4)`,
                    duration: `random(4, 8)`,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: i * 0.5,
                });
            });
        }
    }, [currentIndex, movie]);

    if (!movies.length || !movie) {
        return (
            <section className="px-6 lg:px-20 pt-24 pb-12">
                <div className="relative h-[600px] rounded-[2rem] overflow-hidden skeleton"></div>
            </section>
        );
    }

    const title = movie.title || movie.name || 'Untitled';
    const backdrop = backdropUrl(movie.backdrop_path) || PLACEHOLDER_BACKDROP;
    const mediaType = movie.media_type || 'movie';
    const rating = movie.vote_average?.toFixed(1) || 'N/A';

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % movies.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);

    return (
        <section className="px-6 lg:px-20 pt-24 pb-12">
            <div className="relative h-[600px] rounded-[2rem] overflow-hidden group shadow-2xl mx-auto max-w-[1440px]">

                {/* Background Crossfade */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url("${backdrop}")` }}
                    />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-bg-dark/60 to-transparent"></div>

                {/* Floating Particles */}
                <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full blur-sm"></div>
                    <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/30 rounded-full blur-xs"></div>
                    <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-primary/15 rounded-full blur-md"></div>
                    <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white/15 rounded-full blur-sm"></div>
                </div>

                {/* Left/Right Arrow Controls */}
                <div className="absolute inset-y-0 left-0 w-24 z-30 flex items-center justify-start px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={prevSlide} className="w-12 h-12 flex items-center justify-center rounded-full glass-morphism hover:bg-white/20 text-white transition-all hover:scale-110">
                        <span className="material-symbols-outlined text-2xl">chevron_left</span>
                    </button>
                </div>
                <div className="absolute inset-y-0 right-0 w-24 z-30 flex items-center justify-end px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={nextSlide} className="w-12 h-12 flex items-center justify-center rounded-full glass-morphism hover:bg-white/20 text-white transition-all hover:scale-110">
                        <span className="material-symbols-outlined text-2xl">chevron_right</span>
                    </button>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-10 md:p-16 md:pl-28 max-w-3xl z-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            ref={contentRef}
                        >
                            <div className="hero-badge flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                                    Featured
                                </span>
                                <span className="flex items-center gap-1 text-primary text-sm font-bold">
                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    {rating} Rating
                                </span>
                            </div>

                            <h2 className="hero-title text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tighter uppercase italic">
                                {title}
                            </h2>

                            <p className="hero-desc text-slate-300 text-lg mb-10 leading-relaxed font-light line-clamp-3">
                                {movie.overview || 'No description available.'}
                            </p>

                            <div ref={buttonsRef} className="flex items-center gap-4 flex-wrap">
                                <Link
                                    to={`/${mediaType}/${movie.id}`}
                                    className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-primary-glow glow-primary-hover hover:scale-105 active:scale-95 transition-all"
                                >
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                    Play Now
                                </Link>
                                <Link
                                    to={`/${mediaType}/${movie.id}`}
                                    className="flex items-center gap-3 glass-morphism hover:bg-white/15 text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                    Watchlist
                                </Link>
                                <Link
                                    to={`/${mediaType}/${movie.id}`}
                                    className="w-14 h-14 flex items-center justify-center glass-morphism border border-white/20 rounded-xl hover:bg-white/15 hover:scale-110 active:scale-95 transition-all"
                                >
                                    <span className="material-symbols-outlined text-white">info</span>
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom right indicators */}
                <div className="absolute bottom-10 right-10 z-20 hidden lg:flex flex-col gap-4 items-end">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Now Streaming</p>
                    <div className="flex gap-2">
                        {movies.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-12 bg-primary' : 'w-8 bg-white/20 hover:bg-white/40'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import TVShowCard from './TVShowCard';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MovieRow({ title, items, type = 'movie', viewAllLink }) {
    const scrollRef = useRef(null);
    const sectionRef = useRef(null);
    const titleRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (!sectionRef.current || !titleRef.current) return;

        gsap.fromTo(titleRef.current,
            { opacity: 0, x: -30 },
            {
                opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            }
        );

        if (scrollRef.current) {
            const cards = scrollRef.current.children;
            gsap.fromTo(cards,
                { opacity: 0, x: 60 },
                {
                    opacity: 1, x: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    }
                }
            );
        }
    }, [items]);

    return (
        <section ref={sectionRef}>
            <div className="px-6 lg:px-20 mb-6 flex justify-between items-end">
                <div ref={titleRef}>
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                    <p className="text-slate-500 text-sm">Curated based on global viewership</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2">
                        <button onClick={() => scroll('left')} className="h-9 w-9 flex items-center justify-center rounded-lg bg-surface border border-border-dark hover:border-primary/50 text-slate-400 hover:text-white transition-all">
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <button onClick={() => scroll('right')} className="h-9 w-9 flex items-center justify-center rounded-lg bg-surface border border-border-dark hover:border-primary/50 text-slate-400 hover:text-white transition-all">
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                    {viewAllLink && (
                        <Link to={viewAllLink} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                            View All <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </Link>
                    )}
                </div>
            </div>
            <div ref={scrollRef} className="no-scrollbar flex gap-6 overflow-x-auto px-6 lg:px-20 pb-4">
                {items?.map((item, idx) =>
                    type === 'tv' ? (
                        <TVShowCard key={item.id} item={item} />
                    ) : (
                        <MovieCard key={item.id} item={item} index={idx} />
                    )
                )}
                {(!items || items.length === 0) && (
                    <div className="flex gap-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`flex-none ${type === 'tv' ? 'w-72 md:w-96' : 'w-52 md:w-72'}`}>
                                <div className={`skeleton ${type === 'tv' ? 'aspect-video' : 'aspect-[2/3]'} w-full rounded-2xl`}></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

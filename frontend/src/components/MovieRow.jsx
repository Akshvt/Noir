import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import TVShowCard from './TVShowCard';
import { useRef } from 'react';

export default function MovieRow({ title, items, type = 'movie', viewAllLink }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="pl-4 md:pl-20">
            <div className="flex items-center justify-between pr-4 md:pr-20 mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
                <div className="flex items-center gap-3">
                    <button onClick={() => scroll('left')} className="hidden md:flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-slate-400 hover:text-primary hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button onClick={() => scroll('right')} className="hidden md:flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-slate-400 hover:text-primary hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                    {viewAllLink && (
                        <Link to={viewAllLink} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                            View All <span className="material-symbols-outlined text-xs">arrow_forward_ios</span>
                        </Link>
                    )}
                </div>
            </div>
            <div ref={scrollRef} className="no-scrollbar flex gap-5 overflow-x-auto pb-4 pr-10">
                {items?.map((item, idx) =>
                    type === 'tv' ? (
                        <TVShowCard key={item.id} item={item} />
                    ) : (
                        <MovieCard key={item.id} item={item} index={idx} />
                    )
                )}
                {(!items || items.length === 0) && (
                    <div className="flex gap-5">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={`flex-none ${type === 'tv' ? 'w-72 md:w-96' : 'w-48 md:w-64'}`}>
                                <div className={`skeleton ${type === 'tv' ? 'aspect-video' : 'aspect-[2/3]'} w-full rounded-xl`}></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

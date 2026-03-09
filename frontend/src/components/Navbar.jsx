import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import gsap from 'gsap';

export default function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const navRef = useRef(null);

    useEffect(() => {
        if (navRef.current) {
            gsap.fromTo(navRef.current,
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
            );
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setSearchOpen(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <header ref={navRef} className="fixed top-0 z-50 w-full bg-gradient-to-b from-black/90 via-black/50 to-transparent px-6 lg:px-20 pt-6 pb-16 transition-all">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="text-primary">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic">Noir</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase">
                        <Link to="/" className="hover:text-primary transition-colors">Movies</Link>
                        <Link to="/explore" className="hover:text-primary transition-colors">Series</Link>
                        <Link to="/explore?sort=top_rated" className="hover:text-primary transition-colors">Top Rated</Link>
                        {isAuthenticated && <Link to="/favorites" className="text-primary">Premium</Link>}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="hidden sm:block relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-glass-border rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-500"
                            placeholder="Search titles, actors, genres..."
                            type="text"
                        />
                    </form>

                    <button onClick={() => setSearchOpen(!searchOpen)} className="sm:hidden flex items-center justify-center p-2 rounded-lg bg-surface border border-border-dark hover:border-primary/50 transition-all">
                        <span className="material-symbols-outlined text-[20px]">search</span>
                    </button>

                    {isAuthenticated ? (
                        <>
                            <Link to="/favorites" className="flex items-center justify-center p-2 rounded-lg bg-surface border border-border-dark hover:border-primary/50 transition-all">
                                <span className="material-symbols-outlined text-[20px]">bookmark</span>
                            </Link>
                            <div className="relative group">
                                <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/40 overflow-hidden cursor-pointer flex items-center justify-center text-sm font-bold text-white relative z-50">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="absolute right-0 top-10 w-52 glass-morphism rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40 bg-black/90 border border-glass-border shadow-2xl py-2">
                                    <div className="px-4 py-3 border-b border-white/10 mb-2">
                                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                                    </div>
                                    <div className="flex flex-col gap-1 px-2">
                                        <Link to="/favorites" className="px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-lg">bookmark</span> Favorites</Link>
                                        <Link to="/history" className="px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-lg">history</span> Watch History</Link>
                                        {user?.role === 'admin' && (
                                            <Link to="/admin" className="px-3 py-2 text-sm text-primary font-bold hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-2 mt-1 border border-primary/20"><span className="material-symbols-outlined text-lg">admin_panel_settings</span> Dashboard</Link>
                                        )}
                                        <button onClick={handleLogout} className="mt-2 w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-lg">logout</span> Logout</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm font-medium hover:text-primary transition-all hover:scale-105 active:scale-95">Login</Link>
                            <Link to="/signup" className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-primary-glow transition-all hover:scale-105 active:scale-95">Sign Up</Link>
                        </div>
                    )}

                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden flex items-center justify-center p-2 rounded-lg bg-surface border border-border-dark">
                        <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile search */}
            {searchOpen && (
                <form onSubmit={handleSearch} className="sm:hidden mt-3">
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-glass-border rounded-lg py-2 px-4 text-sm placeholder:text-slate-500 focus:ring-1 focus:ring-primary" placeholder="Search..." type="text" autoFocus />
                </form>
            )}

            {/* Mobile nav */}
            {mobileMenuOpen && (
                <nav className="md:hidden mt-3 pb-3 flex flex-col gap-1 border-t border-primary/10 pt-3">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">Movies</Link>
                    <Link to="/explore" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">Series</Link>
                    <Link to="/explore?sort=top_rated" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">Top Rated</Link>
                    {isAuthenticated && <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">Premium</Link>}
                </nav>
            )}
        </header>
    );
}

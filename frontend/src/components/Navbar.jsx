import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

export default function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        <header className="fixed top-0 z-50 w-full border-b border-primary/10 bg-[#221012]/80 backdrop-blur-md px-4 md:px-10 py-3">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 md:gap-8">
                <div className="flex items-center gap-4 md:gap-8">
                    <Link to="/" className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-3xl">movie_filter</span>
                        <h2 className="text-xl font-black leading-tight tracking-tighter">MOVIESTREAM</h2>
                    </Link>
                    <nav className="hidden lg:flex items-center gap-6">
                        <Link to="/" className="text-slate-100 hover:text-primary text-sm font-medium transition-colors">Home</Link>
                        <Link to="/explore" className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">Movies</Link>
                        <Link to="/explore?type=tv" className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">TV Shows</Link>
                        {isAuthenticated && (
                            <>
                                <Link to="/favorites" className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">My List</Link>
                                <Link to="/history" className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">History</Link>
                            </>
                        )}
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">Admin</Link>
                        )}
                    </nav>
                </div>

                <div className="flex flex-1 justify-end items-center gap-3 md:gap-6">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="relative hidden sm:block w-full max-w-xs">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg bg-primary/10 border-none py-2 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="Search titles, actors, genres..."
                            type="text"
                        />
                    </form>

                    {/* Mobile Search */}
                    <button onClick={() => setSearchOpen(!searchOpen)} className="sm:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-slate-100 hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined">search</span>
                    </button>

                    <div className="flex items-center gap-2">
                        {isAuthenticated ? (
                            <>
                                <Link to="/favorites" className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-slate-100 hover:bg-primary/20 transition-colors">
                                    <span className="material-symbols-outlined">favorite</span>
                                </Link>
                                <div className="relative group">
                                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/30 text-white font-bold text-sm">
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </button>
                                    <div className="absolute right-0 top-12 w-48 bg-[#221012] border border-primary/20 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                        <div className="p-3 border-b border-primary/10">
                                            <p className="text-sm font-bold text-white">{user?.name}</p>
                                            <p className="text-xs text-slate-400">{user?.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <Link to="/favorites" className="block px-3 py-2 text-sm text-slate-300 hover:text-primary hover:bg-primary/10 rounded transition-colors">Favorites</Link>
                                            <Link to="/history" className="block px-3 py-2 text-sm text-slate-300 hover:text-primary hover:bg-primary/10 rounded transition-colors">Watch History</Link>
                                            {user?.role === 'admin' && <Link to="/admin" className="block px-3 py-2 text-sm text-slate-300 hover:text-primary hover:bg-primary/10 rounded transition-colors">Admin Panel</Link>}
                                            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-primary/10 rounded transition-colors">Logout</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-100 hover:text-primary transition-colors">Login</Link>
                                <Link to="/signup" className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:brightness-110 transition-all">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu toggle */}
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-slate-100">
                        <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile search bar */}
            {searchOpen && (
                <form onSubmit={handleSearch} className="sm:hidden mt-3">
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg bg-primary/10 border-none py-2 px-4 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50"
                        placeholder="Search..."
                        type="text"
                        autoFocus
                    />
                </form>
            )}

            {/* Mobile nav */}
            {mobileMenuOpen && (
                <nav className="lg:hidden mt-3 pb-3 flex flex-col gap-2 border-t border-primary/10 pt-3">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-slate-100 hover:text-primary text-sm font-medium px-2 py-1">Home</Link>
                    <Link to="/explore" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-primary text-sm font-medium px-2 py-1">Movies</Link>
                    <Link to="/explore?type=tv" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-primary text-sm font-medium px-2 py-1">TV Shows</Link>
                    {isAuthenticated && <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-primary text-sm font-medium px-2 py-1">My List</Link>}
                    {isAuthenticated && <Link to="/history" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-primary text-sm font-medium px-2 py-1">History</Link>}
                    {user?.role === 'admin' && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-primary text-sm font-medium px-2 py-1">Admin</Link>}
                </nav>
            )}
        </header>
    );
}

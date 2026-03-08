import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const navItems = [
    { icon: 'dashboard', label: 'Dashboard', to: '/admin' },
    { icon: 'movie_filter', label: 'Manage Movies', to: '/admin/movies' },
    { icon: 'group', label: 'Manage Users', to: '/admin/users' },
];

export default function AdminLayout() {
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="flex h-screen overflow-hidden pt-0">
            {/* Sidebar */}
            <aside className="w-64 bg-[#221012] border-r border-primary/20 flex flex-col shrink-0">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">movie</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-none">MovieAdmin</h1>
                        <p className="text-xs text-primary/60">Platform Control</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.to
                                    ? 'bg-primary text-white'
                                    : 'text-slate-400 hover:bg-primary/10 hover:text-primary'
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-primary/20">
                    <div className="flex items-center gap-3 p-2">
                        <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold">
                            {user?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                            <p className="text-sm font-bold">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-slate-500">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#221012]/50">
                <header className="sticky top-0 z-10 bg-[#221012]/80 backdrop-blur-md border-b border-primary/20 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input className="w-full pl-10 pr-4 py-2 bg-primary/10 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" placeholder="Search movies, users, or analytics..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 rounded-lg bg-primary/10 text-slate-300 hover:text-primary transition-colors" title="Back to site">
                            <span className="material-symbols-outlined">home</span>
                        </Link>
                        <button className="p-2 rounded-lg bg-primary/10 text-slate-300 relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
                        </button>
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

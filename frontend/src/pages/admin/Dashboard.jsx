import { useEffect, useState } from 'react';
import backend from '../../api/backend';

export default function Dashboard() {
    const [stats, setStats] = useState({ movies: 0, users: 0, recent: 0 });
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            backend.get('/movies').catch(() => ({ data: { movies: [], total: 0 } })),
            backend.get('/users').catch(() => ({ data: { users: [] } })),
        ]).then(([movRes, usrRes]) => {
            setMovies(movRes.data.movies || []);
            setStats({
                movies: movRes.data.total || movRes.data.movies?.length || 0,
                users: usrRes.data.users?.length || 0,
                recent: movRes.data.movies?.length || 0,
            });
            setLoading(false);
        });
    }, []);

    return (
        <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon="movie" label="Total Movies" value={stats.movies} change="+12%" />
                <StatCard icon="person" label="Active Users" value={stats.users} change="+5.2%" />
                <StatCard icon="bolt" label="Recent Activity" value={`${stats.recent}`} subtitle="entries" change="+8%" />
            </div>

            {/* Movies Table */}
            <div className="bg-primary/5 rounded-xl border border-primary/10 mb-8 overflow-hidden">
                <div className="p-6 border-b border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Manage Movies</h2>
                        <p className="text-sm text-slate-400">Add, edit, or remove movies from the catalog.</p>
                    </div>
                    <a href="/admin/movies" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20 w-fit">
                        <span className="material-symbols-outlined">add_box</span>
                        Add New Movie
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-primary/10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Movie</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Genre</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Release Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/10">
                            {movies.slice(0, 5).map((movie) => (
                                <tr key={movie._id} className="hover:bg-primary/5">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-16 rounded-sm bg-primary/20 overflow-hidden shrink-0">
                                                {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{movie.title}</p>
                                                <p className="text-xs text-slate-500">{movie.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{movie.genre || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm">{movie.releaseDate || 'N/A'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                                            <button onClick={() => handleDelete(movie._id)} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {movies.length === 0 && !loading && (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">No movies yet. Add your first movie!</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    async function handleDelete(id) {
        if (!confirm('Delete this movie?')) return;
        await backend.delete(`/movies/${id}`);
        setMovies(movies.filter(m => m._id !== id));
        setStats(prev => ({ ...prev, movies: prev.movies - 1 }));
    }
}

function StatCard({ icon, label, value, subtitle, change }) {
    return (
        <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <span className="text-emerald-500 text-sm font-medium flex items-center">{change} <span className="material-symbols-outlined text-xs">arrow_upward</span></span>
            </div>
            <p className="text-slate-400 text-sm font-medium">{label}</p>
            <h3 className="text-3xl font-bold mt-1">{value} {subtitle && <span className="text-sm font-normal text-slate-400">{subtitle}</span>}</h3>
        </div>
    );
}

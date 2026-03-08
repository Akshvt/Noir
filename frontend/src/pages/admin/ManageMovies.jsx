import { useEffect, useState } from 'react';
import backend from '../../api/backend';

export default function ManageMovies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        title: '', posterUrl: '', description: '', tmdbId: '', releaseDate: '', trailerUrl: '', genre: '', category: 'Movie',
    });

    const fetchMovies = async () => {
        try {
            const res = await backend.get('/movies');
            setMovies(res.data.movies || []);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchMovies(); }, []);

    const resetForm = () => {
        setForm({ title: '', posterUrl: '', description: '', tmdbId: '', releaseDate: '', trailerUrl: '', genre: '', category: 'Movie' });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await backend.put(`/movies/${editingId}`, form);
            } else {
                await backend.post('/movies', form);
            }
            resetForm();
            fetchMovies();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const handleEdit = (movie) => {
        setEditingId(movie._id);
        setForm({
            title: movie.title, posterUrl: movie.posterUrl, description: movie.description,
            tmdbId: movie.tmdbId, releaseDate: movie.releaseDate, trailerUrl: movie.trailerUrl,
            genre: movie.genre, category: movie.category,
        });
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this movie?')) return;
        await backend.delete(`/movies/${id}`);
        fetchMovies();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-primary/5 rounded-xl border border-primary/10 p-6">
                <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Movie' : 'Add New Movie'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 bg-primary/10 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" placeholder="e.g. Inception" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Poster URL</label>
                            <input value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} className="w-full px-4 py-2.5 bg-primary/10 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" placeholder="https://..." />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 bg-primary/10 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" placeholder="Enter movie synopsis..." rows="3" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Release Date</label>
                            <input type="date" value={form.releaseDate} onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} className="w-full px-4 py-2.5 bg-primary/10 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Trailer Link</label>
                            <input value={form.trailerUrl} onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })} className="w-full px-4 py-2.5 bg-primary/10 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" placeholder="YouTube URL" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Genre</label>
                            <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="w-full px-4 py-2.5 bg-primary/10 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm">
                                <option value="">Select genre</option>
                                <option>Action</option><option>Drama</option><option>Sci-Fi</option><option>Horror</option><option>Comedy</option><option>Thriller</option><option>Romance</option><option>Adventure</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 bg-primary/10 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm">
                                <option>Movie</option><option>TV Series</option><option>Documentary</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">TMDB ID (Optional)</label>
                            <input value={form.tmdbId} onChange={(e) => setForm({ ...form, tmdbId: e.target.value })} className="w-full px-4 py-2.5 bg-primary/10 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" placeholder="e.g. 550" />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all">
                            {editingId ? 'Update Movie' : 'Save Movie'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={resetForm} className="px-6 bg-primary/10 text-slate-300 font-bold py-3 rounded-lg hover:bg-primary/20 transition-all">Cancel</button>
                        )}
                    </div>
                </form>
            </div>

            {/* Movies List */}
            <div className="bg-primary/5 rounded-xl border border-primary/10 p-6 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-6">All Movies ({movies.length})</h2>
                {loading && <div className="skeleton h-20 w-full rounded-lg"></div>}
                <div className="space-y-3">
                    {movies.map((movie) => (
                        <div key={movie._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-16 rounded-sm bg-primary/20 overflow-hidden shrink-0">
                                    {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{movie.title}</p>
                                    <p className="text-xs text-slate-500">{movie.genre} • {movie.category}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(movie)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                                <button onClick={() => handleDelete(movie._id)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

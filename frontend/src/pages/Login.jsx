import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) navigate('/');
        return () => dispatch(clearError());
    }, [isAuthenticated, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(form));
    };

    return (
        <main className="flex-1 min-h-screen flex items-center justify-center px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 text-primary mb-4">
                            <span className="material-symbols-outlined text-4xl">movie_filter</span>
                        </div>
                        <h1 className="text-3xl font-black">Welcome Back</h1>
                        <p className="text-slate-400 mt-2">Sign in to your MovieStream account</p>
                    </div>
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">{error}</div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full mt-1 rounded-lg bg-primary/10 border-none py-3 px-4 text-sm text-slate-100 focus:ring-2 focus:ring-primary/50"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full mt-1 rounded-lg bg-primary/10 border-none py-3 px-4 text-sm text-slate-100 focus:ring-2 focus:ring-primary/50"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 mt-2"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="text-center mt-6 text-sm text-slate-400">
                        Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign Up</Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}

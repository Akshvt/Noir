import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../features/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Signup() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) navigate('/');
        return () => dispatch(clearError());
    }, [isAuthenticated, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signup(form));
    };

    return (
        <main className="flex-1 min-h-screen flex items-center justify-center px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-morphism rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-2xl text-white">movie_filter</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-black italic tracking-tight">Create Account</h1>
                        <p className="text-slate-500 mt-2 text-sm">Join <span className="text-primary font-bold">NOIR</span> Premium Cinema</p>
                    </div>
                    {error && (
                        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-red-400">{error}</div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1.5 rounded-lg bg-white/5 border border-glass-border py-3 px-4 text-sm placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary/30" placeholder="John Doe" required />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full mt-1.5 rounded-lg bg-white/5 border border-glass-border py-3 px-4 text-sm placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary/30" placeholder="you@example.com" required />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full mt-1.5 rounded-lg bg-white/5 border border-glass-border py-3 px-4 text-sm placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary/30" placeholder="At least 6 characters" required minLength={6} />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 mt-2 tracking-wider uppercase text-sm shadow-primary-glow">
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                    <p className="text-center mt-6 text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}

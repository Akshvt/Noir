import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from './features/authSlice';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Search from './pages/Search';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Favorites from './pages/Favorites';
import WatchHistory from './pages/WatchHistory';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageMovies from './pages/admin/ManageMovies';
import ManageUsers from './pages/admin/ManageUsers';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

function PageTransition({ children }) {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="page-transition"
        >
            {children}
        </motion.div>
    );
}

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (user?.role !== 'admin') return <Navigate to="/" />;
    return children;
}

function PublicLayout({ children }) {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden noir-grain bg-bg-dark">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout><PageTransition><Home /></PageTransition></PublicLayout>} />
                <Route path="/movie/:id" element={<PublicLayout><PageTransition><MovieDetails /></PageTransition></PublicLayout>} />
                <Route path="/tv/:id" element={<PublicLayout><PageTransition><MovieDetails /></PageTransition></PublicLayout>} />
                <Route path="/search" element={<PublicLayout><PageTransition><Search /></PageTransition></PublicLayout>} />
                <Route path="/explore" element={<PublicLayout><PageTransition><Explore /></PageTransition></PublicLayout>} />
                <Route path="/login" element={<PublicLayout><PageTransition><Login /></PageTransition></PublicLayout>} />
                <Route path="/signup" element={<PublicLayout><PageTransition><Signup /></PageTransition></PublicLayout>} />

                {/* Protected Routes */}
                <Route path="/favorites" element={<PublicLayout><PageTransition><Favorites /></PageTransition></PublicLayout>} />
                <Route path="/history" element={<PublicLayout><PageTransition><WatchHistory /></PageTransition></PublicLayout>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="movies" element={<ManageMovies />} />
                    <Route path="users" element={<ManageUsers />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<PublicLayout>
                    <PageTransition>
                        <main className="flex-1 min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-8xl font-black text-white/10">404</h1>
                                <p className="text-xl text-slate-400 mt-4 tracking-widest uppercase">Page not found</p>
                            </div>
                        </main>
                    </PageTransition>
                </PublicLayout>} />
            </Routes>
        </AnimatePresence>
    );
}

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <AnimatedRoutes />
        </BrowserRouter>
    );
}

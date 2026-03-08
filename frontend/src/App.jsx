import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from './features/authSlice';

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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/movie/:id" element={<PublicLayout><MovieDetails /></PublicLayout>} />
        <Route path="/tv/:id" element={<PublicLayout><MovieDetails /></PublicLayout>} />
        <Route path="/search" element={<PublicLayout><Search /></PublicLayout>} />
        <Route path="/explore" element={<PublicLayout><Explore /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />

        {/* Protected Routes */}
        <Route path="/favorites" element={<PublicLayout><Favorites /></PublicLayout>} />
        <Route path="/history" element={<PublicLayout><WatchHistory /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="movies" element={<ManageMovies />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<PublicLayout>
          <main className="flex-1 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-black text-primary">404</h1>
              <p className="text-xl text-slate-400 mt-4">Page not found</p>
            </div>
          </main>
        </PublicLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Loader2 } from 'lucide-react';
import { HelmetProvider } from 'react-helmet-async';
import { api } from './services/api';

// Context
interface User {
  id: number;
  name: string;
  email: string;
  role: 'guest' | 'vendor' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, login: () => {}, logout: () => {} });

export const useAuth = () => useContext(AuthContext);

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import BookingPage from './pages/BookingPage';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Navbar from './components/Navbar';

function ProtectedRoute({ children, roles }: { children: React.ReactNode, roles?: string[] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCurrentUser()
      .then(user => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData: User) => setUser(userData);
  const logout = () => {
    api.logout().then(() => setUser(null));
  };

  return (
    <HelmetProvider>
      <AuthContext.Provider value={{ user, loading, login, logout }}>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/property/:id" element={<PropertyDetailsPage />} />
                
                <Route path="/booking/:id" element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/vendor/*" element={
                  <ProtectedRoute roles={['vendor', 'admin']}>
                    <VendorDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/admin/*" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <footer className="bg-brand-green text-white py-8 px-4 text-center font-sans">
              <p>&copy; 2026 FemmeGo. All rights reserved.</p>
            </footer>
          </div>
        </BrowserRouter>
      </AuthContext.Provider>
    </HelmetProvider>
  );
}

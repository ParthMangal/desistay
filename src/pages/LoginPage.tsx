import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { api } from '../services/api';
import { Shield, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const data = await api.login(email, password);
      login(data.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-rose-900 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Safe Home" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-6 bg-white/10 backdrop-blur-md p-4 rounded-2xl w-16 h-16 flex items-center justify-center">
            <Shield size={32} className="text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to DesiStays</h1>
          <p className="text-xl text-rose-100 max-w-md">
            Bangalore's most trusted rental platform for women. Verified safety, zero brokerage, and a supportive community.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Sign in</h2>
            <p className="mt-2 text-sm text-gray-600">
              Access your account to manage bookings or listings
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm text-center border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/register" className="font-medium text-pink-600 hover:text-pink-500">
                  Create new account
                </Link>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-gray-400 hover:text-gray-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 shadow-md hover:shadow-lg transition-all"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <p className="text-xs text-center text-gray-500 uppercase tracking-wide font-semibold mb-4">Demo Credentials</p>
            <div className="grid grid-cols-1 gap-2 text-xs text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between">
                <span className="font-medium">Guest:</span>
                <span className="font-mono">guest@traveler.com / password123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Vendor:</span>
                <span className="font-mono">vendor@bangalorestays.com / password123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Admin:</span>
                <span className="font-mono">admin@desistays.com / password123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

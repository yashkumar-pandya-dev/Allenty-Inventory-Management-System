"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/token/', { 
        username, 
        password 
      });
      
      localStorage.setItem('accessToken', res.data.access);
      localStorage.setItem('refreshToken', res.data.refresh);
      router.push('/dashboard');
    } catch (err) {
      console.error("Login Error:", err);
      setError('Invalid credentials. Try admin / 1234');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:flex md:w-1/2 bg-blue-900 text-white flex-col justify-center p-16 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-800 rounded-full opacity-50 blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            ALLENTY INVENTORY<br/>MANAGEMENT SYSTEM
          </h1>
          <p className="text-blue-200 text-sm lg:text-base leading-relaxed tracking-wide font-medium">
            VRAJ PATEL || YASHKUMAR PANDYA || KRISH TRIVEDI ||<br/>
            DEVKUMAR CHHATRALA ||  PRIYA RANA || PRANAV PATEL
          </p>
          <p className="text-blue-200 text-sm lg:text-base leading-relaxed tracking-wide font-medium">
            Client : Pedro Henrique Gomes De Toledo (Allenty)
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <img src="/icon.png" alt="Allenty Logo" className="h-12 w-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900">Admin Login</h3>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username / Email</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-colors disabled:opacity-70 mt-4 shadow-md"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

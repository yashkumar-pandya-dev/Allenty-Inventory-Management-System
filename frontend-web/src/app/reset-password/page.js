"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/password-reset/confirm/', {
        uid,
        token,
        new_password: password,
      });
      setSuccess(true);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Reset link is invalid or has expired.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!uid || !token) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
        <p className="text-gray-500 mb-6">This reset link is missing required parameters.</p>
        <Link href="/forgot-password" className="text-blue-600 font-semibold hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle size={56} className="mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Password Updated!</h2>
        <p className="text-gray-500 mb-6">Your password has been reset successfully.</p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Set New Password</h2>
        <p className="text-gray-500 leading-relaxed">
          Choose a strong password of at least 8 characters.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 mb-5 text-sm flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="At least 8 characters"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="Re-enter your password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-lg transition-colors shadow-md mt-2 flex items-center justify-center"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : 'Update Password'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:flex md:w-1/2 bg-blue-900 text-white flex-col justify-center p-16 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-800 rounded-full opacity-50 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            ALLENTY INVENTORY<br />MANAGEMENT SYSTEM
          </h1>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-800 mb-8 font-medium transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Login
          </Link>
          <Suspense fallback={<p className="text-gray-400">Loading...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

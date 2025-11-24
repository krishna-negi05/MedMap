// app/reset-password/page.js
'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. Grab the token from the URL (e.g. ?token=abc123...)
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!token) {
      setErrorMessage('Invalid or missing reset token.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // 2. Call your existing API route
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        // Optional: Auto-redirect after 2 seconds
        setTimeout(() => {
          router.push('/login'); 
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If accessed without a token, show error immediately
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900">Invalid Link</h1>
          <p className="text-slate-500 mt-2">This password reset link is invalid or missing a token.</p>
          <button onClick={() => router.push('/login')} className="mt-6 text-teal-600 font-bold hover:underline">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Success View
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Password Reset!</h1>
          <p className="text-slate-500 mt-2 mb-6">You can now access your account with your new password.</p>
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-transform active:scale-95"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Default Form View
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50 via-slate-50 to-white p-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-white/50 max-w-md w-full relative overflow-hidden">
        
        {/* Decorative header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-teal-50 rounded-2xl mb-4">
            <Lock className="w-6 h-6 text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">New Password</h1>
          <p className="text-slate-500 mt-2">Create a strong password to secure your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">New Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
}

// Wrap in Suspense because useSearchParams() is used
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
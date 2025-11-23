'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight, Mail, Lock, User, CheckCircle2, Loader2 } from 'lucide-react';

// Custom Icons for Socials
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);

export default function LoginView() {
  const [isLogin, setIsLogin] = useState(true); // Toggle state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          name: isLogin ? undefined : name, // Only send name if signing up
          mode: isLogin ? 'login' : 'signup' // Tell API intended action
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.refresh(); // Vital: Update client-side session state
        router.push('/mindmap'); 
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/guest', { method: 'POST' });
      if (res.ok) {
        router.refresh(); // Vital: Update client-side session state
        router.push('/mindmap');
      } else {
        setError('Guest access failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50 via-slate-50 to-white p-4">
      <div className="relative w-full max-w-5xl min-h-[600px] bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 flex overflow-hidden transition-all duration-500">
        
        {/* Left Side - Brand Hero */}
        <div className="hidden md:flex w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-[100px] opacity-20 -mr-16 -mt-16 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -ml-16 -mb-16 animate-pulse delay-700"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-6">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Activity className="w-6 h-6 text-teal-400" />
                </div>
                <span className="font-bold text-2xl tracking-tight">MedMap</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Master Medical <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">Visually.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
              Your intelligent companion for clinical reasoning, syllabus tracking, and visual learning.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-teal-500"/> AI Powered</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-teal-500"/> Updated Syllabus</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/60 relative">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 mb-8">
              {isLogin ? 'Enter your details to access your workspace.' : 'Join MedMap to start your journey.'}
            </p>

            {/* Social Login - Only show on Login for simplicity */}
            {isLogin && (
              <div className="flex gap-3 mb-8">
                <button className="flex-1 flex items-center justify-center py-2.5 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all shadow-sm">
                  <GoogleIcon />
                </button>
                <button className="flex-1 flex items-center justify-center py-2.5 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all shadow-sm">
                  <FacebookIcon />
                </button>
                <button className="flex-1 flex items-center justify-center py-2.5 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all shadow-sm">
                  <InstagramIcon />
                </button>
              </div>
            )}

            {isLogin && (
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/0 px-2 text-slate-400 backdrop-blur-xl bg-slate-50">Or continue with email</span></div>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {/* Name Field - Only for Sign Up */}
              {!isLogin && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                    <input 
                      type="text" 
                      required={!isLogin}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm"
                      placeholder="Dr. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                  <input 
                    type="email" 
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm"
                    placeholder="doctor@medmap.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                  <input 
                    type="password" 
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg animate-in fade-in">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')} 
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Footer Area: Guest Mode + Toggle Sign Up/Login */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-200">
                <button 
                    onClick={handleGuestAccess} 
                    disabled={loading}
                    className="text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                    Continue as Guest
                </button>

                <button 
                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    className="text-sm font-bold text-slate-900 hover:text-teal-600 transition-colors"
                >
                    {isLogin ? 'Create Account' : 'Back to Login'}
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
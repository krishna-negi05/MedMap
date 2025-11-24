'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Activity, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

/* ---------- social icons ---------- */
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5 text-slate-900" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ---------- Inner Form Component ---------- */
function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to read URL params
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle URL Errors (e.g. account_exists)
  useEffect(() => {
    const errorType = searchParams.get('error');
    if (errorType === 'account_exists') {
      setError('You already have an account with this email. Please log in.');
    } else if (errorType === 'oauth_failed') {
      setError('Social sign-up failed. Please try again.');
    }
  }, [searchParams]);

  // FIXED: Now uses the 'provider' argument dynamically
  const socialSignUp = (provider) => {
    window.location.href = `/api/auth/${provider}?intent=signup`; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        router.refresh();
        router.push('/onboard');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50 via-slate-50 to-white p-4">
      <div className="relative w-full max-w-5xl min-h-[640px] bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 flex overflow-hidden transition-all duration-500">
        {/* Left hero */}
        <div className="hidden md:flex w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-[100px] opacity-20 -mr-16 -mt-16 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -ml-16 -mb-16 animate-pulse delay-700" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Activity className="w-6 h-6 text-teal-400" />
              </div>
              <span className="font-bold text-2xl tracking-tight">MedMap</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Create Account <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">Visually.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
              Sign up to save your visual maps, track progress, and personalise MedMap.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Easy start</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Secure</span>
            </div>
          </div>
        </div>

        {/* Right side - form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/60 relative">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
            <p className="text-slate-500 mb-6">Sign Up with Google / Facebook / X.</p>

            {/* Social Login */}
            <div className="flex gap-3 mb-6">
              {/* Google */}
              <button
                onClick={() => socialSignUp('google')}
                className="flex-1 min-w-0 flex items-center justify-center py-2.5 border border-slate-200 rounded-xl hover:bg-white transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                aria-label="Sign up with Google"
                title="Sign up with Google"
              >
                <GoogleIcon />
              </button>

              {/* Facebook */}
              <button
                onClick={() => socialSignUp('facebook')}
                className="flex-1 min-w-0 flex items-center justify-center py-2.5 border border-slate-200 rounded-xl hover:bg-white transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                aria-label="Sign up with Facebook"
                title="Sign up with Facebook"
              >
                <FacebookIcon />
              </button>

              {/* X (Twitter) */}
              <button
                onClick={() => socialSignUp('twitter')}
                className="flex-1 min-w-0 flex items-center justify-center py-2.5 border border-slate-200 rounded-xl hover:bg-white transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                aria-label="Sign up with X"
                title="Sign up with X"
              >
                <XIcon />
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/0 px-2 text-slate-400">Or continue with email</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* --- Error Display --- */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Email</label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    className="w-full pl-4 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-sm"
                    placeholder="doctor@medmap.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
                <div className="relative group">
                  <input
                    type="password"
                    required
                    className="w-full pl-4 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  disabled={loading}
                  type="submit"
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Create account'}
                  {!loading && <ArrowRight size={16} />}
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="px-4 py-3 rounded-xl border cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  Back
                </button>
              </div>
            </form>

            <p className="text-xs text-slate-500 mt-6 text-center">By creating an account you agree to our terms &amp; privacy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Export (Wrapped in Suspense) ---------- */
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, User, Check, Sparkles, Stethoscope, Activity, Heart, GraduationCap, ChevronDown } from 'lucide-react'; // Added GraduationCap and ChevronDown

export default function OnboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [year, setYear] = useState(1); // <--- NEW STATE
  const [error, setError] = useState('');

  // 6 avatars
  const avatars = [
    '/avatars/a1.png',
    '/avatars/a2.png',
    '/avatars/a3.png',
    '/avatars/a4.png',
    '/avatars/a5.png',
    '/avatars/a6.png',
  ];

  // Check logged-in user — redirect to login if no valid session
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();

        if (!data?.ok || !data?.user) {
          router.push('/login');
          return;
        }

        // If user already has name+avatar AND year, skip onboarding
        if (data.user.name && data.user.avatar && data.user.year) {
          router.push('/'); 
          return;
        }

        // PRE-FILL NAME and YEAR if available
        if (data.user.name) setName(data.user.name);
        if (data.user.year) setYear(data.user.year);

        setLoading(false);
      } catch {
        router.push('/login');
      }
    }

    load();
  }, [router]);

  const handleSubmit = async () => {
    if (!name.trim()) return setError('Please enter your name.');
    if (!avatar) return setError('Please choose an avatar.');

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // --- UPDATED PAYLOAD with YEAR ---
        body: JSON.stringify({ name, avatar, year: parseInt(year) }),
      });

      const data = await res.json();
      if (res.ok) {
        window.location.href = '/';
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-teal-600" />
        <p className="text-slate-500 font-medium animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
      
      {/* Background Decor - Animated Orbs & Icons */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none select-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-teal-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        
        {/* Floating Medical Icons */}
        <div className="absolute top-20 left-20 text-teal-200/40 animate-bounce duration-[3000ms]">
          <Stethoscope size={64} />
        </div>
        <div className="absolute bottom-20 right-20 text-blue-200/40 animate-bounce duration-[4000ms] delay-500">
          <Activity size={64} />
        </div>
        <div className="absolute top-1/2 left-10 text-slate-200/40 animate-pulse duration-[5000ms]">
          <Heart size={48} />
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Step Indicator */}
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-bold uppercase tracking-wider rounded-full border border-teal-100 shadow-sm">
            Setup Profile
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">MedMap</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Let’s personalize your workspace. <br className="hidden sm:block"/> Tell us a bit about yourself.
          </p>
        </div>

        {/* Name input */}
        <div className="mb-6 group relative">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">
            What should we call you?
          </label>
          <div className="relative transform transition-transform duration-200 focus-within:scale-[1.02]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
                <User size={20} />
              </div>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Aditya"
              className="w-full pl-14 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* --- NEW YEAR SELECTOR --- */}
        <div className="mb-10 group relative">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">
            Which Year are you in?
          </label>
          <div className="relative transform transition-transform duration-200 focus-within:scale-[1.02]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
                <GraduationCap size={20} />
              </div>
            </div>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm appearance-none"
            >
              <option value={1}>Year 1 (Pre-Clinical)</option>
              <option value={2}>Year 2 (Para-Clinical)</option>
              <option value={3}>Year 3 (Part 1 - ENT, Ophthalmology, PSM)</option>
              <option value={4}>Year 4 (Part 2 - Final)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-slate-400"/>
            </div>
          </div>
        </div>
        {/* --- END NEW YEAR SELECTOR --- */}

        {/* Avatar picker */}
        <div className="mb-10">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 ml-1 flex items-center gap-2">
            Pick your persona <Sparkles size={14} className="text-amber-400" />
          </label>
          
          {/* ENLARGED PREVIEW SECTION */}
          <div className={`transition-all duration-500 ease-out ${avatar ? 'h-48 opacity-100 mb-6' : 'h-0 opacity-0 mb-0'} overflow-hidden`}>
            {avatar && (
              <div className="flex justify-center items-center h-full pt-2">
                <div className="relative w-40 h-40 group">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-200 to-blue-100 rounded-[2rem] rotate-6 scale-105 opacity-50 blur-xl animate-pulse"></div>
                  
                  {/* Card */}
                  <div className="relative w-full h-full bg-white rounded-[2rem] shadow-2xl border-4 border-white p-2 animate-in zoom-in-50 slide-in-from-bottom-4 duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-blue-50 rounded-[1.5rem]" />
                    <img 
                      src={avatar} 
                      alt="Selected Avatar" 
                      className="relative w-full h-full object-cover rounded-[1.5rem]"
                    />
                    <div className="absolute -bottom-3 -right-3 bg-teal-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <Check size={20} strokeWidth={4} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {avatars.map((a, i) => (
              <button
                key={a}
                type="button"
                onClick={() => setAvatar(a)}
                className={`relative group aspect-square rounded-2xl transition-all duration-300 outline-none
                  ${avatar === a 
                    ? 'ring-2 ring-teal-500/50 scale-95 opacity-50 grayscale' 
                    : 'hover:shadow-lg hover:-translate-y-2 hover:scale-105'}
                `}
              >
                {/* 1. Solid White Base Layer */}
                <div className="absolute inset-0 rounded-2xl bg-white" />

                {/* 2. Color Layer */}
                <div className={`absolute inset-0 rounded-2xl transition-colors duration-300
                  ${avatar === a 
                    ? 'bg-slate-100' 
                    : 'bg-slate-100 group-hover:bg-teal-50'}
                `} />

                {/* 3. Image Layer */}
                <img
                  src={a}
                  alt={`Avatar ${i + 1}`}
                  className="relative z-10 w-full h-full object-cover rounded-2xl p-1" 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="group w-full bg-slate-900 hover:bg-slate-800 cursor-pointer text-white py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
        >
          {submitting ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Start Journey 
              <span className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
                <ArrowRight size={18} />
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
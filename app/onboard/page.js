'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';

export default function OnboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');

  // avatars (simple starter set)
  const avatars = [
    '/avatars/a1.png',
    '/avatars/a2.png',
    '/avatars/a3.png',
    '/avatars/a4.png',
    '/avatars/a5.png',
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

        // If user already has name+avatar → skip onboarding
        if (data.user.name && data.user.avatar) {
          router.push('/mindmap');
          return;
        }

        setLoading(false);
      } catch {
        router.push('/login');
      }
    }

    load();
  }, [router]);

  const handleSubmit = async () => {
    if (!name) return setError('Please enter your name.');
    if (!avatar) return setError('Please choose an avatar.');

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/mindmap');
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-slate-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-100 to-white p-6">
      <div className="w-full max-w-lg bg-white/60 backdrop-blur-xl p-10 rounded-3xl border shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-slate-800">Welcome 🎉</h1>
        <p className="text-slate-500 mb-6">
          Let’s personalise your MedMap profile.
        </p>

        {/* Name input */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-slate-600">Your Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full mt-2 p-3 border rounded-xl bg-white shadow-sm"
          />
        </div>

        {/* Avatar picker */}
        <label className="text-sm font-semibold text-slate-600">Choose Avatar</label>
        <div className="grid grid-cols-5 gap-4 my-4">
          {avatars.map((a) => (
            <div
              key={a}
              onClick={() => setAvatar(a)}
              className={`rounded-xl p-1 cursor-pointer border-2 transition ${
                avatar === a ? 'border-teal-500' : 'border-transparent'
              }`}
            >
              <img
                src={a}
                className="rounded-xl w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-600 bg-red-50 p-2 rounded-lg text-sm mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-slate-900 text-white py-3 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Continue <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

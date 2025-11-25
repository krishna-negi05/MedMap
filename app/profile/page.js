'use client';
import { useState, useEffect } from 'react';
import { User, Mail, Save, Loader2, CheckCircle2, GraduationCap, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // User State
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [academicYear, setAcademicYear] = useState(1); // <--- NEW STATE
  const [msg, setMsg] = useState('');

  const avatars = [
    '/avatars/a1.png',
    '/avatars/a2.png',
    '/avatars/a3.png',
    '/avatars/a4.png',
    '/avatars/a5.png',
    '/avatars/a6.png',
  ];

  // 1. Fetch User Data on Mount
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.ok && data.user) {
          setUser(data.user);
          setName(data.user.name || '');
          setAvatar(data.user.avatar || '/avatars/a1.png');
          setAcademicYear(data.user.year || 1); // <--- INITIALIZE YEAR
        } else {
          router.push('/login');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  // 2. Handle Save Updates
  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // --- UPDATED PAYLOAD with YEAR ---
        body: JSON.stringify({ 
          name, 
          avatar, 
          year: parseInt(academicYear) // Send as integer
        }),
      });
      
      if (res.ok) {
        setMsg('Profile updated successfully! Refreshing...');
        
        setTimeout(() => {
          window.location.reload(); 
        }, 1000); 
      } else {
        alert('Failed to update profile');
      }
    } catch (e) {
      alert('Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-500">Manage your account details and appearance.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        
        {/* Avatar Selection Section */}
        <div className="mb-10">
          <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Choose Avatar</label>
          <div className="flex flex-wrap gap-4">
            {avatars.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 ${
                  avatar === a 
                    ? 'ring-4 ring-teal-500 ring-offset-2 scale-105 shadow-lg' 
                    : 'hover:scale-105 hover:shadow-md opacity-70 hover:opacity-100'
                }`}
              >
                <img src={a} alt="avatar" className="w-full h-full object-cover bg-slate-100" />
                {avatar === a && (
                  <div className="absolute inset-0 bg-teal-500/20 flex items-center justify-center">
                    <div className="bg-teal-500 text-white rounded-full p-1">
                      <CheckCircle2 size={16} strokeWidth={3} />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 max-w-md">
          
          {/* Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Display Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                placeholder="Dr. Name"
              />
            </div>
          </div>
          
          {/* Academic Year Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Academic Year</label>
            <div className="relative group">
              <GraduationCap className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm appearance-none"
              >
                <option value={1}>Year 1 (Pre-Clinical)</option>
                <option value={2}>Year 2 (Para-Clinical)</option>
                <option value={3}>Year 3 (Part 1)</option>
                <option value={4}>Year 4 (Part 2 - Final)</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 ml-1">Your roadmap status is based on this setting.</p>
          </div>

          {/* Email Input (Read Only) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input 
                value={user?.email || ''}
                disabled
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium select-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2 disabled:opacity-70 active:scale-95"
            >
              {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
              Save Changes
            </button>
            
            {/* Success Message */}
            {msg && (
              <div className="mt-4 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-bottom-2">
                <CheckCircle2 size={20} className="text-green-600" /> {msg}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
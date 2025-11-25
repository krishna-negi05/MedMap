'use client';
import { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Layers, Zap, Clock, Bell, User, CheckCircle2, Save, Loader2, BarChart, ChevronDown } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // New state for saving status
  const [user, setUser] = useState(null); // To store full user object
  const [theme, setTheme] = useState('light');
  const [mindmapDepth, setMindmapDepth] = useState(3); // Now fetched from user object
  const [contentDensity, setContentDensity] = useState('standard'); 
  const [defaultDifficulty, setDefaultDifficulty] = useState('Intermediate');
  const [autoProgress, setAutoProgress] = useState(true);
  const [roadmapReminders, setRoadmapReminders] = useState(true);
  const [msg, setMsg] = useState('');

  // 1. Fetch ALL settings on mount
  useEffect(() => {
    async function loadSettings() {
        try {
            const res = await fetch('/api/auth/session');
            const data = await res.json();
            if (data.ok && data.user) {
                setUser(data.user);
                // Map database fields to state
                setMindmapDepth(data.user.mindmapDepth || 3); 
                // You would map other settings here as you implement them
            }
        } catch (e) {
            console.error("Failed to load user settings", e);
        } finally {
            setLoading(false);
        }
    }
    loadSettings();
  }, []);

  // 2. Handle Save (Actual API call)
  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    
    // Collect data for API payload
    const payload = {
        // Must send existing fields to avoid clearing them on the backend update API
        name: user.name, 
        avatar: user.avatar, 
        year: user.year,
        
        // Settings to update
        mindmapDepth: parseInt(mindmapDepth), 
        // theme: theme, // You would add this if implemented
    };
    
    try {
        const res = await fetch('/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            setMsg('Preferences saved successfully!');
            // Force a session refresh to get new values immediately
            window.location.reload(); 
        } else {
            setMsg('Failed to save preferences.');
        }

    } catch (e) {
        setMsg('Network error while saving.');
    } finally {
        setSaving(false);
        setTimeout(() => setMsg(''), 3000);
    }
  };


  const DensityOptions = [
    { value: 'compact', label: 'Compact (More content)' },
    { value: 'standard', label: 'Standard (Balanced)' },
    { value: 'spacious', label: 'Spacious (Relaxed)' },
  ];
  
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
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Settings size={28} className="text-teal-600" /> General Preferences
        </h1>
        <p className="text-slate-500">Configure the MedMap application interface and study behavior.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-8">
        
        {/* === 1. APPEARANCE === */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Appearance</h2>
          
          {/* Theme Toggle */}
    

          {/* Density Selector */}
          <div className="p-4 mt-4 bg-slate-50 rounded-xl space-y-3">
             <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Content Density</h3>
             <div className="flex gap-4">
               {DensityOptions.map(opt => (
                 <button 
                   key={opt.value} 
                   onClick={() => setContentDensity(opt.value)}
                   className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${contentDensity === opt.value ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`}
                 >
                   {opt.label}
                 </button>
               ))}
             </div>
          </div>
        </section>

        {/* === 2. STUDY DEFAULTS === */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Study Defaults</h2>

          {/* Default Mindmap Depth (NOW FUNCTIONAL) */}
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Layers size={20} className="text-blue-600"/>
              <div>
                <p className="font-medium text-slate-700">Mindmap Initial Depth</p>
                <p className="text-xs text-slate-500">Sets how deep the AI generates the topic hierarchy.</p>
              </div>
            </div>
            <div className="relative">
              <select
                value={mindmapDepth}
                onChange={(e) => setMindmapDepth(parseInt(e.target.value))}
                className="w-20 pl-4 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 appearance-none focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Default Case Difficulty */}
          <div className="flex justify-between items-center p-4 mt-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <BarChart size={20} className="text-red-600"/>
              <div>
                <p className="font-medium text-slate-700">Default Case Difficulty</p>
                <p className="text-xs text-slate-500">Level used when generating a new clinical case.</p>
              </div>
            </div>
            <div className="relative">
              <select
                value={defaultDifficulty}
                onChange={(e) => setDefaultDifficulty(e.target.value)}
                className="w-32 pl-4 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 appearance-none focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Academic Year Auto-Promotion Toggle */}
          <div className="flex justify-between items-center p-4 mt-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-teal-600"/>
              <div>
                <p className="font-medium text-slate-700">Syllabus Auto-Progression</p>
                <p className="text-xs text-slate-500">Automatically advance academic year on July 1st.</p>
              </div>
            </div>
            <button 
              onClick={() => setAutoProgress(!autoProgress)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoProgress ? 'bg-teal-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoProgress ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>


        {/* === 3. NOTIFICATIONS === */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Notifications</h2>

          {/* Roadmap Reminders Toggle */}
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-amber-600"/>
              <div>
                <p className="font-medium text-slate-700">Roadmap Completion Reminders</p>
                <p className="text-xs text-slate-500">Remind me if a subject remains incomplete for too long.</p>
              </div>
            </div>
            <button 
              onClick={() => setRoadmapReminders(!roadmapReminders)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${roadmapReminders ? 'bg-teal-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${roadmapReminders ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>


        {/* === Save Button & Message === */}
        <div className="pt-4 flex items-center gap-4">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2 disabled:opacity-70 active:scale-95"
          >
            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
            Save All Preferences
          </button>
          
          {msg && (
            <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-3 text-sm font-bold">
              <CheckCircle2 size={20} className="text-green-600" /> {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
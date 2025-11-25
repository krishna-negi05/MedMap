'use client';
import { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Layers, Zap, Clock, Bell, CheckCircle2, Save, Loader2, BarChart, ChevronDown } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // User Data
  const [user, setUser] = useState(null);
  
  // Preferences State
  const [theme, setTheme] = useState('light');
  const [mindmapDepth, setMindmapDepth] = useState(3);
  const [contentDensity, setContentDensity] = useState('standard'); 
  const [defaultDifficulty, setDefaultDifficulty] = useState('Intermediate');
  const [autoProgress, setAutoProgress] = useState(true);
  const [roadmapReminders, setRoadmapReminders] = useState(true);
  
  const [msg, setMsg] = useState('');

  // 1. Load Settings from Database
  useEffect(() => {
    async function loadSettings() {
        try {
            const res = await fetch('/api/auth/session');
            const data = await res.json();
            if (data.ok && data.user) {
                setUser(data.user);
                // Map DB fields to State
                setTheme(data.user.theme || 'light');
                setMindmapDepth(data.user.mindmapDepth || 3);
                setContentDensity(data.user.contentDensity || 'standard');
                setDefaultDifficulty(data.user.defaultDifficulty || 'Intermediate');
                setAutoProgress(data.user.autoProgress ?? true); // Use ?? true to handle false
                setRoadmapReminders(data.user.roadmapReminders ?? true);
            }
        } catch (e) {
            console.error("Failed to load settings", e);
        } finally {
            setLoading(false);
        }
    }
    loadSettings();
  }, []);

  // 2. Handle Save
  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    
    const payload = {
        // Required fields to keep profile intact
        name: user?.name, 
        avatar: user?.avatar, 
        year: user?.year,
        
        // Preferences to update
        theme,
        mindmapDepth: parseInt(mindmapDepth),
        contentDensity,
        defaultDifficulty,
        autoProgress,
        roadmapReminders
    };
    
    try {
        const res = await fetch('/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            setMsg('Preferences saved successfully!');
            // Apply theme immediately
            document.documentElement.classList.toggle('dark', theme === 'dark');
            // Reload to sync other components
            setTimeout(() => window.location.reload(), 800); 
        } else {
            setMsg('Failed to save preferences.');
        }
    } catch (e) {
        setMsg('Network error.');
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600"/></div>;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Settings size={28} className="text-teal-600" /> General Preferences
        </h1>
        <p className="text-slate-500">Configure your MedMap experience.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-8">
        
        {/* === 1. APPEARANCE === */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Appearance</h2>
          
         

          {/* Density Selector */}
          <div className="mt-4 p-4 bg-slate-50 rounded-xl">
             <div className="mb-3 flex items-center gap-3">
                <Zap size={20} className="text-blue-600"/>
                <div>
                    <p className="font-medium text-slate-700">Content Density</p>
                    <p className="text-xs text-slate-500">Adjust how compact the interface looks.</p>
                </div>
             </div>
             <div className="grid grid-cols-3 gap-2">
               {['compact', 'standard', 'spacious'].map(opt => (
                 <button 
                   key={opt} 
                   onClick={() => setContentDensity(opt)}
                   className={`py-2 text-xs font-bold capitalize rounded-lg border transition-all ${contentDensity === opt ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                 >
                   {opt}
                 </button>
               ))}
             </div>
          </div>
        </section>

        {/* === 2. STUDY DEFAULTS === */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Study Defaults</h2>

          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Layers size={20} className="text-indigo-600"/>
              <div>
                <p className="font-medium text-slate-700">Mindmap Depth</p>
                <p className="text-xs text-slate-500">Default layers generated by AI.</p>
              </div>
            </div>
            <select value={mindmapDepth} onChange={(e) => setMindmapDepth(parseInt(e.target.value))} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500">
                <option value={2}>2 Levels</option>
                <option value={3}>3 Levels</option>
                <option value={4}>4 Levels</option>
            </select>
          </div>

          <div className="flex justify-between items-center p-4 mt-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <BarChart size={20} className="text-red-600"/>
              <div>
                <p className="font-medium text-slate-700">Case Difficulty</p>
                <p className="text-xs text-slate-500">Default complexity for new clinical cases.</p>
              </div>
            </div>
            <select value={defaultDifficulty} onChange={(e) => setDefaultDifficulty(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
            </select>
          </div>
          
          <div className="flex justify-between items-center p-4 mt-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-teal-600"/>
              <div>
                <p className="font-medium text-slate-700">Auto-Progression</p>
                <p className="text-xs text-slate-500">Advance academic year automatically.</p>
              </div>
            </div>
            <button onClick={() => setAutoProgress(!autoProgress)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoProgress ? 'bg-teal-600' : 'bg-slate-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoProgress ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        {/* === 3. NOTIFICATIONS === */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Notifications</h2>
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-amber-600"/>
              <div>
                <p className="font-medium text-slate-700">Study Reminders</p>
                <p className="text-xs text-slate-500">Get nudged for incomplete topics.</p>
              </div>
            </div>
            <button onClick={() => setRoadmapReminders(!roadmapReminders)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${roadmapReminders ? 'bg-teal-600' : 'bg-slate-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${roadmapReminders ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        {/* === Save Button === */}
        <div className="pt-4 flex items-center gap-4">
          <button onClick={handleSave} disabled={saving} className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2 disabled:opacity-70 active:scale-95">
            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />} Save Preferences
          </button>
          {msg && <div className="text-green-600 text-sm font-bold flex items-center gap-2 animate-in fade-in"><CheckCircle2 size={18}/> {msg}</div>}
        </div>
      </div>
    </div>
  );
}
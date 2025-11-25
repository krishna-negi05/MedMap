'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Brain, Stethoscope, Map as MapIcon, Clock, ArrowRight, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ mindmaps: 0, cases: 0, progress: 0 });
  const [recents, setRecents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch Session User
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        if (sessionData.ok) setUser(sessionData.user);

        // 2. Fetch Counts (You might need a new API route for this "summary" data 
        // or just hit existing endpoints if they are light enough)
        const [mapsRes, casesRes, progRes] = await Promise.all([
            fetch('/api/mindmap'),
            fetch('/api/cases'),
            fetch('/api/roadmap/progress')
        ]);

        const maps = await mapsRes.json();
        const cases = await casesRes.json();
        const prog = await progRes.json();

        // Calculate Stats
        const mapCount = maps.ok ? maps.data.length : 0;
        const caseCount = cases.ok ? cases.data.length : 0;
        
        // Calculate Progress % (Assuming total topics is constant, e.g., 80 from your data.js)
        const totalTopics = 80; 
        const completedCount = prog.ok ? Object.keys(prog.data).length : 0;
        const progressPercent = Math.round((completedCount / totalTopics) * 100);

        setStats({ mindmaps: mapCount, cases: caseCount, progress: progressPercent });

        // Get recent activity (just taking the latest mindmaps for now)
        if (maps.ok && maps.data.length > 0) {
            setRecents(maps.data.slice(0, 3));
        }

      } catch (e) {
        console.error("Dashboard load failed", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-teal-600"/></div>;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name || 'Doctor'}!</h1>
        <p className="text-slate-500">Here is your study overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Brain size={24}/></div>
            <div>
                <div className="text-2xl font-bold text-slate-900">{stats.mindmaps}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Mindmaps Created</div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl"><Stethoscope size={24}/></div>
            <div>
                <div className="text-2xl font-bold text-slate-900">{stats.cases}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cases Solved</div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><MapIcon size={24}/></div>
            <div>
                <div className="text-2xl font-bold text-slate-900">{stats.progress}%</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Syllabus Done</div>
            </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-slate-900 text-lg">Recent Mindmaps</h3>
            {recents.length > 0 ? (
                <div className="grid gap-4">
                    {recents.map(map => (
                        <div key={map.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-50 p-2 rounded-lg"><Brain size={16} className="text-slate-400"/></div>
                                <div>
                                    <div className="font-bold text-slate-800">{map.topic}</div>
                                    <div className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10}/> {new Date(map.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <Link href="/mindmap" className="text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">View</Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                    <p className="text-slate-400 text-sm mb-4">No activity yet. Start studying!</p>
                    <Link href="/mindmap" className="inline-flex items-center gap-2 text-teal-600 font-bold text-sm hover:underline">Create First Map <ArrowRight size={14}/></Link>
                </div>
            )}
         </div>

         {/* Right Column */}
         <div>
            <h3 className="font-bold text-slate-900 text-lg mb-6">Quick Start</h3>
            <div className="space-y-3">
                <Link href="/cases" className="block p-4 bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-200 hover:bg-teal-700 transition-all active:scale-95">
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-bold">Solve a Case</span>
                        <Stethoscope size={18} className="text-teal-200"/>
                    </div>
                    <p className="text-teal-100 text-xs">Practice clinical reasoning</p>
                </Link>
                <Link href="/roadmap" className="block p-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-teal-300 hover:shadow-md transition-all active:scale-95">
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-bold">Track Progress</span>
                        <MapIcon size={18} className="text-slate-400"/>
                    </div>
                    <p className="text-slate-400 text-xs">Update your syllabus roadmap</p>
                </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
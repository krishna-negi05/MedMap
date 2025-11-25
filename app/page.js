'use client';
import Link from 'next/link';
import { ArrowRight, Brain, Stethoscope, Layers, Map as MapIcon, Zap, Shield, Users, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100/40 via-slate-50 to-white"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full px-6 py-12 md:py-20 flex flex-col items-center text-center">
        
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-teal-200 shadow-sm mb-8 backdrop-blur-sm hover:scale-105 transition-transform cursor-default select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">v1.0 Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Master Medical <br className="hidden md:block" />
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500">Visually.</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-teal-200/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            The intelligent companion for medical students. Generate mindmaps, solve AI patient cases, and track your MBBS progress in one workspace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/mindmap" className="group bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 active:scale-95">
              Start Studying 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
            <Link href="/cases" className="group bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95">
              <Stethoscope size={18} className="text-teal-600"/>
              Try a Case
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity duration-500 cursor-default">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                    <img src={`/avatars/a${i}.png`} alt="user" className="w-full h-full object-cover"/>
                  </div>
                ))}
             </div>
             <div className="text-left text-xs font-medium text-slate-500">
                <div className="flex items-center text-amber-400 mb-0.5">
                  <Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/>
                </div>
                <span className="text-slate-700 font-bold">Loved by 500+ Medicos</span>
             </div>
          </div>
        </div>

        {/* === 3. Feature Cards (Updated Grid) === */}
        {/* Added 'Community' card below */}
        <div className="w-full mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
          <FeatureCard 
            href="/mindmap"
            title="AI Mindmaps"
            desc="Turn complex textbooks into clean, high-yield knowledge graphs instantly."
            icon={Brain}
            color="purple"
          />
          <FeatureCard 
            href="/cases"
            title="Clinical Cases"
            desc="Practice diagnosis on infinite generated patient scenarios."
            icon={Stethoscope}
            color="teal"
          />
          {/* Replaced Tools with Community or Added as new one - let's add it! */}
          <FeatureCard 
            href="/community"
            title="Student Community"
            desc="Share notes, discuss clinical cases, and connect with peers."
            icon={Users}
            color="pink"
          />
          <FeatureCard 
            href="/roadmap"
            title="Study Roadmap"
            desc="Track your progress through the entire MBBS syllabus weekly."
            icon={MapIcon}
            color="amber"
          />
        </div>

        <div className="mt-24 pt-10 border-t border-slate-200/60 w-full flex flex-col md:flex-row justify-center items-center gap-8 text-sm text-slate-400 font-medium">
           <div className="flex items-center gap-2 hover:text-teal-600 transition-colors"><Shield size={16}/> Secure Data</div>
           <div className="flex items-center gap-2 hover:text-teal-600 transition-colors"><Zap size={16}/> Real-time AI</div>
           <div className="flex items-center gap-2 hover:text-teal-600 transition-colors"><Users size={16}/> Student Focused</div>
        </div>

      </div>
    </div>
  );
}

function FeatureCard({ href, title, desc, icon: Icon, color }) {
  const colors = {
    purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    teal: "bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white",
    blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    amber: "bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
    pink: "bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white", // Added Pink style
  };

  const blobs = {
    purple: "bg-purple-50",
    teal: "bg-teal-50",
    blue: "bg-blue-50",
    amber: "bg-amber-50",
    pink: "bg-pink-50",
  };

  return (
    <Link 
      href={href} 
      className="group relative bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-white/50 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 overflow-hidden text-left h-full flex flex-col"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${blobs[color] || blobs.blue} rounded-bl-[4rem] -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150`}></div>
      
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 relative z-10 ${colors[color] || colors.blue} shadow-sm`}>
        <Icon size={28} />
      </div>
      
      <h3 className="font-bold text-xl text-slate-900 mb-3 relative z-10 group-hover:text-slate-800">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed relative z-10 group-hover:text-slate-600">{desc}</p>
      
      <div className="mt-auto pt-6 flex items-center text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900 transition-colors relative z-10">
        Explore <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform"/>
      </div>
    </Link>
  );
}
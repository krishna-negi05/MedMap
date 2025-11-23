'use client';
import Link from 'next/link';
import { ArrowRight, Brain, Stethoscope, Layers, Map as MapIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50 via-white to-slate-50 p-6 text-center pb-24">
      <div className="max-w-5xl w-full">
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-teal-100 shadow-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">v1.0 Edition</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            MedMap <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">Aid</span>
          </h1>

          {/* Fixed: split into two sibling paragraphs (no nested <p>) */}
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-4">
            The intelligent study companion for Medical students.
          </p>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Visualize concepts, practice clinical reasoning, and master your exams with AI.
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/mindmap" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2 active:scale-95">
              Start Studying <ArrowRight size={20}/>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100">
          <Link href="/mindmap" className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden text-left h-64 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform relative z-10"><Brain className="w-7 h-7 text-purple-600" /></div>
            <div className="relative z-10"><h3 className="font-bold text-xl mb-2 text-slate-900">AI Mindmaps</h3><p className="text-sm text-slate-500 leading-relaxed">Turn complex textbooks into clean, high-yield knowledge graphs.</p></div>
          </Link>

          <Link href="/cases" className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden text-left h-64 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="bg-teal-100 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform relative z-10"><Stethoscope className="w-7 h-7 text-teal-600" /></div>
            <div className="relative z-10"><h3 className="font-bold text-xl mb-2 text-slate-900">Clinical Cases</h3><p className="text-sm text-slate-500 leading-relaxed">Practice diagnosis on infinite generated patient scenarios.</p></div>
          </Link>

          <Link href="/tools" className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden text-left h-64 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform relative z-10"><Layers className="w-7 h-7 text-blue-600" /></div>
            <div className="relative z-10"><h3 className="font-bold text-xl mb-2 text-slate-900">Med Toolkit</h3><p className="text-sm text-slate-500 leading-relaxed">Flashcards, Drug Interactions, Lab Interpreter, and Viva.</p></div>
          </Link>

          <Link href="/roadmap" className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden text-left h-64 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="bg-amber-100 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform relative z-10"><MapIcon className="w-7 h-7 text-amber-600" /></div>
            <div className="relative z-10"><h3 className="font-bold text-xl mb-2 text-slate-900">Study Plan</h3><p className="text-sm text-slate-500 leading-relaxed">Track your progress through MBBS subjects weekly.</p></div>
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Syringe, HeartPulse, Stethoscope, Scissors } from 'lucide-react';

export default function SkillsPage() {
  const [skill, setSkill] = useState('iv');
  const [message, setMessage] = useState('Select a skill to practice.');

  const handleVeinClick = (veinId) => {
    if (veinId === 'median') setMessage("✅ Correct! The Median Cubital Vein is stable.");
    else if (veinId === 'basilic') setMessage("⚠️ Caution: Basilic vein is viable but risky.");
    else setMessage("❌ Avoid: This vein is too small/tortuous.");
  };

  const skills = [
    { id: 'iv', label: 'IV Cannulation', icon: Syringe, color: 'teal' },
    { id: 'cpr', label: 'CPR Training', icon: HeartPulse, color: 'red' },
    { id: 'lungs', label: 'Auscultation', icon: Stethoscope, color: 'blue' },
    { id: 'suture', label: 'Suturing Basics', icon: Scissors, color: 'orange' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Skill Lab Simulator</h2>
        <p className="text-slate-500">Master clinical procedures in a virtual environment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {skills.map(s => {
          const Icon = s.icon;
          const isActive = skill === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSkill(s.id)}
              className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${isActive ? `shadow-md ring-1 bg-slate-50 border-slate-300` : 'bg-white border-slate-100 hover:shadow-sm'}`}
            >
              <div className={`p-3 rounded-full ${isActive ? 'bg-slate-200 text-slate-900' : 'bg-slate-100 text-slate-500'}`}><Icon size={24} /></div>
              <span className="font-bold text-slate-700">{s.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
         {skill === 'iv' && (
             <div className="text-center w-full">
                 <h3 className="font-bold text-xl mb-4">IV Cannulation Site Selection</h3>
                 <div className="relative w-[280px] h-[400px] mx-auto bg-orange-50 rounded-2xl border-2 border-orange-100 shadow-inner overflow-hidden cursor-crosshair">
                     <svg viewBox="0 0 300 500" className="w-full h-full">
                        <path d="M50,0 L60,500 L240,500 L250,0 Z" fill="#fce4ec" />
                        <path d="M75,500 Q65,300 75,100" fill="none" stroke="#60a5fa" strokeWidth="8" onClick={()=>handleVeinClick('cephalic')} className="hover:stroke-teal-400 transition-colors cursor-pointer"/>
                        <path d="M225,500 Q235,300 225,100" fill="none" stroke="#60a5fa" strokeWidth="8" onClick={()=>handleVeinClick('basilic')} className="hover:stroke-teal-400 transition-colors cursor-pointer"/>
                        <path d="M75,350 L225,250" fill="none" stroke="#60a5fa" strokeWidth="10" onClick={()=>handleVeinClick('median')} className="hover:stroke-teal-400 transition-colors cursor-pointer"/>
                     </svg>
                 </div>
                 <div className="mt-6 p-3 bg-slate-50 rounded-xl font-medium text-slate-700 inline-block">{message}</div>
             </div>
         )}
         {skill === 'cpr' && (
             <div className="text-center">
                 <h3 className="font-bold text-xl mb-6">CPR Rhythm Trainer</h3>
                 <div className="w-48 h-48 bg-red-50 rounded-full flex items-center justify-center border-4 border-red-100 animate-pulse cursor-pointer active:scale-95 transition-transform shadow-inner">
                     <HeartPulse size={80} className="text-red-500"/>
                 </div>
                 <p className="mt-6 text-slate-500">Tap at 100-120 BPM to maintain perfusion.</p>
             </div>
         )}
         {skill === 'lungs' && (
             <div className="text-center">
                 <h3 className="font-bold text-xl mb-4">Chest Auscultation</h3>
                 <div className="relative w-[300px] h-[350px] mx-auto bg-slate-50 rounded-2xl border border-slate-200">
                     <div className="absolute top-10 left-10 w-10 h-10 bg-blue-500/20 rounded-full animate-ping"></div>
                     <Stethoscope size={64} className="absolute inset-0 m-auto text-slate-300 opacity-20"/>
                     <p className="absolute bottom-4 w-full text-center text-sm text-slate-400">Tap zones to hear breath sounds (Mock)</p>
                 </div>
             </div>
         )}
         {skill === 'suture' && (
            <div className="text-center">
                <h3 className="font-bold text-xl mb-4">Suturing Basics</h3>
                <div className="w-[300px] h-[150px] bg-rose-100 rounded-xl border-2 border-rose-200 flex items-center justify-center relative mx-auto">
                    <div className="w-[200px] h-[4px] bg-red-800 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <Scissors size={32} className="text-slate-600"/>
                    </div>
                </div>
                <p className="mt-4 text-slate-500">Interactive suturing module coming soon.</p>
            </div>
         )}
      </div>
    </div>
  );
}
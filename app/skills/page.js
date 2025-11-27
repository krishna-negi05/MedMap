'use client';
import { useState, useRef, useEffect } from 'react';
import { 
  Activity, Stethoscope, Microscope, 
  Layers, Bone, Heart, Search, 
  Menu, X, Play, Pause, ZoomIn, 
  Maximize2, ChevronRight, AlertCircle, 
  Eye, Focus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION ---
const MODULES = [
  {
    id: 'cardio',
    title: 'Hemodynamics', // Shortened for mobile
    subtitle: 'Valve Isolation',
    icon: Heart,
    color: 'rose', 
    bg: 'bg-slate-950'
  },
  {
    id: 'anatomy',
    title: 'Anatomy Lab',
    subtitle: 'Virtual Dissection',
    icon: Bone,
    color: 'amber', 
    bg: 'bg-stone-100'
  },
  {
    id: 'pathology',
    title: 'Pathology',
    subtitle: 'H&E Analysis',
    icon: Microscope,
    color: 'fuchsia', 
    bg: 'bg-pink-50'
  }
];

// ------------------------------------------------------------------
// 1. CARDIOLOGY: Advanced Phonocardiogram (Mobile Optimized)
// ------------------------------------------------------------------
const CardioAdvanced = () => {
  const [activeValve, setActiveValve] = useState(null);
  
  const VALVES = [
    { id: 'aortic', label: 'Aortic', loc: { top: '35%', left: '42%' }, wave: 'stenosis', bpm: 72 },
    { id: 'pulmonic', label: 'Pulmonic', loc: { top: '35%', left: '58%' }, wave: 'normal', bpm: 70 },
    { id: 'tricuspid', label: 'Tricuspid', loc: { top: '55%', left: '45%' }, wave: 'regurgitation', bpm: 75 },
    { id: 'mitral', label: 'Mitral', loc: { top: '55%', left: '60%' }, wave: 'normal', bpm: 71 },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full text-slate-200 overflow-y-auto lg:overflow-hidden">
      {/* Visualizer Panel */}
      <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-slate-900 lg:border-r border-b lg:border-b-0 border-slate-700 p-4 lg:p-6 flex flex-col items-center justify-center min-h-[400px]">
        
        {/* The Heart Map */}
        <div className="relative w-full max-w-[300px] aspect-[3/4] opacity-90">
             {/* Abstract Ribcage/Heart Overlay */}
             <div className="absolute inset-0 border-4 border-slate-700/50 rounded-[3rem] flex items-center justify-center">
                 <Heart size={180} className="text-rose-900/40 animate-pulse duration-[2000ms]" strokeWidth={0.5} />
             </div>

             {/* Interactive Valve Nodes */}
             {VALVES.map(v => (
                 <button
                    key={v.id}
                    onClick={() => setActiveValve(v)}
                    className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 active:scale-95 z-20
                    ${activeValve?.id === v.id 
                        ? 'border-rose-400 bg-rose-500/20 shadow-[0_0_20px_rgba(251,113,133,0.5)]' 
                        : 'border-slate-600 bg-slate-800/80'}`}
                    style={{ top: v.loc.top, left: v.loc.left }}
                 >
                    <div className={`w-3 h-3 rounded-full ${activeValve?.id === v.id ? 'bg-rose-400 animate-ping' : 'bg-slate-500'}`}></div>
                 </button>
             ))}
             
             <p className="absolute bottom-4 w-full text-center text-xs font-mono text-slate-500">Tap nodes to auscultate</p>
        </div>
      </div>

      {/* Data Panel */}
      <div className="w-full lg:w-96 bg-slate-950 p-6 flex flex-col border-l border-slate-800">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
             <div>
                <h3 className="text-lg font-bold text-white">Monitor</h3>
                <p className="text-xs text-rose-400 font-mono">LIVE FEED</p>
             </div>
             <Activity className="text-rose-500 animate-pulse" />
          </div>

          {/* Dynamic Waveform Display */}
          <div className="bg-black border border-slate-800 rounded-xl h-32 lg:h-48 mb-6 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_95%,rgba(244,63,94,0.1)_100%)] bg-[length:20px_100%]"></div>
             {/* Grid */}
             <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

             {activeValve ? (
                 <div className="w-full h-full flex items-center">
                    <svg viewBox="0 0 400 100" className="w-full h-full stroke-rose-400 fill-none stroke-2 drop-shadow-lg">
                        <motion.path 
                            d={activeValve.wave === 'normal' 
                                ? "M0,50 Q20,20 40,50 T80,50 T120,50 Q140,80 160,50 T200,50" 
                                : "M0,50 Q10,10 20,90 T40,50 T60,50 Q80,20 100,50 T150,50"} 
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        />
                    </svg>
                 </div>
             ) : (
                 <span className="text-xs font-mono text-slate-600">SELECT SOURCE</span>
             )}
          </div>

          <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                 <span className="text-slate-400">Location</span>
                 <span className="font-bold text-white">{activeValve?.label || '--'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                 <span className="text-slate-400">Heart Rate</span>
                 <span className="font-bold text-rose-400 font-mono">{activeValve ? `${activeValve.bpm} BPM` : '--'}</span>
              </div>
          </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// 2. ANATOMY: Cadaver Dissection (Touch Enabled)
// ------------------------------------------------------------------
const CadaverExplorer = () => {
    const [lensPos, setLensPos] = useState({ x: 150, y: 150 }); // Start center
    const containerRef = useRef(null);
  
    // Unified Handler for Mouse and Touch
    const handleMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Check if it's a touch event or mouse event
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      // Constrain to container
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          setLensPos({ x, y });
      }
    };

    const ORGANS = [
        { id: 'heart', x: '50%', y: '35%', label: 'Myocardium' },
        { id: 'liver', x: '45%', y: '55%', label: 'Hepatic Lobes' },
        { id: 'intestine', x: '50%', y: '70%', label: 'Small Intestine' }
    ];
  
    return (
      <div className="flex flex-col lg:flex-row h-full gap-6 p-2 overflow-y-auto">
        <div 
          ref={containerRef}
          onMouseMove={handleMove}
          onTouchMove={handleMove}
          className="flex-1 bg-stone-200 rounded-3xl relative overflow-hidden border-4 border-stone-300 shadow-inner cursor-crosshair min-h-[450px] touch-none" // touch-none prevents scrolling while dragging
        >
           {/* LAYER 1: SKIN */}
           <div className="absolute inset-0 bg-stone-300 flex items-center justify-center pointer-events-none">
               <div className="w-48 lg:w-64 h-[80%] bg-stone-400/30 rounded-full blur-xl"></div>
               <div className="absolute text-stone-500 font-serif text-2xl lg:text-4xl opacity-20 font-bold tracking-widest rotate-90 lg:rotate-0">EPIDERMIS</div>
           </div>

           {/* LAYER 2: ORGANS (Revealed via ClipPath) */}
           <div 
              className="absolute inset-0 bg-red-950 flex items-center justify-center pointer-events-none"
              style={{ 
                  clipPath: `circle(100px at ${lensPos.x}px ${lensPos.y}px)` 
              }}
           >
               <div className="relative w-full h-full bg-[radial-gradient(circle_at_center,_#7f1d1d_0%,_#450a0a_100%)]">
                   <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
                   
                   {ORGANS.map(organ => (
                       <div key={organ.id} className="absolute flex flex-col items-center gap-2" style={{ left: organ.x, top: organ.y }}>
                           <div className="w-20 h-20 rounded-full bg-red-800/80 blur-md border border-red-500/50"></div>
                           <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm border border-white/20">
                               {organ.label}
                           </span>
                       </div>
                   ))}
               </div>
           </div>

           {/* Lens UI */}
           <div 
             className="absolute w-[200px] h-[200px] rounded-full border-4 border-white/30 shadow-2xl pointer-events-none z-50 flex items-center justify-center"
             style={{ left: lensPos.x, top: lensPos.y, transform: 'translate(-50%, -50%)' }}
           >
               <div className="w-full h-px bg-white/20 absolute"></div>
               <div className="h-full w-px bg-white/20 absolute"></div>
               <div className="absolute -top-6 text-[10px] text-stone-500 font-bold bg-white/80 px-2 py-1 rounded">DRAG TO DISSECT</div>
           </div>
        </div>
  
        {/* Mobile Info Panel */}
        <div className="w-full lg:w-72 flex flex-col justify-center gap-4 pb-4">
           <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xl">
              <h3 className="text-xl font-bold text-stone-800 mb-2 font-serif flex items-center gap-2">
                  <Bone size={20}/> Deep Dissection
              </h3>
              <p className="text-sm text-stone-500 mb-4 leading-relaxed">
                Drag the lens over the cavity to reveal deep structures.
              </p>
              
              <div className="bg-stone-100 p-3 rounded-lg border border-stone-200">
                  <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white text-stone-600 text-[10px] font-bold rounded border border-stone-200">Muscular</span>
                      <span className="px-2 py-1 bg-white text-stone-600 text-[10px] font-bold rounded border border-stone-200">Digestive</span>
                  </div>
              </div>
           </div>
        </div>
      </div>
    );
};

// ------------------------------------------------------------------
// 3. PATHOLOGY: Digital Microscope (Mobile Responsive)
// ------------------------------------------------------------------
const PathologyScope = () => {
    const [focus, setFocus] = useState(50); 
    const [zoom, setZoom] = useState(1); 

    const blurAmount = Math.abs(focus - 50) / 5;

    return (
        <div className="flex flex-col lg:flex-row h-full gap-4 overflow-y-auto">
            {/* Microscope Viewport */}
            <div className="w-full aspect-square lg:flex-1 max-h-[500px] bg-black rounded-[2rem] lg:rounded-full mx-auto relative overflow-hidden border-[8px] lg:border-[16px] border-slate-800 shadow-2xl flex-shrink-0">
                <div 
                    className="absolute inset-0 bg-pink-100 cursor-move"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 20% 30%, rgba(200, 50, 200, 0.4) 0%, transparent 20%), 
                            radial-gradient(circle at 70% 60%, rgba(150, 0, 150, 0.5) 0%, transparent 30%),
                            repeating-linear-gradient(45deg, rgba(255,0,0,0.05) 0px, rgba(255,0,0,0.05) 2px, transparent 2px, transparent 10px)
                        `,
                        backgroundSize: '200% 200%',
                        filter: `blur(${blurAmount}px)`,
                        transform: `scale(${zoom})`,
                        transition: 'transform 0.2s ease-out, filter 0.2s ease-out'
                    }}
                >
                    {/* Cells */}
                    <div className="absolute top-[30%] left-[40%] w-12 h-12 bg-purple-800/40 rounded-full blur-[1px]"></div>
                    <div className="absolute top-[32%] left-[42%] w-4 h-4 bg-purple-900 rounded-full"></div> 
                    <div className="absolute bottom-[20%] left-[20%] w-20 h-20 bg-purple-900/60 rounded-[30%_70%_70%_30%] animate-pulse"></div>
                </div>

                {/* Eyepiece Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-30 bg-[size:50px_50px] bg-[linear-gradient(rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.5)_1px,transparent_1px)]"></div>
                <div className="absolute inset-0 pointer-events-none border-[20px] lg:border-[50px] border-black/20 rounded-[2rem] lg:rounded-full"></div>
            </div>

            {/* Controls */}
            <div className="w-full lg:w-64 bg-slate-50 lg:border-l border-slate-200 p-6 flex flex-col justify-center gap-6 lg:gap-8 rounded-t-3xl lg:rounded-none shadow-top lg:shadow-none">
                <div>
                    <h3 className="text-slate-800 font-bold flex items-center gap-2 mb-2 text-sm"><Focus size={16}/> Coarse Focus</h3>
                    <input 
                        type="range" min="0" max="100" 
                        value={focus} 
                        onChange={(e) => setFocus(parseInt(e.target.value))}
                        className="w-full accent-fuchsia-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div>
                    <h3 className="text-slate-800 font-bold flex items-center gap-2 mb-2 text-sm"><ZoomIn size={16}/> Objective Zoom</h3>
                    <div className="flex gap-2">
                        {[1, 2, 4].map(z => (
                            <button 
                                key={z}
                                onClick={() => setZoom(z)}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${zoom === z ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-fuchsia-50'}`}
                            >
                                {z * 10}x
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-pink-100 p-4 rounded-xl border border-pink-200">
                    <div className="text-xs font-bold text-pink-700 uppercase mb-1">Slide #4092</div>
                    <p className="text-xs text-pink-600 mt-1">Task: Identify Reed-Sternberg cells.</p>
                </div>
            </div>
        </div>
    );
};

// ------------------------------------------------------------------
// MAIN LAYOUT
// ------------------------------------------------------------------
export default function ClinicalSkillsLab() {
  const [activeModuleId, setActiveModuleId] = useState(null);
  const activeModule = MODULES.find(m => m.id === activeModuleId);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-slate-100 overflow-hidden font-sans">
      
      {/* 1. RESPONSIVE NAVIGATION */}
      {/* Desktop: Sidebar | Mobile: Top Scroll Bar */}
      <div className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col z-20 shadow-md lg:shadow-xl flex-shrink-0">
         {/* Brand Header (Hidden on small mobile if active module to save space? kept for now) */}
         <div className="p-4 lg:p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
                <h2 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="text-indigo-600" size={20}/> MedLab<span className="text-slate-400 font-light">OS</span>
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider hidden lg:block">Simulation Suite v3.0</p>
            </div>
         </div>

         {/* Nav List */}
         <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto p-2 lg:p-4 gap-2 lg:gap-3 hide-scrollbar">
            {MODULES.map((module) => {
               const Icon = module.icon;
               const isActive = activeModuleId === module.id;
               return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModuleId(module.id)}
                    className={`flex-shrink-0 lg:w-full text-left p-3 lg:p-4 rounded-xl transition-all duration-300 border relative overflow-hidden flex items-center lg:items-start gap-3 lg:block
                      ${isActive 
                        ? `${module.bg} border-transparent shadow-lg scale-[0.98] lg:scale-[1.02]` 
                        : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                      }`}
                  >
                     <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20 text-current' : `bg-slate-50 text-${module.color}-500`}`}>
                        <Icon size={20} />
                     </div>
                     <div className="relative z-10">
                        <h3 className={`font-bold text-sm whitespace-nowrap ${isActive ? 'text-current' : 'text-slate-800'}`}>{module.title}</h3>
                        <p className={`text-xs mt-0.5 hidden lg:block ${isActive ? 'opacity-80' : 'text-slate-400'}`}>{module.subtitle}</p>
                     </div>
                  </button>
               )
            })}
         </div>
      </div>

      {/* 2. MAIN STAGE */}
      <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
         {activeModule ? (
             <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
                {/* Mobile Header Overlay */}
                <div className="flex justify-between items-center p-4 bg-white border-b border-slate-200 lg:hidden">
                   <h1 className="text-sm font-bold text-slate-900">{activeModule.title}</h1>
                   <button onClick={() => setActiveModuleId(null)} className="p-1 bg-slate-100 rounded-full"><X size={18}/></button>
                </div>

                {/* Desktop Header */}
                <header className="hidden lg:flex justify-between items-center mb-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm m-6 mb-0">
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${activeModule.color}-100 text-${activeModule.color}-600`}>
                          <activeModule.icon size={20} />
                      </div>
                      <div>
                          <h1 className="text-lg font-bold text-slate-900 leading-none">{activeModule.title}</h1>
                          <span className="text-[10px] font-mono text-slate-400">ACTIVE SESSION</span>
                      </div>
                   </div>
                   <button onClick={() => setActiveModuleId(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={20}/></button>
                </header>

                {/* Workspace Container */}
                <div className="flex-1 lg:p-6 p-2 overflow-hidden">
                    <div className="w-full h-full bg-white lg:rounded-[2rem] rounded-xl shadow-xl border border-slate-200 overflow-hidden relative">
                        {activeModuleId === 'cardio' && <CardioAdvanced />}
                        {activeModuleId === 'anatomy' && <CadaverExplorer />}
                        {activeModuleId === 'pathology' && <PathologyScope />}
                    </div>
                </div>
             </div>
         ) : (
            /* Dashboard Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
               <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl mb-6 rotate-3 border border-slate-100">
                  <Activity size={40} className="text-indigo-600"/>
               </div>
               <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-3 tracking-tight">Select Simulation</h2>
               <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium text-sm lg:text-base">
                  Launch a high-fidelity virtual module from the menu to practice diagnostic skills.
               </p>
            </div>
         )}
      </div>
    </div>
  );
}
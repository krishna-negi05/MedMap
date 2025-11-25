'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Syringe, HeartPulse, Stethoscope, Scissors, 
  CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, 
  Square, Droplets, Move
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA: Clinical Procedures ---
const PROCEDURES = {
  iv: {
    title: "Peripheral IV Cannulation",
    icon: Syringe,
    color: "teal",
    steps: [
      { id: 'prep', label: "Aseptic Prep", instruction: "Tap the sterile swab to clean the site in a concentric motion." },
      { id: 'tourniquet', label: "Apply Tourniquet", instruction: "Drag the tourniquet band onto the upper arm." },
      { id: 'insert', label: "Venipuncture", instruction: "Drag the needle to the target vein at the correct angle (15-30°)." },
      { id: 'flash', label: "Flashback Check", instruction: "Blood return observed. Advance catheter slightly." },
      { id: 'secure', label: "Secure Line", instruction: "Connect tubing and apply dressing." }
    ]
  },
  cpr: {
    title: "CPR Training",
    icon: HeartPulse,
    color: "rose",
    steps: [] // Handled by Custom Simulator
  },
  suture: {
    title: "Interrupted Suture",
    icon: Scissors,
    color: "indigo",
    steps: [
      { id: 'load', label: "Load Needle", instruction: "Tap the needle holder to grasp the needle at 2/3 distance." },
      { id: 'pierce', label: "Tissue Entry", instruction: "Click the skin mark to pierce the wound edge at 90°." },
      { id: 'throw', label: "Throw Knot", instruction: "Loop the thread twice (Surgeon's knot) and pull tight." },
      { id: 'cut', label: "Cut Suture", instruction: "Drag scissors to the suture tails to cut." }
    ]
  }
};

// --- SUB-COMPONENT: CPR Simulator (Metronome Game) ---
const CPRSimulator = () => {
  const [active, setActive] = useState(false);
  const [bpm, setBpm] = useState(0);
  const [feedback, setFeedback] = useState("Tap to Compress");
  const lastTap = useRef(0);

  const handleCompress = () => {
    const now = Date.now();
    if (!active) setActive(true);
    
    if (lastTap.current) {
      const diff = now - lastTap.current;
      const currentBpm = Math.round(60000 / diff);
      setBpm(currentBpm);

      if (currentBpm < 100) setFeedback("PUSH FASTER! ⚡");
      else if (currentBpm > 120) setFeedback("TOO FAST! 🐢");
      else setFeedback("PERFECT RHYTHM! ✅");
    }
    lastTap.current = now;
  };

  // Reset if inactive
  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() - lastTap.current > 2000 && active) {
        setBpm(0);
        setActive(false);
        setFeedback("COMPRESSIONS LOST 💀");
      }
    }, 500);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
        <div className={`w-48 h-48 rounded-full border-8 flex items-center justify-center transition-all duration-100 mb-8 ${bpm >= 100 && bpm <= 120 ? 'border-green-500 bg-green-50 scale-110' : 'border-slate-200'}`}>
            <div className="text-center">
                <div className="text-5xl font-black text-slate-800">{bpm}</div>
                <div className="text-xs font-bold text-slate-400">BPM</div>
            </div>
        </div>
        <button 
            onMouseDown={handleCompress}
            className="bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all text-white w-64 py-6 rounded-2xl text-xl font-black shadow-xl shadow-rose-200 flex items-center justify-center gap-2"
        >
            <HeartPulse className={active ? 'animate-ping' : ''}/> COMPRESS
        </button>
        <p className="mt-6 font-bold text-slate-500 animate-pulse">{feedback}</p>
    </div>
  );
};

// --- SUB-COMPONENT: Procedure Engine (IV & Suture) ---
const ProcedureEngine = ({ skillKey, onComplete, onExit }) => {
  const procedure = PROCEDURES[skillKey];
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState(null);
  
  // Interaction States
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [completedActions, setCompletedActions] = useState({});

  const currentStepData = procedure.steps[step];

  const handleNext = () => {
    setFeedback({ success: true, msg: "Step Complete!" });
    setTimeout(() => {
        setFeedback(null);
        if (step < procedure.steps.length - 1) {
            setStep(s => s + 1);
            setDragPosition({ x: 0, y: 0 }); // Reset drag
        } else {
            onComplete();
        }
    }, 1000);
  };

  // --- SIMULATION LOGIC ---
  
  // 1. IV SIMULATION
  const renderIVSim = () => {
    const stepId = currentStepData.id;

    if (stepId === 'prep') {
        return (
            <div className="relative w-64 h-64 bg-orange-100 rounded-full mx-auto border-4 border-orange-200 overflow-hidden cursor-crosshair" onClick={handleNext}>
                <div className="absolute inset-0 flex items-center justify-center opacity-20 text-orange-300 font-bold text-4xl">SKIN</div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-64 bg-blue-200/50 rotate-45 blur-sm"></div>
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-10 right-10 bg-white p-2 rounded-full shadow-lg cursor-pointer animate-bounce"
                >
                    <Droplets className="text-teal-500"/>
                </motion.div>
                <p className="absolute bottom-4 w-full text-center text-xs font-bold text-slate-500">Click sterile swab to clean</p>
            </div>
        );
    }
    if (stepId === 'tourniquet') {
        return (
            <div className="relative w-full h-48 bg-orange-50 rounded-xl border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                <div className="w-32 h-full bg-orange-200 flex flex-col items-center justify-center relative">
                    <span className="text-orange-400 font-bold rotate-90 absolute">UPPER ARM</span>
                    {/* Drop Zone */}
                    <div className="w-full h-4 border-2 border-dashed border-slate-400 bg-slate-100/50 absolute top-10"></div>
                </div>
                {/* Draggable Band */}
                <motion.div 
                    drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, info) => { if(info.offset.x < -50) handleNext(); }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 w-12 h-64 bg-blue-600 cursor-grab active:cursor-grabbing rounded shadow-xl flex items-center justify-center text-white font-bold writing-vertical"
                >
                    <Move size={16} className="mb-2"/> DRAG ME
                </motion.div>
            </div>
        );
    }
    if (stepId === 'insert') {
        return (
            <div className="relative w-full h-64 bg-orange-50 rounded-xl border-2 border-slate-200 overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-8 bg-blue-200/50 blur-sm -rotate-3 transform origin-left"></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                
                <motion.div 
                    drag 
                    onDragEnd={(e, info) => { if(info.point.y > 100) handleNext(); }}
                    className="absolute top-10 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
                >
                    <Syringe size={64} className="text-slate-600 rotate-[135deg] drop-shadow-xl"/>
                </motion.div>
                <p className="absolute bottom-2 w-full text-center text-xs text-slate-400">Drag syringe to vein target</p>
            </div>
        );
    }
    return <button onClick={handleNext} className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold">Perform Action</button>;
  };

  // 2. SUTURE SIMULATION
  const renderSutureSim = () => {
    const stepId = currentStepData.id;

    if (stepId === 'load') {
        return (
            <div className="flex items-center justify-center h-64 gap-8">
                <div className="w-2 h-32 bg-slate-300 rounded-full relative">
                    <div className="absolute -left-2 top-0 w-6 h-6 border-2 border-slate-400 rounded-full"></div> {/* Needle eye */}
                </div>
                <motion.button 
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={handleNext}
                    className="p-4 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                >
                    <Scissors className="text-slate-400 group-hover:text-indigo-600" size={32} />
                    <span className="text-xs font-bold block mt-2 text-slate-500">Click to Grasp</span>
                </motion.button>
            </div>
        );
    }
    if (stepId === 'pierce') {
        return (
            <div className="relative w-full h-64 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-center cursor-crosshair" onClick={handleNext}>
                {/* Wound */}
                <div className="w-64 h-2 bg-red-800 rounded-full relative overflow-visible">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-dashed border-indigo-500 rounded-full animate-ping"></div>
                </div>
                <p className="absolute bottom-4 text-xs font-bold text-rose-400">Click target to insert needle</p>
            </div>
        );
    }
    if (stepId === 'throw') {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <motion.div 
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-32 h-32 border-4 border-indigo-200 border-t-indigo-600 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={handleNext}
                >
                    <span className="font-bold text-indigo-600">CLICK TO TIE</span>
                </motion.div>
            </div>
        );
    }
    return <button onClick={handleNext} className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold">Complete Step</button>;
  };

  return (
    <div className="flex gap-6 h-full">
        {/* Left: Guide */}
        <div className="w-1/3 bg-white border border-slate-200 p-6 rounded-3xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${((step + 1) / procedure.steps.length) * 100}%` }}></div>
            </div>
            
            <div className="mt-4 mb-auto">
                <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2">{currentStepData.label}</h3>
                <p className="text-slate-500 font-medium">{currentStepData.instruction}</p>
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-400">
                <p className="font-bold uppercase mb-1">Tip:</p>
                Follow the visual cues on the right panel.
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence>
                {feedback && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-10"
                    >
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <CheckCircle2 size={32}/>
                        </div>
                        <h4 className="text-xl font-bold text-slate-800">{feedback.msg}</h4>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Right: Interactive Sim */}
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-center relative shadow-inner">
            {skillKey === 'iv' && renderIVSim()}
            {skillKey === 'suture' && renderSutureSim()}
        </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function SkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState(null);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 h-[calc(100vh-64px)]">
      {!selectedSkill ? (
        <div className="flex flex-col h-full">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Clinical Skills Lab</h2>
                <p className="text-slate-500">Select a module to begin interactive training.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(PROCEDURES).map(([key, skill]) => {
                    const Icon = skill.icon;
                    return (
                        <button 
                            key={key} 
                            onClick={() => setSelectedSkill(key)}
                            className="group relative bg-white border border-slate-200 p-8 rounded-[2.5rem] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden flex flex-col items-start h-64 justify-between"
                        >
                            <div className={`absolute top-0 right-0 w-40 h-40 bg-${skill.color}-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 z-0`}></div>
                            <div className={`relative z-10 w-14 h-14 rounded-2xl bg-${skill.color}-100 flex items-center justify-center text-${skill.color}-600 shadow-sm group-hover:scale-110 transition-transform`}>
                                <Icon size={28} />
                            </div>
                            <div className="relative z-10 mt-4">
                                <h3 className="font-bold text-xl text-slate-900 mb-1">{skill.title}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {key === 'cpr' ? 'Rhythm Trainer' : `${PROCEDURES[key].steps.length} Steps`}
                                </p>
                            </div>
                            <div className="relative z-10 w-full flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
                                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-800 transition-colors">Start Module</span>
                                <div className="bg-slate-50 p-2 rounded-full group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                    <ArrowRight size={16}/>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
            <button onClick={() => setSelectedSkill(null)} className="self-start mb-4 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors px-4 py-2 rounded-xl hover:bg-white">
                <ArrowRight className="rotate-180" size={16}/> Back to Lab
            </button>
            
            <div className="flex-1 bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden p-2">
                {selectedSkill === 'cpr' ? (
                    <CPRSimulator />
                ) : (
                    // 🧠 CRASH FIX: key={selectedSkill} ensures fresh mount on change
                    <ProcedureEngine 
                        key={selectedSkill} 
                        skillKey={selectedSkill} 
                        onComplete={() => alert('Procedure Mastered!')}
                        onExit={() => setSelectedSkill(null)}
                    />
                )}
            </div>
        </div>
      )}
    </div>
  );
}
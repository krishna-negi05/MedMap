'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Activity, CheckCircle2, AlertTriangle, ArrowRight, Save, FolderOpen, Clock, Trash2, X, Loader2, FileText, HeartPulse, Wind, Droplets } from 'lucide-react';
import { callGemini } from '../../lib/gemini';
import { FEATURE_MODELS } from '../../lib/ai-config'; 

// --- 1. Schema for Patient Profile ---
const VIGNETTE_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    difficulty: { type: "STRING" },
    vignette: {
      type: "OBJECT",
      properties: {
        intro: { type: "STRING" },
        vitals: {
          type: "OBJECT",
          properties: {
            BP: { type: "STRING" },
            HR: { type: "STRING" },
            RR: { type: "STRING" },
            SpO2: { type: "STRING" },
            Temp: { type: "STRING" }
          }
        },
        history: { type: "STRING" }
      }
    }
  }
};

// --- 2. Schema for Questions ---
const STEPS_SCHEMA = {
  type: "OBJECT",
  properties: {
    steps: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "INTEGER" },
          question: { type: "STRING" },
          options: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                text: { type: "STRING" },
                feedback: { type: "STRING" },
                correct: { type: "BOOLEAN" }
              }
            }
          }
        }
      }
    }
  }
};

const MOCK_CASE = { 
  title: "Acute Chest Pain", 
  difficulty: "Intermediate", 
  vignette: { 
    intro: "A 55-year-old male presents with crushing chest pain radiating to the left arm and jaw.", 
    vitals: { BP: "150/90", HR: "110", RR: "22", SpO2: "94%", Temp: "37.2°C" }, 
    history: "HTN, Smoker (20 pack-years), Hyperlipidemia." 
  }, 
  steps: [] 
};

export default function CasesPage() {
  const [caseData, setCaseData] = useState(MOCK_CASE);
  const [stepIndex, setStepIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(''); 
  const [defaultDiff, setDefaultDiff] = useState('Intermediate');
  
  const [savedCases, setSavedCases] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchSavedCases();
    fetchUserSettings();
  }, []);
  
  const fetchSavedCases = async () => {
    try {
      const res = await fetch('/api/cases');
      const json = await res.json();
      if(json.ok) setSavedCases(json.data);
    } catch(e) { console.error(e); }
  };
  
  const fetchUserSettings = async () => {
    try {
        const res = await fetch('/api/auth/session');
        const json = await res.json();
        if(json.ok && json.user?.defaultDifficulty) {
            setDefaultDiff(json.user.defaultDifficulty);
        }
    } catch(e) {}
  };

  const handleGenerate = async () => {
    setLoading(true);
    setFeedback(null);
    try { 
        // 1. Generate Patient
        setLoadingStep('Generating Patient Profile...');
        const vignettePrompt = `Generate a realistic clinical patient vignette for a medical emergency. Difficulty: ${defaultDiff}. Include BP, HR, RR, SpO2, Temp. Output strictly JSON.`;
        
        const vignetteData = await callGemini(
            vignettePrompt, 
            VIGNETTE_SCHEMA, 
            FEATURE_MODELS.caseVignette 
        );

        if (!vignetteData?.vignette?.intro) throw new Error("Failed to generate vignette.");

        // 2. Generate Questions
        setLoadingStep('Developing Clinical Logic...');
        const questionsPrompt = `
          Patient: "${vignetteData.vignette.intro}"
          Vitals: ${JSON.stringify(vignetteData.vignette.vitals)}
          History: ${vignetteData.vignette.history}
          
          Generate 3 critical, high-yield decision-making questions for a medical student. 
          Include tricky distractors and detailed explanations. Output strictly JSON.
        `;

        // We use the same model logic here as defined in config (likely DeepSeek for both)
        const stepsData = await callGemini(questionsPrompt, STEPS_SCHEMA, FEATURE_MODELS.caseQuestions);

        if (!stepsData?.steps) throw new Error("Failed to generate questions.");

        setCaseData({ ...vignetteData, steps: stepsData.steps }); 
        setStarted(false); 
        setStepIndex(0); 
        setShowHistory(false);

    } catch(e) {
        console.error("Generation failed", e);
        alert("AI Generation failed. Please try again.");
    }
    setLoading(false);
    setLoadingStep('');
  };

  const handleSave = async () => {
    try {
      await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: caseData.title, difficulty: caseData.difficulty, data: caseData })
      });
      fetchSavedCases();
    } catch(e) { alert('Save failed'); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/cases?id=${deleteId}`, { method: 'DELETE' });
    fetchSavedCases();
    setDeleteId(null);
  };

  const loadCase = (saved) => {
    setCaseData(saved.data);
    setStarted(false);
    setStepIndex(0);
    setFeedback(null);
    setShowHistory(false);
  };

  const handleNext = () => {
    if (stepIndex < caseData.steps.length - 1) {
        setStepIndex(stepIndex + 1);
        setFeedback(null);
    } else {
        alert('Case Complete! Great job.');
    }
  };

  // --- Components for New UI ---
  const VitalsDisplay = ({ vitals }) => (
    <div className="bg-slate-900 rounded-xl p-4 text-teal-400 font-mono text-sm grid grid-cols-2 gap-4 shadow-inner border border-slate-700 relative overflow-hidden">
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/5 to-transparent opacity-20 pointer-events-none animate-[scan_2s_linear_infinite]"></div>
      
      <div className="flex flex-col"><span className="text-slate-500 text-[10px] uppercase tracking-wider">Heart Rate</span><div className="flex items-center gap-2"><HeartPulse size={16} className="animate-pulse text-red-500"/> <span className="text-xl">{vitals.HR || '--'}</span> <span className="text-xs">bpm</span></div></div>
      <div className="flex flex-col"><span className="text-slate-500 text-[10px] uppercase tracking-wider">BP</span><div className="flex items-center gap-2"><Activity size={16}/> <span className="text-xl">{vitals.BP || '--'}</span> <span className="text-xs">mmHg</span></div></div>
      <div className="flex flex-col"><span className="text-slate-500 text-[10px] uppercase tracking-wider">SpO2</span><div className="flex items-center gap-2"><Droplets size={16} className="text-blue-400"/> <span className="text-xl">{vitals.SpO2 || '--'}</span></div></div>
      <div className="flex flex-col"><span className="text-slate-500 text-[10px] uppercase tracking-wider">Resp. Rate</span><div className="flex items-center gap-2"><Wind size={16}/> <span className="text-xl">{vitals.RR || '--'}</span> <span className="text-xs">/min</span></div></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 relative">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
            <h2 className="text-3xl font-bold text-slate-900">Clinical Cases</h2>
            <p className="text-slate-500">Interactive patient scenarios generated by AI.</p>
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => setShowHistory(!showHistory)} className="flex-1 md:flex-none bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center justify-center gap-2 transition-all shadow-sm">
                <FolderOpen size={16} className="text-slate-500"/> {showHistory ? 'Close' : 'Library'}
            </button>
            <button onClick={handleGenerate} disabled={loading} className="flex-[2] md:flex-none bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95">
                {loading ? <Loader2 className="animate-spin w-4 h-4"/> : <><Sparkles size={16} className="text-teal-300"/> New Case</>}
            </button>
         </div>
       </div>

       {/* History Panel */}
       {showHistory && (
         <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-700 flex items-center gap-2"><Clock size={16}/> Case History</h3>
                <button onClick={()=>setShowHistory(false)} className="p-1 hover:bg-slate-100 rounded-full"><X size={18} className="text-slate-400"/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
                {savedCases.length === 0 && <p className="text-slate-400 text-sm p-2">No saved cases found.</p>}
                {savedCases.map(c => (
                    <div key={c.id} onClick={() => loadCase(c)} className="p-4 rounded-xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/50 cursor-pointer transition-all flex justify-between items-center group bg-slate-50/50">
                        <div>
                            <div className="font-bold text-sm text-slate-800 line-clamp-1">{c.title}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-1 flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${c.difficulty === 'Advanced' ? 'bg-red-400' : c.difficulty === 'Intermediate' ? 'bg-amber-400' : 'bg-green-400'}`}></span>
                                {c.difficulty} • {new Date(c.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <button onClick={(e) => {e.stopPropagation(); setDeleteId(c.id)}} className="p-2 text-slate-300 hover:text-red-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100 shadow-sm"><Trash2 size={14}/></button>
                    </div>
                ))}
            </div>
         </div>
       )}

       {loading && (
         <div className="mb-8 p-6 bg-white border border-slate-200 shadow-lg rounded-2xl flex flex-col items-center justify-center gap-4 animate-pulse">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100"></div>
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
                <Activity size={20} className="text-teal-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
            </div>
            <span className="font-bold text-slate-600">{loadingStep}</span>
         </div>
       )}

       {!started ? (
         <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200 grid md:grid-cols-2 relative group min-h-[400px]">
            {caseData !== MOCK_CASE && (
                <button onClick={handleSave} className="group absolute top-6 right-6 z-20 p-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full text-white hover:bg-white hover:text-teal-600 transition-all flex items-center overflow-hidden shadow-lg" title="Save Case">
                    <Save size={20}/>
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap opacity-0 group-hover:opacity-100 ml-0 group-hover:ml-2 font-bold text-sm pr-0 group-hover:pr-2">Save Case</span>
                </button>
            )}
            <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-50 relative">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-extrabold uppercase tracking-wider w-fit mb-4 border border-teal-200">{caseData.difficulty} Case</div>
               <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">{caseData.title}</h2>
               <p className="text-slate-600 text-lg mb-10 leading-relaxed">{caseData.vignette.intro}</p>
               <button onClick={()=>setStarted(true)} className="w-fit bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3 hover:gap-4">Start Rounds <ArrowRight/></button>
            </div>
            <div className="bg-slate-900 p-12 text-slate-300 flex flex-col justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
               <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-teal-500 rounded-full blur-[120px] opacity-20"></div>
               <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-20"></div>
               <div className="relative z-10 bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <Activity className="text-teal-400 h-8 w-8"/>
                        <div className="text-xs font-mono text-teal-200 bg-teal-900/50 px-2 py-1 rounded">Live Vitals</div>
                    </div>
                    <VitalsDisplay vitals={caseData.vignette.vitals || {}} />
               </div>
            </div>
         </div>
       ) : (
         <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Vitals & History Sidebar */}
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg sticky top-24">
                    <h3 className="font-bold mb-6 text-slate-900 flex items-center gap-2 uppercase tracking-wider text-sm"><Activity size={18} className="text-teal-500"/> Patient Vitals</h3>
                    <VitalsDisplay vitals={caseData.vignette.vitals || {}} />
                    
                    {/* Chart-style History */}
                    <div className="mt-6 p-5 bg-[#fdfbf7] rounded-xl border border-[#e6e2d8] shadow-sm relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-amber-200/50"></div>
                        <span className="text-[10px] font-bold text-amber-800/60 uppercase tracking-wider flex items-center gap-2 mb-2"><FileText size={12}/> Patient History</span>
                        <p className="text-sm text-slate-700 font-serif leading-relaxed">{caseData.vignette.history}</p>
                    </div>
                </div>
            </div>

            {/* Questions Area */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-200 min-h-[600px] flex flex-col relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                   <div className="h-full bg-teal-500 transition-all duration-500" style={{width: `${((stepIndex + 1) / caseData.steps.length) * 100}%`}}></div>
               </div>
               
               <div className="mb-8 mt-4">
                   <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wide mb-4">Question {stepIndex+1} of {caseData.steps.length}</span>
                   <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">{caseData.steps[stepIndex]?.question}</h3>
               </div>

               <div className="space-y-4 mb-8 flex-1">
                  {caseData.steps[stepIndex]?.options.map(opt => (
                    <button 
                        key={opt.id} 
                        onClick={()=>setFeedback(opt)} 
                        disabled={!!feedback} 
                        className={`w-full p-6 rounded-2xl text-left border-2 transition-all flex justify-between items-center group
                        ${feedback 
                            ? (feedback.id === opt.id 
                                ? (opt.correct ? 'bg-green-50 border-green-500 text-green-900 shadow-md' : 'bg-red-50 border-red-500 text-red-900 shadow-md')
                                : 'bg-slate-50 border-transparent text-slate-400 opacity-50')
                            : 'bg-white border-slate-100 hover:border-teal-400 hover:shadow-md hover:scale-[1.01]'
                        }`}
                    >
                      <span className="font-medium text-lg">{opt.text}</span>
                      {feedback?.id===opt.id && (feedback.correct ? <CheckCircle2 className="text-green-600 shrink-0"/> : <AlertTriangle className="text-red-500 shrink-0"/>)}
                    </button>
                  ))}
               </div>

               {feedback && (
                 <div className={`p-6 rounded-2xl border-l-4 animate-in fade-in slide-in-from-bottom-4 ${feedback.correct ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                   <div className="font-bold mb-2 flex items-center gap-2">
                       {feedback.correct ? <span className="text-green-700 flex items-center gap-2">Correct <Sparkles size={18}/></span> : <span className="text-red-700">Incorrect</span>}
                   </div>
                   <p className="text-slate-700 leading-relaxed">{feedback.feedback}</p>
                   
                   {/* NEXT BUTTON IS NOW ALWAYS VISIBLE IN FEEDBACK MODE */}
                   <div className="mt-6 flex justify-end">
                       <button 
                            onClick={handleNext} 
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2 shadow-lg shadow-slate-900/20 transition-all hover:scale-105"
                        >
                            {stepIndex < caseData.steps.length - 1 ? 'Next Question' : 'Finish Case'} <ArrowRight size={18}/>
                        </button>
                   </div>
                 </div>
               )}
            </div>
         </div>
       )}

       {deleteId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 w-full max-w-sm scale-100 animate-in zoom-in-95 duration-200">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900">Delete Case?</h3>
                        <p className="text-slate-500 text-sm mt-2 leading-relaxed">This will permanently remove the saved clinical case and your progress.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-3 rounded-xl text-slate-600 font-bold bg-slate-50 hover:bg-slate-100 transition-colors">Cancel</button>
                        <button onClick={confirmDelete} className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200">Delete</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Activity, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Save, FolderOpen, Clock, Trash2, X, Loader2, FileText, HeartPulse, Wind, Droplets, Thermometer, Stethoscope, ClipboardList, Siren, Microscope } from 'lucide-react';
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
        // The full question stem (History + Vitals + Labs all in one text block)
        fullDescription: { type: "STRING" }, 
        vitals: {
          type: "OBJECT",
          properties: {
            BP: { type: "STRING" },
            HR: { type: "STRING" },
            RR: { type: "STRING" },
            SpO2: { type: "STRING" },
            Temp: { type: "STRING" }
          }
        }
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

// --- HIGH YIELD TOPICS (NEET PG) ---
const HIGH_YIELD_TOPICS = [
  "General Medicine: Congestive Heart Failure (Nocturnal cough)",
  "General Medicine: Hyperthyroidism (Weight loss, tremors)",
  "General Medicine: Bronchial Asthma (Breathlessness, wheezing)",
  "Neurology: Myasthenia Gravis (Diplopia, fatigable weakness)",
  "Surgery: Tension Pneumothorax (Absent breath sounds)",
  "Surgery: Perforation Peritonitis (Guarding, rigidity)",
  "Surgery: Inguinal Hernia (Groin swelling)",
  "Pediatrics: Croup (Barking cough, stridor)",
  "Pediatrics: Hirschsprung’s Disease (Delayed meconium)",
  "Microbiology: Anthrax (Ulcer with black eschar)",
  "Pharmacology: Anticholinergic Toxicity (Dry mouth, blurred vision)",
  "Pathology: Multiple Myeloma (Lytic bone lesions)",
  "OBGYN: Placenta Previa (Painless vaginal bleeding)",
  "Ophthalmology: Central Retinal Artery Occlusion (Cherry red spot)",
  "Orthopedics: Perthes Disease (Hip pain, limited abduction)",
  "Biochemistry: Urea Cycle Disorder (High ammonia in neonate)",
  "Physiology: Diabetes Insipidus (Polyuria, dilute urine)"
];

const MOCK_CASE = { 
  title: "ABG Analysis: Metabolic Acidosis", 
  difficulty: "Intermediate", 
  vignette: { 
    fullDescription: "A patient's Arterial Blood Gas (ABG) report shows: pH: 7.22, pCO2: 38 mmHg, HCO3: 16 mEq/L, Na+: 130 mEq/L, Cl-: 84 mEq/L. The patient appears clinically dehydrated with deep, rapid breathing (Kussmaul breathing).", 
    vitals: { BP: "100/60", HR: "110", RR: "28", SpO2: "98%", Temp: "37.0°C" }
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
        const res = await fetch('/api/auth/session', { cache: 'no-store' });
        const json = await res.json();
        if(json.ok && json.user?.defaultDifficulty) {
            setDefaultDiff(json.user.defaultDifficulty);
        }
    } catch(e) { console.error("Failed to fetch settings", e); }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setFeedback(null);
    try { 
        // Pick a random high-yield topic
        const randomTopic = HIGH_YIELD_TOPICS[Math.floor(Math.random() * HIGH_YIELD_TOPICS.length)];

        // 1. Generate NEET PG Style Vignette
        setLoadingStep(`Admitting Patient: ${randomTopic.split(':')[0]}...`);
        
        const vignettePrompt = `
          Act as a NEET PG / INI-CET Exam Setter.
          Generate a High-Yield Clinical Vignette based on: "${randomTopic}".
          Difficulty: ${defaultDiff}.
          
          **FORMAT INSTRUCTIONS:**
          - Provide the **FULL QUESTION STEM** in 'fullDescription'. This must include the entire clinical picture (History, Examination, Investigations) just like a real exam question.
          - Do NOT split information.
          - Include Vitals if relevant (BP, HR, etc).

          Output purely Valid JSON matching this structure:
          {
            "title": "Short Title (e.g. 45M with Hemoptysis)",
            "difficulty": "${defaultDiff}",
            "vignette": {
              "fullDescription": "The complete clinical scenario text...",
              "vitals": { 
                "BP": "120/80", "HR": "80", "RR": "18", "SpO2": "98%", "Temp": "37.2C" 
              }
            }
          }
        `;
        
        const vignetteData = await callGemini(
            vignettePrompt, 
            VIGNETTE_SCHEMA, 
            FEATURE_MODELS.caseVignette 
        );

        if (!vignetteData.vignette && vignetteData.fullDescription) {
            vignetteData.vignette = {
                fullDescription: vignetteData.fullDescription,
                vignetteData: vignetteData.vitals || {}
            };
        }

        if (!vignetteData?.vignette?.fullDescription) throw new Error("Failed to generate vignette structure.");

        // 2. Generate Questions
        setLoadingStep('Ordering Investigations & Questions...');
        
        const questionsPrompt = `
          **Clinical Stem:** "${vignetteData.vignette.fullDescription}"
          
          Generate 5 sequential NEET PG style MCQs based on this stem.
          
          **Question Types:**
          1. Diagnosis (Most likely diagnosis?)
          2. Management (Next best step? / Drug of choice?)
          3. Investigation (Gold standard? / Initial test?)
          4. Pathophysiology (Mechanism of action? / Underlying defect?)
          
          **Style:**
          - 4 Options per question.
          - Explanations must be detailed rule-outs (e.g. "Why Option A is wrong").
          
          Output purely Valid JSON matching the schema.
        `;

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
      alert('Case saved to EMR records.');
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
        setStarted(false);
        setStepIndex(0);
        setFeedback(null);
    }
  };

  // --- UI Components ---
  const PatientMonitor = ({ vitals }) => {
    const hasVitals = vitals && Object.values(vitals).some(v => v && v !== 'N/A' && v !== '--');
    if(!hasVitals) return null;

    return (
      <div className="bg-black border-4 border-slate-800 rounded-lg p-4 shadow-2xl relative overflow-hidden font-mono text-xs md:text-sm">
         {/* Monitor Glare & Scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,6px_100%]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20"></div>
        
        {/* Top Status Bar */}
        <div className="flex justify-between text-slate-500 mb-4 border-b border-slate-800 pb-2">
            <span>BED 04: ADULT</span>
            <span className="animate-pulse text-green-500">● LIVE</span>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-4 relative z-0">
            {vitals.HR && (
                <div className="flex justify-between items-end text-green-500">
                    <div>
                        <div className="text-[10px] text-green-700">ECG / HR</div>
                        <div className="text-4xl md:text-5xl font-bold leading-none tracking-tighter shadow-green-900/50 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">{vitals.HR}</div>
                    </div>
                    <HeartPulse className="animate-pulse mb-2" size={24}/>
                </div>
            )}
            {vitals.SpO2 && (
                <div className="flex justify-between items-end text-cyan-400">
                    <div>
                        <div className="text-[10px] text-cyan-700">SpO2 %</div>
                        <div className="text-4xl md:text-5xl font-bold leading-none tracking-tighter drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">{vitals.SpO2.replace('%','')}</div>
                    </div>
                    <div className="mb-2 text-xs flex flex-col items-end">
                        <Droplets size={20}/>
                        <span>PLETH</span>
                    </div>
                </div>
            )}
            {vitals.BP && (
                <div className="flex justify-between items-end text-amber-500 col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-4">
                    <div>
                        <div className="text-[10px] text-amber-700">NIBP mmHg</div>
                        <div className="text-3xl font-bold leading-none tracking-tight drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">{vitals.BP}</div>
                    </div>
                    <span className="text-xs text-slate-600 mb-2">MANUAL</span>
                </div>
            )}
            <div className="flex flex-col gap-1 justify-end items-end text-slate-400 text-xs col-span-2 md:col-span-1 border-t border-slate-800 pt-2">
                 <div className="flex gap-2 items-center w-full justify-between">
                    <span className="text-purple-400">RR {vitals.RR}</span>
                    <span className="text-[10px] text-slate-600">IMP</span>
                 </div>
                 <div className="flex gap-2 items-center w-full justify-between">
                    <span className="text-white">T {vitals.Temp}</span>
                    <span className="text-[10px] text-slate-600">T1</span>
                 </div>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-20 selection:bg-teal-100 selection:text-teal-900">
       
       {/* EMR Header */}
       <div className="bg-white border-b border-slate-300 px-6 py-3 shadow-sm sticky top-0 z-40">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-teal-600 p-2 rounded text-white"><Stethoscope size={20}/></div>
                <div>
                    <h1 className="font-bold text-lg leading-tight text-slate-900">MediCase <span className="text-teal-600">Pro</span></h1>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Clinical Rounds Simulator</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button onClick={() => setShowHistory(!showHistory)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${showHistory ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    <FolderOpen size={14}/> Records
                </button>
                <div className="w-px h-4 bg-slate-300"></div>
                <button onClick={handleGenerate} disabled={loading} className="px-4 py-1.5 rounded-md text-sm font-bold bg-slate-800 text-white hover:bg-slate-900 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin w-3 h-3"/> : <RefreshCw size={14}/>} New Case
                </button>
            </div>
         </div>
       </div>

       <div className="max-w-7xl mx-auto p-4 md:p-8">
            
            {/* History Drawer */}
            {showHistory && (
                <div className="bg-slate-200/50 p-4 rounded-xl mb-6 border border-slate-300 shadow-inner animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-2 px-2">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Archive</h3>
                        <button onClick={()=>setShowHistory(false)}><X size={16} className="text-slate-400"/></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {savedCases.map(c => (
                            <div key={c.id} onClick={() => loadCase(c)} className="bg-white p-3 rounded-lg border border-slate-200 hover:border-teal-500 cursor-pointer shadow-sm flex justify-between group">
                                <div>
                                    <div className="font-bold text-sm text-slate-800">{c.title}</div>
                                    <div className="text-[10px] text-slate-400 mt-1">{c.difficulty} • {new Date(c.createdAt).toLocaleDateString()}</div>
                                </div>
                                <button onClick={(e) => {e.stopPropagation(); setDeleteId(c.id)}} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
                    <div className="text-slate-900 font-bold text-lg animate-pulse">{loadingStep}</div>
                </div>
            )}

            {!started ? (
                /* --- DASHBOARD VIEW (Not Started) --- */
                <div className="grid md:grid-cols-12 gap-6 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden min-h-[500px]">
                    {/* Left: Vitals & Action */}
                    <div className="md:col-span-5 bg-slate-900 p-8 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <span className={`w-2 h-2 rounded-full ${caseData.difficulty === 'Advanced' ? 'bg-red-500' : 'bg-amber-400'} animate-pulse`}></span>
                                <span className="text-slate-400 text-xs font-mono uppercase">Status: Admission Pending</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{caseData.title}</h2>
                            <p className="text-slate-400 text-sm mb-8 line-clamp-2">{caseData.vignette.fullDescription}</p>
                            
                            <div className="mb-8">
                                <h3 className="text-slate-500 text-[10px] font-bold uppercase mb-3 tracking-widest">Current Vitals</h3>
                                <PatientMonitor vitals={caseData.vignette.vitals}/>
                            </div>
                        </div>

                        <button onClick={()=>setStarted(true)} className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-900/50 group">
                            Begin Rounds <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>

                    {/* Right: Detailed History (Paper Chart Style) */}
                    <div className="md:col-span-7 p-8 md:p-12 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-white relative">
                         {caseData !== MOCK_CASE && (
                            <button onClick={handleSave} className="absolute top-6 right-6 bg-teal-50 border border-teal-200 text-teal-700 p-2.5 rounded-full shadow-sm hover:bg-teal-100 hover:shadow-md hover:scale-105 text-slate-400 hover:text-teal-600 transition-colors" title="Save to Records"><Save size={20}/></button>
                         )}
                         
                         <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                            <ClipboardList className="text-slate-400"/>
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Clinical Abstract</span>
                         </div>
                         
                         <div className="prose prose-slate max-w-none">
                            <p className="text-lg leading-relaxed text-slate-700 font-serif border-l-4 border-teal-100 pl-4 py-1">
                                {caseData.vignette.fullDescription}
                            </p>
                            
                            {/* Visual Aid for Reference */}
                            <div className="my-6 p-4 bg-slate-50 border border-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-400 text-sm italic">
                                

[Image of arterial blood gas interpretation chart]

                                <span className="text-xs mt-1 text-slate-400/70 not-italic">Reference Data</span>
                            </div>
                         </div>

                         <div className="mt-8 flex gap-4">
                            <div className="flex-1 bg-amber-50 p-4 rounded border border-amber-100">
                                <div className="text-amber-800 text-xs font-bold uppercase mb-1">Warning</div>
                                <div className="text-amber-900 text-sm">Review all lab values before proceeding to questions.</div>
                            </div>
                         </div>
                    </div>
                </div>
            ) : (
                /* --- ACTIVE ROUNDS VIEW (Started) --- */
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Sidebar: Patient Snapshot */}
                    <div className="lg:col-span-1 space-y-4">
                        <button onClick={() => setStarted(false)} className="flex items-center gap-2 text-slate-500 hover:text-teal-600 text-sm font-bold mb-2">
                            <ArrowLeft size={16}/> Return to Chart
                        </button>
                        
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm"><Activity size={16} className="text-teal-500"/> Live Vitals</h3>
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            </div>
                            <PatientMonitor vitals={caseData.vignette.vitals} />
                            
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Patient History</h4>
                                <p className="text-xs text-slate-600 leading-relaxed font-serif bg-slate-50 p-3 rounded border border-slate-100">
                                    {caseData.vignette.fullDescription}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main: Interactive Questions */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col min-h-[600px]">
                            {/* Progress Bar */}
                            <div className="h-1.5 w-full bg-slate-100">
                                <div className="h-full bg-teal-500 transition-all duration-500" style={{width: `${((stepIndex + 1) / caseData.steps.length) * 100}%`}}></div>
                            </div>

                            <div className="p-8 md:p-10 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 uppercase tracking-wide">
                                        Question {stepIndex+1} / {caseData.steps.length}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-snug">
                                    {caseData.steps[stepIndex]?.question}
                                </h3>

                                <div className="space-y-3 mb-8 flex-1">
                                    {caseData.steps[stepIndex]?.options.map((opt, idx) => (
                                        <button 
                                            key={opt.id} 
                                            onClick={()=>setFeedback(opt)} 
                                            disabled={!!feedback} 
                                            className={`w-full p-5 rounded-lg text-left border transition-all flex items-center gap-4 group relative overflow-hidden
                                            ${feedback 
                                                ? (feedback.id === opt.id 
                                                    ? (opt.correct ? 'bg-green-50 border-green-500 text-green-900' : 'bg-red-50 border-red-500 text-red-900')
                                                    : 'bg-white border-slate-100 text-slate-300')
                                                : 'bg-white border-slate-200 hover:border-teal-400 hover:bg-slate-50 hover:shadow-md'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-colors
                                                ${feedback && feedback.id === opt.id 
                                                    ? (opt.correct ? 'bg-green-100 border-green-300 text-green-700' : 'bg-red-100 border-red-300 text-red-700')
                                                    : 'bg-slate-100 border-slate-200 text-slate-500 group-hover:bg-white'
                                                }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="font-medium text-lg">{opt.text}</span>
                                            {feedback?.id===opt.id && (
                                                <div className="ml-auto">
                                                    {feedback.correct ? <CheckCircle2 className="text-green-600"/> : <AlertTriangle className="text-red-500"/>}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {feedback && (
                                    <div className={`p-6 rounded-lg border-l-4 animate-in slide-in-from-bottom-2 ${feedback.correct ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                                        <div className="flex items-start gap-3">
                                            {feedback.correct ? <Microscope className="text-green-600 shrink-0 mt-1"/> : <Siren className="text-red-500 shrink-0 mt-1"/>}
                                            <div>
                                                <h4 className={`font-bold mb-1 ${feedback.correct ? 'text-green-800' : 'text-red-800'}`}>
                                                    {feedback.correct ? 'Correct Diagnosis' : 'Clinical Correction Needed'}
                                                </h4>
                                                <p className="text-slate-700 leading-relaxed text-sm mb-4">{feedback.feedback}</p>

                                                <button onClick={handleNext} className="bg-slate-900 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg">
                                                    {stepIndex < caseData.steps.length - 1 ? 'Proceed to Next Step' : 'Finalize Case'} <ArrowRight size={14} className="inline ml-1"/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm border-t-4 border-red-500 animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Patient Record?</h3>
                        <p className="text-slate-500 text-sm mb-6">This action cannot be undone. The case data will be permanently removed from the archive.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded">Cancel</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white font-bold hover:bg-red-700 rounded shadow-md">Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}
       </div>
    </div>
  );
}
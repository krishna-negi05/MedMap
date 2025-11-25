'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Activity, CheckCircle2, AlertTriangle, ArrowRight, Save, FolderOpen, Clock, Trash2, X } from 'lucide-react';
import { callGemini } from '../../lib/gemini';

const CLINICAL_CASE_SCHEMA = { type: "OBJECT", properties: { title: { type: "STRING" }, difficulty: { type: "STRING" }, vignette: { type: "OBJECT", properties: { intro: { type: "STRING" }, vitals: { type: "OBJECT", properties: { BP: { type: "STRING" }, HR: { type: "STRING" }, RR: { type: "STRING" }, SpO2: { type: "STRING" } } }, history: { type: "STRING" } } }, steps: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "INTEGER" }, question: { type: "STRING" }, options: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "STRING" }, text: { type: "STRING" }, feedback: { type: "STRING" }, correct: { type: "BOOLEAN" } } } } } } } } };

const MOCK_CASE = { title: "Acute Chest Pain in ER", difficulty: "Intermediate", vignette: { intro: "A 55-year-old male presents to the ED with crushing substernal chest pain radiating to the left arm.", vitals: { BP: "150/90 mmHg", HR: "110 bpm", RR: "22/min", SpO2: "94% on RA" }, history: "HTN, Smoker (20 pack-years), DM Type 2." }, steps: [{ id: 1, question: "Immediate next step?", options: [{ id: 'a', text: "ECG", correct: true, feedback: "Correct. Time is muscle." }, { id: 'b', text: "CXR", correct: false, feedback: "Incorrect. ECG is priority." }] }] };

export default function CasesPage() {
  const [caseData, setCaseData] = useState(MOCK_CASE);
  const [stepIndex, setStepIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // History States
  const [savedCases, setSavedCases] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => { fetchSavedCases(); }, []);

  const fetchSavedCases = async () => {
    try {
      const res = await fetch('/api/cases');
      const json = await res.json();
      if(json.ok) setSavedCases(json.data);
    } catch(e) { console.error(e); }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try { 
        const res = await callGemini("Generate a clinical case study regarding a random common medical emergency (MI, Stroke, Sepsis, Trauma etc). JSON output.", CLINICAL_CASE_SCHEMA); 
        setCaseData(res); 
        setStarted(false); 
        setStepIndex(0); 
        setFeedback(null); 
        setShowHistory(false);
    } catch(e) {
        alert("AI Generation failed. Try again.");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: caseData.title, 
          difficulty: caseData.difficulty, 
          data: caseData 
        })
      });
      alert('Case Saved!');
      fetchSavedCases();
    } catch(e) { alert('Save failed'); }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if(!confirm("Delete this case?")) return;
    await fetch(`/api/cases?id=${id}`, { method: 'DELETE' });
    fetchSavedCases();
  };

  const loadCase = (saved) => {
    setCaseData(saved.data);
    setStarted(false);
    setStepIndex(0);
    setFeedback(null);
    setShowHistory(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 pb-24 relative">
       
       {/* Header & Controls */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
            <h2 className="text-3xl font-bold text-slate-900">Clinical Cases</h2>
            <p className="text-slate-500">Interactive patient scenarios</p>
         </div>
         
         <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => setShowHistory(!showHistory)} className="flex-1 md:flex-none bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center justify-center gap-2 transition-all">
                <FolderOpen size={16} className="text-slate-500"/> {showHistory ? 'Close' : 'Saved'}
            </button>
            <button onClick={handleGenerate} className="flex-[2] md:flex-none bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2">
                {loading ? <RefreshCw className="animate-spin w-4 h-4"/> : <><Sparkles size={16} className="text-teal-300"/> New Case</>}
            </button>
         </div>
       </div>

       {/* Saved History Panel */}
       {showHistory && (
         <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-700 flex items-center gap-2"><Clock size={16}/> Case History</h3>
                <button onClick={()=>setShowHistory(false)}><X size={18} className="text-slate-400"/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {savedCases.length === 0 && <p className="text-slate-400 text-sm p-2">No saved cases found.</p>}
                {savedCases.map(c => (
                    <div key={c.id} onClick={() => loadCase(c)} className="p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50 cursor-pointer transition-all flex justify-between items-center group">
                        <div>
                            <div className="font-bold text-sm text-slate-800">{c.title}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">{c.difficulty} • {new Date(c.createdAt).toLocaleDateString()}</div>
                        </div>
                        <button onClick={(e) => handleDelete(c.id, e)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-white rounded-full"><Trash2 size={14}/></button>
                    </div>
                ))}
            </div>
         </div>
       )}

       {!started ? (
         <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 grid md:grid-cols-2 relative group">
            {/* Save Button (Only visible if not started) */}
            <button onClick={handleSave} className="absolute top-4 right-4 z-20 p-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white hover:text-teal-600 transition-all" title="Save Case">
                <Save size={20}/>
            </button>

            <div className="p-12 flex flex-col justify-center bg-slate-50">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider w-fit mb-4">{caseData.difficulty} Case</div>
               <h2 className="text-4xl font-extrabold text-slate-900 mb-4">{caseData.title}</h2>
               <p className="text-slate-600 text-lg mb-8 leading-relaxed">{caseData.vignette.intro}</p>
               <button onClick={()=>setStarted(true)} className="w-fit bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3">Start Rounds <ArrowRight/></button>
            </div>
            <div className="bg-teal-900 p-12 text-teal-50 flex flex-col justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-800 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
               <div className="relative z-10 bg-teal-800/50 backdrop-blur-md p-6 rounded-2xl border border-teal-700"><p className="italic text-lg">"{caseData.vignette.intro.substring(0,150)}..."</p></div>
            </div>
         </div>
       ) : (
         <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-lg h-fit sticky top-24">
               <h3 className="font-bold mb-4 text-slate-900 flex items-center gap-2"><Activity size={18} className="text-teal-500"/> Vitals & Hx</h3>
               <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-3">
                   {Object.entries(caseData.vignette.vitals).map(([k,v])=><div key={k} className="bg-slate-50 p-3 rounded-xl border border-slate-100"><div className="text-xs text-slate-500 mb-1 uppercase">{k}</div><div className="font-mono font-bold text-slate-900">{v}</div></div>)}
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100"><span className="text-xs font-bold text-slate-400 uppercase">History</span><p className="text-sm mt-1 text-slate-700">{caseData.vignette.history}</p></div>
               </div>
            </div>
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 min-h-[500px] flex flex-col">
               <div className="mb-6"><span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wide">Decision Point {stepIndex+1}</span></div>
               <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-snug">{caseData.steps[stepIndex]?.question}</h3>
               <div className="space-y-4 mb-8">
                  {caseData.steps[stepIndex]?.options.map(opt => (
                    <button key={opt.id} onClick={()=>setFeedback(opt)} disabled={!!feedback} className={`w-full p-5 rounded-2xl text-left border-2 transition-all flex justify-between items-center ${feedback?.id===opt.id ? (opt.correct?'bg-green-50 border-green-500 text-green-900':'bg-red-50 border-red-500 text-red-900') : 'bg-white border-slate-100 hover:border-teal-200 hover:bg-slate-50'}`}>
                      <span className="font-medium text-lg">{opt.text}</span>
                      {feedback?.id===opt.id && (feedback.correct?<CheckCircle2 className="text-green-600"/>:<AlertTriangle className="text-red-500"/>)}
                    </button>
                  ))}
               </div>
               {feedback && (
                 <div className={`mt-auto p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 ${feedback.correct ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                   <div className="font-bold mb-2 flex items-center gap-2">{feedback.correct ? <span className="text-green-700 flex items-center gap-2">Correct <Sparkles size={16}/></span> : <span className="text-red-700">Incorrect</span>}</div>
                   <p className="text-slate-700">{feedback.feedback}</p>
                   {feedback.correct && <div className="mt-4 flex justify-end"><button onClick={()=>{if(stepIndex<caseData.steps.length-1){setStepIndex(stepIndex+1);setFeedback(null);}else{alert('Case Complete');}}} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2">Next <ArrowRight size={16}/></button></div>}
                 </div>
               )}
            </div>
         </div>
       )}
    </div>
  );
}
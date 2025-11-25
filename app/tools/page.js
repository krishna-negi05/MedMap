'use client';
import { useState, useEffect } from 'react';
import { 
  Layers, Pill, FlaskConical, Mic, Image as ImageIcon, 
  RefreshCw, X, ChevronRight, RotateCcw, Sparkles, 
  Lightbulb, AlertTriangle, CheckCircle2, Volume2, ArrowRight, 
  Save, Clock, Trash2, FolderOpen, Loader2 
} from 'lucide-react';
import { callGemini } from '../../lib/gemini';
// 👇 Import your centralized model configuration
import { FEATURE_MODELS } from '../../lib/ai-config';

// --- Schemas ---
const FLASHCARD_SCHEMA = { 
  type: "OBJECT", 
  properties: { 
    deckTitle: { type: "STRING" }, 
    cards: { 
      type: "ARRAY", 
      items: { 
        type: "OBJECT", 
        properties: { 
          front: { type: "STRING" }, 
          back: { type: "STRING" }, 
          difficulty: { type: "STRING" } 
        } 
      } 
    } 
  } 
};

const PHARMA_INTERACTION_SCHEMA = { 
  type: "OBJECT", 
  properties: { 
    severity: { type: "STRING", enum: ["Mild", "Moderate", "Severe", "Contraindicated"] }, 
    mechanism: { type: "STRING" }, 
    recommendation: { type: "STRING" }, 
    summary: { type: "STRING" } 
  } 
};

const LAB_REPORT_SCHEMA = { 
  type: "OBJECT", 
  properties: { 
    interpretation: { type: "STRING" }, 
    differentials: { type: "ARRAY", items: { type: "STRING" } }, 
    nextSteps: { type: "ARRAY", items: { type: "STRING" } }, 
    severity: { type: "STRING", enum: ["Normal", "Abnormal", "Critical"] } 
  } 
};

const VIVA_EVALUATION_SCHEMA = { 
  type: "OBJECT", 
  properties: { 
    score: { type: "INTEGER" }, 
    feedback: { type: "STRING" }, 
    betterAnswer: { type: "STRING" }, 
    nextQuestion: { type: "STRING" } 
  } 
};

// --- 1. FLASHCARDS ---
const FlashcardView = () => {
  const [topic, setTopic] = useState('');
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [savedDecks, setSavedDecks] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => { fetchDecks(); }, []);

  const fetchDecks = async () => {
    try {
        const res = await fetch('/api/tools/flashcards');
        const json = await res.json();
        if(json.ok) setSavedDecks(json.data);
    } catch(e) {}
  };

  const generateDeck = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const prompt = `Create 8 high-yield medical flashcards for: "${topic}". JSON Output.`;
      // Use Qwen (Structural Model)
      const res = await callGemini(prompt, FLASHCARD_SCHEMA, FEATURE_MODELS.flashcards);
      setDeck(res); setCurrentIndex(0); setFlipped(false);
    } catch (e) { alert("Error generating cards."); }
    setLoading(false);
  };

  const saveDeck = async () => {
    if(!deck) return;
    try {
        await fetch('/api/tools/flashcards', {
            method: 'POST',
            body: JSON.stringify({ topic: deck.deckTitle || topic, cards: deck })
        });
        alert('Deck saved!');
        fetchDecks();
    } catch(e) { alert('Save failed'); }
  };

  const loadDeck = (saved) => {
      setDeck(saved.cards);
      setTopic(saved.topic);
      setCurrentIndex(0);
      setFlipped(false);
      setShowHistory(false);
  };

  const deleteDeck = async (id, e) => {
      e.stopPropagation();
      if(!confirm('Delete deck?')) return;
      await fetch(`/api/tools/flashcards?id=${id}`, { method: 'DELETE' });
      fetchDecks();
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-xl font-bold text-slate-800">Smart Flashcards</h3>
         <button onClick={() => setShowHistory(!showHistory)} className="text-slate-500 hover:text-teal-600 flex items-center gap-1 text-xs font-bold bg-slate-100 px-3 py-2 rounded-lg">
            <FolderOpen size={14}/> {showHistory ? 'Close Library' : 'My Decks'}
         </button>
      </div>

      {showHistory ? (
          <div className="grid gap-2 overflow-y-auto max-h-[400px] pr-2">
              {savedDecks.length === 0 && <p className="text-center text-slate-400 py-10">No saved decks.</p>}
              {savedDecks.map(d => (
                  <div key={d.id} onClick={() => loadDeck(d)} className="bg-white border p-4 rounded-xl hover:border-teal-400 cursor-pointer flex justify-between items-center group">
                      <div>
                          <div className="font-bold text-slate-800">{d.topic}</div>
                          <div className="text-[10px] text-slate-400">{new Date(d.createdAt).toLocaleDateString()}</div>
                      </div>
                      <button onClick={(e) => deleteDeck(d.id, e)} className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-full"><Trash2 size={16}/></button>
                  </div>
              ))}
          </div>
      ) : (
        <>
            {!deck ? (
                <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
                <div className="bg-teal-50 p-4 rounded-full mb-6"><Layers size={40} className="text-teal-500"/></div>
                <p className="text-slate-500 mb-8 text-sm">Enter any medical topic and AI will generate a high-yield study deck.</p>
                <div className="flex gap-2 w-full">
                    <input className="flex-1 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-teal-500" placeholder="Enter topic..." value={topic} onChange={(e)=>setTopic(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && generateDeck()}/>
                    <button onClick={generateDeck} disabled={loading} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold">{loading ? <RefreshCw className="animate-spin"/> : 'Create'}</button>
                </div>
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6 bg-slate-50 p-3 rounded-xl">
                        <div><h3 className="font-bold text-slate-900">{deck.deckTitle}</h3><span className="text-teal-600 text-xs font-bold uppercase">Card {currentIndex+1} / {deck.cards.length}</span></div>
                        <div className="flex gap-2">
                            <button onClick={saveDeck} className="p-2 bg-white border rounded-lg hover:text-teal-600" title="Save Deck"><Save size={18}/></button>
                            <button onClick={() => setDeck(null)} className="p-2 bg-white border rounded-lg hover:text-red-500"><X size={18}/></button>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center perspective-1000 py-4">
                        <div onClick={() => setFlipped(!flipped)} className={`w-full max-w-lg aspect-[3/2] relative transition-transform duration-700 transform-style-3d cursor-pointer group ${flipped ? 'rotate-y-180' : ''}`}>
                            <div className={`absolute inset-0 bg-white border-2 border-slate-100 shadow-lg rounded-3xl p-8 flex flex-col items-center justify-center text-center backface-hidden ${flipped ? 'opacity-0' : 'opacity-100'}`}>
                            <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">Question</span>
                            <p className="text-2xl font-bold text-slate-800">{deck.cards[currentIndex].front}</p>
                            <span className="absolute bottom-6 text-xs text-slate-400 font-medium flex items-center gap-1"><RotateCcw size={10}/> Tap to flip</span>
                            </div>
                            <div className={`absolute inset-0 bg-slate-900 text-white shadow-2xl rounded-3xl p-8 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 ${flipped ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="px-3 py-1 bg-white/10 text-teal-300 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">Answer</span>
                            <p className="text-xl font-medium">{deck.cards[currentIndex].back}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        <button onClick={() => {setFlipped(false); setCurrentIndex(Math.max(0, currentIndex-1))}} disabled={currentIndex===0} className="p-4 rounded-full bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50"><ChevronRight size={24} className="rotate-180 text-slate-600"/></button>
                        <button onClick={() => {setFlipped(false); setCurrentIndex(Math.min(deck.cards.length-1, currentIndex+1))}} disabled={currentIndex===deck.cards.length-1} className="p-4 rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"><ChevronRight size={24}/></button>
                    </div>
                </div>
            )}
        </>
      )}
      <style jsx>{`.rotate-y-180 { transform: rotateY(180deg); } .backface-hidden { backface-visibility: hidden; } .perspective-1000 { perspective: 1000px; } .transform-style-3d { transform-style: preserve-3d; }`}</style>
    </div>
  );
};

// --- 2. PHARMA ---
const PharmaView = () => {
  const [drugA, setDrugA] = useState('');
  const [drugB, setDrugB] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [viewHistory, setViewHistory] = useState(false);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
      const res = await fetch('/api/tools/history?type=pharma');
      const json = await res.json();
      if(json.ok) setHistory(json.data);
  };

  const checkInteraction = async () => {
    if (!drugA || !drugB) return;
    setLoading(true);
    try {
      const prompt = `Analyze interaction between ${drugA} and ${drugB}. JSON { severity, mechanism, recommendation, summary }`;
      // Use Qwen (Structural)
      const res = await callGemini(prompt, PHARMA_INTERACTION_SCHEMA, FEATURE_MODELS.pharma);
      setResult(res);
      setViewHistory(false);
    } catch(e) { alert("Analysis failed"); }
    setLoading(false);
  };

  const saveResult = async () => {
      if(!result) return;
      await fetch('/api/tools/history', {
          method: 'POST',
          body: JSON.stringify({ toolType: 'pharma', title: `${drugA} + ${drugB}`, data: result })
      });
      alert('Saved to history');
      fetchHistory();
  };

  return (
    <div className="h-full flex flex-col items-center max-w-2xl mx-auto w-full">
      <div className="flex justify-between w-full items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Interaction Checker</h3>
        <button onClick={() => setViewHistory(!viewHistory)} className="text-xs font-bold bg-slate-100 px-3 py-2 rounded-lg text-slate-600 hover:text-teal-600 flex gap-1"><Clock size={14}/> History</button>
      </div>

      {viewHistory ? (
          <div className="w-full space-y-2">
              {history.map(h => (
                  <div key={h.id} onClick={() => { setResult(h.data); setViewHistory(false); }} className="p-4 border rounded-xl cursor-pointer hover:bg-slate-50 flex justify-between">
                      <span className="font-bold">{h.title}</span>
                      <span className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleDateString()}</span>
                  </div>
              ))}
          </div>
      ) : (
        <>
            <div className="flex flex-col md:flex-row gap-4 w-full mb-6">
                <div className="flex-1 w-full"><div className="bg-slate-50 p-4 rounded-2xl border border-slate-200"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Drug A</label><input className="w-full bg-transparent outline-none font-medium" placeholder="e.g., Warfarin" value={drugA} onChange={(e)=>setDrugA(e.target.value)}/></div></div>
                <div className="bg-white p-2 rounded-full border shadow-sm self-center"><RefreshCw size={20} className="text-slate-300"/></div>
                <div className="flex-1 w-full"><div className="bg-slate-50 p-4 rounded-2xl border border-slate-200"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Drug B</label><input className="w-full bg-transparent outline-none font-medium" placeholder="e.g., Aspirin" value={drugB} onChange={(e)=>setDrugB(e.target.value)}/></div></div>
            </div>
            <button onClick={checkInteraction} disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20">{loading ? 'Analyzing...' : 'Check Safety'} <Sparkles size={18} className="text-teal-300"/></button>
            {result && (
                <div className="mt-8 w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-lg relative overflow-hidden animate-in slide-in-from-bottom-4">
                    <div className={`absolute top-0 left-0 w-1 h-full ${result.severity === 'Severe' || result.severity === 'Contraindicated' ? 'bg-red-500' : result.severity === 'Moderate' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${result.severity === 'Severe' || result.severity === 'Contraindicated' ? 'bg-red-100 text-red-700' : result.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{result.severity} Risk</span>
                        <button onClick={saveResult} className="text-slate-400 hover:text-teal-600"><Save size={18}/></button>
                    </div>
                    <p className="text-lg font-bold text-slate-900 mb-2">{result.summary}</p>
                    <p className="text-slate-600 mb-6 text-sm leading-relaxed">{result.mechanism}</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><span className="text-xs font-bold text-teal-600 uppercase flex items-center gap-1"><Lightbulb size={12}/> Recommendation</span><p className="text-sm text-slate-800 mt-1 font-medium">{result.recommendation}</p></div>
                </div>
            )}
        </>
      )}
    </div>
  );
};

// --- 3. LABS ---
const LabView = () => {
  const [values, setValues] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [viewHistory, setViewHistory] = useState(false);

  useEffect(() => { fetchHistory(); }, []);
  const fetchHistory = async () => {
      const res = await fetch('/api/tools/history?type=labs');
      const json = await res.json();
      if(json.ok) setHistory(json.data);
  };

  const analyzeLabs = async () => {
    if (!values) return;
    setLoading(true);
    try {
      const prompt = `Interpret these lab values: "${values}". JSON { interpretation, differentials:[], nextSteps:[], severity }`;
      // Use Qwen (Structural)
      const res = await callGemini(prompt, LAB_REPORT_SCHEMA, FEATURE_MODELS.labs);
      setResult(res);
      setViewHistory(false);
    } catch (e) { alert("Error analyzing labs"); }
    setLoading(false);
  };

  const saveResult = async () => {
      if(!result) return;
      await fetch('/api/tools/history', {
          method: 'POST',
          body: JSON.stringify({ toolType: 'labs', title: values.substring(0, 20) + '...', data: result })
      });
      alert('Report saved');
      fetchHistory();
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
          <div><h3 className="text-xl font-bold mb-1 text-slate-900">Lab Interpreter</h3><p className="text-slate-500 text-sm">Paste lab values for instant analysis.</p></div>
          <button onClick={() => setViewHistory(!viewHistory)} className="text-xs font-bold bg-slate-100 px-3 py-2 rounded-lg text-slate-600 hover:text-teal-600 flex gap-1"><Clock size={14}/> History</button>
      </div>

      {viewHistory ? (
          <div className="w-full space-y-2">
              {history.map(h => (
                  <div key={h.id} onClick={() => { setResult(h.data); setViewHistory(false); }} className="p-4 border rounded-xl cursor-pointer hover:bg-slate-50 flex justify-between">
                      <span className="font-bold">{h.title}</span>
                      <span className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleDateString()}</span>
                  </div>
              ))}
          </div>
      ) : (
        <>
            <textarea className="w-full h-32 border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none resize-none mb-4 font-mono text-sm" placeholder="e.g. Na 125, K 5.5, pH 7.2" value={values} onChange={(e)=>setValues(e.target.value)}></textarea>
            <button onClick={analyzeLabs} disabled={loading} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 shadow-md">{loading ? 'Analyzing Report...' : 'Interpret Results'}</button>
            {result && (
                <div className="mt-6 space-y-4 animate-in slide-in-from-bottom-4 relative">
                    <button onClick={saveResult} className="absolute top-2 right-2 p-2 bg-slate-100 rounded-full hover:bg-teal-100 text-slate-500 hover:text-teal-600"><Save size={16}/></button>
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-md">
                        <div className="flex justify-between items-start mb-2"><h4 className="font-bold text-lg text-slate-900">{result.interpretation}</h4>{result.severity === 'Critical' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><AlertTriangle size={12}/> Critical</span>}</div>
                        <div className="flex flex-wrap gap-2 mt-3">{result.differentials.map((diff, i) => (<span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium border border-slate-200">{diff}</span>))}</div>
                    </div>
                    <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100"><span className="text-xs font-bold text-blue-700 uppercase tracking-wide flex items-center gap-1"><CheckCircle2 size={12}/> Recommended Steps</span><ul className="mt-3 space-y-2">{result.nextSteps.map((step, i) => <li key={i} className="text-sm text-blue-900 flex items-start gap-2 bg-white/50 p-2 rounded-lg"><span>•</span> {step}</li>)}</ul></div>
                </div>
            )}
        </>
      )}
    </div>
  );
};

// --- 4. VIVA (OSCE) ---
const VivaView = () => {
  const [active, setActive] = useState(false);
  const [topic, setTopic] = useState('General Medicine');
  const [currentQ, setCurrentQ] = useState('');
  const [userAns, setUserAns] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  const startViva = async () => {
    setActive(true);
    setLoading(true);
    const prompt = `Act as a strict medical professor. Ask a viva question about ${topic}. Short question.`;
    // Use DeepSeek (Reasoning) to act as a strict professor
    const text = await callGemini(prompt, null, FEATURE_MODELS.osce);
    setCurrentQ(text);
    setLoading(false);
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
  };

  const submitAnswer = async () => {
    if (!userAns) return;
    setLoading(true);
    const prompt = `Professor asked: "${currentQ}". Student answered: "${userAns}". Grade it (0-10), give feedback, better answer, and next question. JSON.`;
    // Use DeepSeek (Reasoning) to evaluate logic
    const res = await callGemini(prompt, VIVA_EVALUATION_SCHEMA, FEATURE_MODELS.osce);
    setEvaluation(res);
    setCurrentQ(res.nextQuestion);
    setLoading(false);
    setUserAns('');
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(res.feedback + " Next question. " + res.nextQuestion);
        window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="h-full flex flex-col items-center text-center max-w-xl mx-auto">
      {!active ? (
        <div className="my-auto w-full">
           <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-teal-100"><Mic size={40} className="text-teal-600"/></div>
           <h3 className="text-2xl font-bold mb-2 text-slate-900">Virtual Viva Examiner</h3>
           <p className="text-slate-500 mb-8">Prepare for oral exams with an AI professor. Voice-enabled questions.</p>
           <input className="border border-slate-200 p-3 rounded-xl mb-4 w-full text-center bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-teal-500" value={topic} onChange={(e)=>setTopic(e.target.value)} placeholder="Enter Subject (e.g. Anatomy)"/>
           <button onClick={startViva} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl shadow-slate-900/20 w-full">Start Exam</button>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col pt-4">
           <div className="flex-1 flex flex-col justify-center items-center">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl border border-slate-700 mb-8 relative text-white shadow-2xl w-full">
                 <div className="absolute -top-3 -left-3 bg-teal-500 p-2 rounded-full border-4 border-white"><Volume2 size={20} className="text-white"/></div>
                 <p className="text-xl font-medium leading-relaxed">"{currentQ}"</p>
                 {loading && <div className="mt-4 flex justify-center gap-1"><div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-150"></div></div>}
              </div>
              
              {evaluation && (
                <div className="w-full mb-6 text-left bg-white border border-slate-200 p-6 rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-2">
                   <div className="flex justify-between mb-2 items-center"><span className="font-bold text-slate-700 text-sm uppercase tracking-wide">Professor's Feedback</span><span className={`font-black text-lg ${evaluation.score >= 7 ? 'text-green-600' : 'text-amber-600'}`}>{evaluation.score}/10</span></div>
                   <p className="text-slate-700 mb-4 leading-relaxed">{evaluation.feedback}</p>
                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><span className="text-xs font-bold text-slate-400 uppercase block mb-1">Better Answer</span><p className="text-sm text-slate-600 italic">{evaluation.betterAnswer}</p></div>
                </div>
              )}
           </div>
           <div className="w-full mt-auto pb-4">
              <div className="relative">
                 <input className="w-full bg-slate-50 border border-slate-200 rounded-full pl-6 pr-14 py-4 outline-none focus:ring-2 focus:ring-teal-500 shadow-sm" placeholder="Type your answer..." value={userAns} onChange={(e) => setUserAns(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}/>
                 <button onClick={submitAnswer} disabled={loading} className="absolute right-2 top-2 bottom-2 bg-teal-600 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-teal-700 disabled:bg-slate-300 transition-colors shadow-md"><ArrowRight size={20}/></button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- 5. RADIOLOGY (Placeholder for now) ---
const RadiologyView = () => {
  const [mode, setMode] = useState('cxr'); 
  const [showLabels, setShowLabels] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center">
       <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
          <button onClick={()=>setMode('cxr')} className={`px-6 py-2 rounded-lg font-bold transition-all ${mode==='cxr'?'bg-white text-slate-900 shadow-sm':'text-slate-500 hover:text-slate-700'}`}>Chest X-Ray</button>
          <button onClick={()=>setMode('ecg')} className={`px-6 py-2 rounded-lg font-bold transition-all ${mode==='ecg'?'bg-white text-slate-900 shadow-sm':'text-slate-500 hover:text-slate-700'}`}>ECG Strip</button>
       </div>
       <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl w-full max-w-md aspect-[4/5] md:aspect-square flex items-center justify-center border-4 border-slate-800">
          {mode === 'cxr' ? (
            <svg viewBox="0 0 400 500" className="w-full h-full opacity-90">
               <path d="M 200,50 L 200,450" stroke="#333" strokeWidth="10"/>
               <path d="M 50,100 Q 200,150 350,100" stroke="#444" strokeWidth="5" fill="none"/>
               <path d="M 40,150 Q 200,200 360,150" stroke="#444" strokeWidth="5" fill="none"/>
               <path d="M 30,200 Q 200,250 370,200" stroke="#444" strokeWidth="5" fill="none"/>
               <path d="M 60,80 Q 10,200 60,400 Q 120,400 180,350 Q 150,150 60,80" fill="#111" stroke="#555"/>
               <path d="M 340,80 Q 390,200 340,400 Q 280,400 220,350 Q 250,150 340,80" fill="#111" stroke="#555"/>
               <path d="M 180,200 Q 250,220 260,350 Q 200,420 150,350 Q 160,250 180,200" fill="#ddd" opacity="0.3"/>
               <path d="M 340,80 Q 360,150 330,200 L 340,80" fill="#000" stroke="none" className={showLabels ? "stroke-red-500 stroke-2" : ""}/>
               {showLabels && (<><text x="100" y="200" fill="white" fontSize="12">Right Lung</text><text x="280" y="200" fill="white" fontSize="12">Left Lung</text><text x="200" y="300" fill="white" fontSize="12" textAnchor="middle">Heart Shadow</text><rect x="320" y="80" width="40" height="100" fill="none" stroke="red" strokeDasharray="4"/><text x="320" y="70" fill="red" fontSize="12">Pneumothorax?</text></>)}
            </svg>
          ) : (
            <svg viewBox="0 0 400 200" className="w-full h-full bg-white">
               <defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="red" strokeWidth="0.5" opacity="0.2"/></pattern></defs>
               <rect width="100%" height="100%" fill="url(#grid)" />
               <polyline points="0,100 20,100 30,90 40,110 50,100 60,100 65,80 70,140 75,60 80,100 100,100 110,90 120,100 150,100 170,100 180,90 190,110 200,100 210,100 215,80 220,140 225,60 230,100 250,100" fill="none" stroke="black" strokeWidth="2"/>
               {showLabels && (<g><text x="70" y="50" fill="red" fontSize="10">QRS</text><text x="30" y="80" fill="red" fontSize="10">P</text><text x="110" y="80" fill="red" fontSize="10">T</text></g>)}
            </svg>
          )}
       </div>
       <div className="mt-6">
          <button onClick={()=>setShowLabels(!showLabels)} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 flex items-center gap-2 shadow-lg shadow-teal-200 transition-all active:scale-95">
            {showLabels ? 'Hide Analysis' : 'AI Analyze'} {showLabels ? <X size={16}/> : <Sparkles size={16}/>}
          </button>
       </div>
    </div>
  );
};

// --- Main Tools Page ---
export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState('flashcards');

  const tools = [
    { id: 'flashcards', icon: Layers, label: 'Flashcards', desc: 'AI Decks' },
    { id: 'pharma', icon: Pill, label: 'Pharma', desc: 'Interactions' },
    { id: 'labs', icon: FlaskConical, label: 'Lab AI', desc: 'Interpreter' },
    { id: 'viva', icon: Mic, label: 'Viva Voice', desc: 'Oral Exam' },
    { id: 'radiology', icon: ImageIcon, label: 'Radiology', desc: 'X-Ray Sim' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Medical Toolkit</h2>
        <p className="text-slate-500">Specialized AI tools for clinical practice and exam prep.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2 flex md:block overflow-x-auto md:overflow-visible pb-2 md:pb-0 snap-x scrollbar-hide">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
                <button key={tool.id} onClick={() => setActiveTool(tool.id)} className={`flex-shrink-0 snap-start w-40 md:w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 ${activeTool === tool.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105' : 'bg-white hover:bg-slate-50 text-slate-600 border border-transparent hover:border-slate-200'}`}>
                    <div className={`p-2 rounded-xl ${activeTool === tool.id ? 'bg-white/10' : 'bg-slate-100'}`}><Icon size={20} /></div>
                    <div className="text-left"><div className="font-bold text-sm">{tool.label}</div><div className={`text-[10px] ${activeTool === tool.id ? 'text-slate-300' : 'text-slate-400'}`}>{tool.desc}</div></div>
                </button>
            )
          })}
        </div>
        <div className="md:col-span-3 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-xl min-h-[500px] p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -z-10 -mr-16 -mt-16 opacity-50"></div>
            {activeTool === 'flashcards' && <FlashcardView />}
            {activeTool === 'pharma' && <PharmaView />}
            {activeTool === 'labs' && <LabView />}
            {activeTool === 'viva' && <VivaView />}
            {activeTool === 'radiology' && <RadiologyView />}
        </div>
      </div>
    </div>
  );
}
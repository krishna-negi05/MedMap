'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Layers, Pill, FlaskConical, Mic, Image as ImageIcon, 
  RefreshCw, X, ChevronRight, RotateCcw, Sparkles, 
  Lightbulb, AlertTriangle, CheckCircle2, Volume2, ArrowRight, 
  Save, Clock, Trash2, FolderOpen, Loader2, Thermometer, Home,
  Activity, Stethoscope, ScanLine, Eye, Upload, Info
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast'; // IMPORTED TOAST
import { callGemini } from '../../lib/gemini';
import { FEATURE_MODELS } from '../../lib/ai-config';

// --- UTILITIES ---

// 1. Markdown Renderer for Reports
const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
        // Headers
        if (line.trim().startsWith('###')) {
            return <h3 key={index} className="text-lg font-black text-slate-800 mt-4 mb-2 uppercase tracking-wide flex items-center gap-2"><span className="w-1 h-5 bg-teal-500 rounded-full"></span>{line.replace(/#/g, '')}</h3>;
        }
        // Bold text handling
        if (line.includes('**')) {
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return <p key={index} className="mb-2 text-slate-600 leading-relaxed">{parts.map((part, i) => part.startsWith('**') ? <span key={i} className="font-bold text-slate-900">{part.replace(/\*\*/g, '')}</span> : part)}</p>;
        }
        // Diagram Placeholder handling
        if (line.includes('[Image of')) {
            return <div key={index} className="my-4 p-3 bg-slate-100 rounded-lg text-xs font-mono text-slate-500 flex items-center gap-2"><ImageIcon size={14}/> Diagram Placeholder: {line}</div>;
        }
        // Standard paragraph
        return <p key={index} className="mb-2 text-slate-600 leading-relaxed">{line}</p>;
    });
};

// --- SCHEMAS ---
const FLASHCARD_SCHEMA = { 
  type: "OBJECT", 
  properties: { 
    deckTitle: { type: "STRING" }, 
    cards: { type: "ARRAY", items: { type: "OBJECT", properties: { front: { type: "STRING" }, back: { type: "STRING" }, difficulty: { type: "STRING" } } } } 
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

const SYMPTOM_CHECKER_SCHEMA = {
  type: "OBJECT",
  properties: {
    primaryDiagnosis: { type: "STRING" },
    cautionFlag: { type: "STRING", description: "Immediate danger signs" },
    modernMedication: { type: "STRING", description: "Primary recommended OTC medicine or class" },
    homeRemedy: { type: "STRING", description: "Ayurvedic/Desi/Simple home remedy advice" },
    whenToSeeDoctor: { type: "STRING" }
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
    if (!topic) {
        toast.error("Please enter a topic first!");
        return;
    }
    setLoading(true);
    
    const promise = async () => {
      const prompt = `Create 8 high-yield medical flashcards for: "${topic}". JSON Output.`;
      const res = await callGemini(prompt, FLASHCARD_SCHEMA, FEATURE_MODELS.flashcards);
      setDeck(res); 
      setCurrentIndex(0); 
      setFlipped(false);
      return res;
    };

    toast.promise(promise(), {
        loading: 'Generating study deck...',
        success: 'Deck ready!',
        error: 'Failed to create cards.'
    });

    try { await promise(); } catch(e) {}
    setLoading(false);
  };

  const saveDeck = async () => {
    if(!deck) return;
    
    const promise = fetch('/api/tools/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: deck.deckTitle || topic, cards: deck })
    }).then(async res => {
        if(!res.ok) throw new Error();
        await fetchDecks();
    });

    toast.promise(promise, {
        loading: 'Saving to library...',
        success: 'Deck saved successfully!',
        error: 'Could not save deck.'
    });
  };

  const loadDeck = (saved) => {
      setDeck(saved.cards);
      setTopic(saved.topic);
      setCurrentIndex(0);
      setFlipped(false);
      setShowHistory(false);
      toast.success(`Loaded "${saved.topic}"`);
  };

  // Custom Toast for Delete Confirmation
  const confirmDelete = (id, e) => {
      e.stopPropagation();
      toast((t) => (
        <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-800">Delete this deck?</span>
            <div className="flex gap-2">
                <button 
                    onClick={async () => {
                        toast.dismiss(t.id);
                        await fetch(`/api/tools/flashcards?id=${id}`, { method: 'DELETE' });
                        fetchDecks();
                        toast.success("Deck deleted");
                    }} 
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold"
                >
                    Yes, Delete
                </button>
                <button 
                    onClick={() => toast.dismiss(t.id)} 
                    className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-sm font-bold"
                >
                    Cancel
                </button>
            </div>
        </div>
      ), { duration: 4000, icon: <AlertTriangle className="text-red-500" /> });
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
                      <button onClick={(e) => confirmDelete(d.id, e)} className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-full"><Trash2 size={16}/></button>
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
                            <p className="2xl font-bold text-slate-800">{deck.cards[currentIndex].front}</p>
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
    if (!drugA || !drugB) {
        toast.error("Enter two drugs to check.");
        return;
    }
    setLoading(true);
    
    const promise = async () => {
        const prompt = `Analyze interaction between ${drugA} and ${drugB}. JSON { severity, mechanism, recommendation, summary }`;
        const res = await callGemini(prompt, PHARMA_INTERACTION_SCHEMA, FEATURE_MODELS.pharma);
        setResult(res);
        setViewHistory(false);
        return res;
    };

    toast.promise(promise(), {
        loading: 'Checking safety database...',
        success: 'Analysis complete',
        error: 'Analysis failed'
    });

    try { await promise(); } catch(e) {}
    setLoading(false);
  };

  const saveResult = async () => {
      if(!result) return;
      const promise = fetch('/api/tools/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolType: 'pharma', title: `${drugA} + ${drugB}`, data: result })
      }).then(() => fetchHistory());

      toast.promise(promise, {
          loading: 'Saving...',
          success: 'Saved to history',
          error: 'Save failed'
      });
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
    if (!values) {
        toast.error("Please enter lab values.");
        return;
    }
    setLoading(true);
    
    const promise = async () => {
        const prompt = `Interpret these lab values: "${values}". JSON { interpretation, differentials:[], nextSteps:[], severity }`;
        const res = await callGemini(prompt, LAB_REPORT_SCHEMA, FEATURE_MODELS.labs);
        setResult(res);
        setViewHistory(false);
        return res;
    };

    toast.promise(promise(), {
        loading: 'Interpreting data...',
        success: 'Report generated',
        error: 'Interpretation failed'
    });

    try { await promise(); } catch (e) {}
    setLoading(false);
  };

  const saveResult = async () => {
      if(!result) return;
      const promise = fetch('/api/tools/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolType: 'labs', title: values.substring(0, 20) + '...', data: result })
      }).then(() => fetchHistory());

      toast.promise(promise, {
          loading: 'Saving report...',
          success: 'Report saved',
          error: 'Save failed'
      });
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

  // --- TTS Function (Using Gemini TTS API) ---
  const speakQuestion = async (text) => {
    if (!text || loading) return;
    
    // Using Aoede voice (calm female voice)
    const voiceName = "Aoede"; 
    
    const payload = {
        contents: [{ parts: [{ text }] }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName }
                }
            }
        },
        model: "gemini-2.5-flash-preview-tts"
    };

    try {
        const apiKey = ""; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error("TTS API failed");

        const result = await response.json();
        const part = result?.candidates?.[0]?.content?.parts?.[0];
        const audioData = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType;

        if (audioData && mimeType && mimeType.startsWith("audio/")) {
            // Helper to convert PCM to WAV (necessary for raw audio)
            const base64ToArrayBuffer = (base64) => {
                const binaryString = atob(base64);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return bytes.buffer;
            };

            const pcmToWav = (pcm16, sampleRate = 24000) => {
                const buffer = new ArrayBuffer(44 + pcm16.length * 2);
                const view = new DataView(buffer);
                
                // WAV header
                const writeString = (v, offset) => { for (let i = 0; i < v.length; i++) view.setUint8(offset + i, v.charCodeAt(i)); };
                writeString('RIFF', 0);
                view.setUint32(4, 36 + pcm16.length * 2, true);
                writeString('WAVE', 8);
                view.setUint32(16, 16, true);
                view.setUint16(20, 1, true); // PCM format
                view.setUint16(22, 1, true); // Mono
                view.setUint32(24, sampleRate, true);
                view.setUint32(28, sampleRate * 2, true);
                view.setUint16(32, 2, true);
                view.setUint16(34, 16, true);
                writeString('data', 36);
                view.setUint32(40, pcm16.length * 2, true);

                // Write PCM data
                let offset = 44;
                for (let i = 0; i < pcm16.length; i++, offset += 2) {
                    view.setInt16(offset, pcm16[i], true);
                }
                
                return new Blob([view], { type: 'audio/wav' });
            };
            
            const sampleRateMatch = mimeType.match(/rate=(\d+)/);
            const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 24000;
            const pcmData = base64ToArrayBuffer(audioData);
            const pcm16 = new Int16Array(pcmData);
            const wavBlob = pcmToWav(pcm16, sampleRate);
            
            const audioUrl = URL.createObjectURL(wavBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        } else {
             console.error("TTS output format error:", mimeType);
        }
    } catch(error) {
        console.error("TTS playback error:", error);
        toast.error("TTS Audio failed to play");
    }
  };
  
  const startViva = async () => {
    setActive(true);
    setLoading(true);
    const prompt = `Act as a strict medical professor. Ask a viva question about ${topic}. The tone should be formal and demanding. Short question.`;
    
    try {
        const text = await callGemini(prompt, null, FEATURE_MODELS.osce);
        setCurrentQ(text);
        setLoading(false);
        speakQuestion(text);
    } catch(e) {
        toast.error("Could not start exam.");
        setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAns) return;
    setLoading(true);
    const prompt = `Professor asked: "${currentQ}". Student answered: "${userAns}". Grade it (0-10), give feedback, better answer, and next question. JSON.`;
    
    try {
        const res = await callGemini(prompt, VIVA_EVALUATION_SCHEMA, FEATURE_MODELS.osce);
        setEvaluation(res);
        setCurrentQ(res.nextQuestion);
        setLoading(false);
        setUserAns('');
        
        // Play audio response
        const audioText = `Your score is ${res.score} out of 10. ${res.feedback} The next question is: ${res.nextQuestion}`;
        speakQuestion(audioText);
    } catch(e) {
        toast.error("Error evaluating answer.");
        setLoading(false);
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
                 <button onClick={() => speakQuestion(currentQ)} className="absolute -top-3 -left-3 bg-teal-500 p-2 rounded-full border-4 border-white hover:scale-110 transition-transform"><Volume2 size={20} className="text-white"/></button>
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

// --- 5. SYMPTOM CHECKER ---
const SymptomCheckerView = () => {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const analyzeSymptoms = async () => {
        if (!symptoms) return;
        setLoading(true);
        setResult(null);

        const promise = async () => {
            const prompt = `Analyze the following patient symptoms from an Indian perspective: "${symptoms}". Act as a primary care doctor. Provide a primary likely diagnosis, immediate caution flags, an appropriate modern OTC medication or class (e.g., Paracetamol), specific home remedies (Ayurvedic/Desi tips like tulsi tea, hot compresses, etc.), and clear advice on when to see a doctor. JSON output.`;
            return await callGemini(prompt, SYMPTOM_CHECKER_SCHEMA, FEATURE_MODELS.symptom_checker);
        };

        toast.promise(promise(), {
            loading: 'Consulting AI Doctor...',
            success: (res) => {
                setResult(res);
                return 'Analysis Complete';
            },
            error: 'Analysis failed'
        });

        try { await promise(); } catch (e) {}
        setLoading(false);
    };

    return (
        <div className="h-full flex flex-col max-w-2xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <div><h3 className="text-xl font-bold mb-1 text-slate-900">Home Symptom Analyzer</h3><p className="text-slate-500 text-sm">Get quick advice for common ailments.</p></div>
            </div>

            <textarea 
                className="w-full h-32 border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none resize-none mb-4 text-sm" 
                placeholder="Describe your symptoms (e.g., 'I have a headache, feeling dizzy, and mild fever for 2 days')" 
                value={symptoms} 
                onChange={(e) => setSymptoms(e.target.value)}
            />
            <button onClick={analyzeSymptoms} disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 shadow-md flex items-center justify-center gap-2">
                {loading ? 'Consulting AI...' : 'Get Advice'} <Home size={18}/>
            </button>

            {result && (
                <div className="mt-6 space-y-4 animate-in slide-in-from-bottom-4 relative w-full">
                    <div className="p-5 bg-white rounded-2xl border border-red-100 shadow-md">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Primary Assessment</span>
                        </div>
                        <h4 className="font-black text-2xl text-slate-900 mb-4">{result.primaryDiagnosis}</h4>
                        
                        {/* Caution Flag */}
                        {result.cautionFlag && (
                             <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg mb-4 text-sm text-red-800 flex items-center gap-2 font-medium">
                                <AlertTriangle size={16}/> {result.cautionFlag}
                             </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Modern Medicine */}
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide flex items-center gap-1"><Pill size={12}/> Modern OTC Advice</span>
                                <p className="text-sm text-slate-800 mt-1 font-medium">{result.modernMedication}</p>
                            </div>

                            {/* Home Remedy */}
                            <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                                <span className="text-xs font-bold text-green-700 uppercase tracking-wide flex items-center gap-1"><Home size={12}/> Desi/Home Remedy</span>
                                <p className="text-sm text-green-900 mt-1 font-medium">{result.homeRemedy}</p>
                            </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1"><Thermometer size={12}/> When to See a Doctor</span>
                            <p className="text-sm text-amber-900 mt-1 font-medium">{result.whenToSeeDoctor}</p>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};


// --- 6. RADIOLOGY SPOTTER (Advanced Implementation) ---
const RadiologyView = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [stats, setStats] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [aiReport, setAiReport] = useState(null);
    const [viewMode, setViewMode] = useState('original'); // 'original' | 'edge'

    // Refs for Computer Vision
    const canvasRef = useRef(null);
    const edgeCanvasRef = useRef(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            setStats(null);
            setAiReport(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const handleFile = (f) => {
        if (f) {
            setFile(f);
            setAiReport(null);
            setStats(null);
            setViewMode('original');
            toast.success("Image uploaded");
        }
    }

    // 1. CLIENT-SIDE COMPUTER VISION (Tech Scan)
    const runTechScan = async () => {
        if (!preview) {
            toast.error("Upload an image first.");
            return;
        }
        setAnalyzing(true);
        
        try {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = preview;
            await new Promise(r => img.onload = r);

            const cw = Math.min(800, img.width);
            const ch = Math.round(img.height * (cw / img.width));

            // Draw Original
            const canvas = canvasRef.current;
            canvas.width = cw;
            canvas.height = ch;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, cw, ch);

            // Processing (Grayscale + Sobel Edge)
            const id = ctx.getImageData(0, 0, cw, ch);
            const data = id.data;
            const gray = new Uint8ClampedArray(cw * ch);
            let sum = 0;

            for (let i = 0; i < data.length; i += 4) {
                const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                gray[i / 4] = lum;
                sum += lum;
            }
            const mean = Math.round(sum / (cw * ch));

            // Draw Edge View
            const edgeCanvas = edgeCanvasRef.current;
            edgeCanvas.width = cw;
            edgeCanvas.height = ch;
            const ectx = edgeCanvas.getContext('2d');
            const edgeImg = ectx.createImageData(cw, ch);
            
            // Simple Edge Detection Loop
            for (let y = 1; y < ch - 1; y++) {
               for (let x = 1; x < cw - 1; x++) {
                   const i = y * cw + x;
                   // Horizontal gradient (simplified)
                   const gx = -gray[i-1] + gray[i+1];
                   const gy = -gray[i-cw] + gray[i+cw];
                   const val = Math.sqrt(gx*gx + gy*gy) * 4; // Boost contrast
                   const clamp = Math.min(255, val);
                   edgeImg.data[i*4] = clamp; 
                   edgeImg.data[i*4+1] = clamp; 
                   edgeImg.data[i*4+2] = clamp; 
                   edgeImg.data[i*4+3] = 255;
               }
            }
            ectx.putImageData(edgeImg, 0, 0);

            // Save Stats
            setStats({
                meanIntensity: mean,
                dimensions: `${cw}x${ch}`,
                contrast: mean > 128 ? 'High Key' : 'Low Key'
            });
            setViewMode('edge'); // Switch view to show the result
            
            // Replaced Alert with Toast
            toast.success('Tech Scan Complete!', {
                icon: '🔍',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                description: 'Now click "Get Diagnosis"'
            });

        } catch (e) {
            console.error(e);
            toast.error("Scan failed.");
        }
        setAnalyzing(false);
    };

    // 2. SERVER-SIDE AI (Clinical Diagnosis)
    const generateClinicalReport = async () => {
        if (!stats) {
            toast.error('Run Tech Scan first.');
            return;
        }
        setAiReport(null);
        setAnalyzing(true);
        
        const promise = async () => {
            const prompt = `Act as a Senior Radiologist. Analyze X-ray with stats: ${JSON.stringify(stats)}.
            Output Markdown formatted report:
            ### 1. Introduction
            Modality, Region, View.
            ### 2. Observations
            Systematic ABCDE approach.
            ### 3. Diagnosis
            Most likely diagnosis + 2 differentials.
            ### 4. Viva Corner
            3 short high-yield exam questions.
            
            **Important:** If a specific pathology is diagnosed (e.g., Pneumothorax, Pneumonia, Fracture), insert a relevant diagram tag on its own line like 
            
            
            or 
            
            
            .`;
    
            const res = await callGemini(prompt, null, FEATURE_MODELS.radiology || FEATURE_MODELS.default);
            setAiReport(typeof res === 'string' ? res : JSON.stringify(res));
            return res;
        };

        toast.promise(promise(), {
            loading: 'Radiologist analyzing image...',
            success: 'Diagnosis Report Ready',
            error: 'Report generation failed'
        });

        try { await promise(); } catch(e) {}
        setAnalyzing(false);
    };

    return (
        <div className="h-full w-full max-w-5xl mx-auto flex flex-col gap-6">
            <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                <div>
                    <h3 className="font-black text-2xl text-slate-900">Radiology Spotter</h3>
                    <p className="text-sm text-slate-500 font-medium">Digital Scan & AI Diagnosis.</p>
                </div>
                <div className="flex gap-2">
                   <input type="file" id="rad-upload" accept="image/*" onChange={(e)=>handleFile(e.target.files?.[0])} className="hidden"/>
                   <label htmlFor="rad-upload" className="cursor-pointer bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
                       <Upload size={16}/> Upload Scan
                   </label>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
                {/* LEFT: Image Viewer */}
                <div className="lg:col-span-2 bg-black rounded-3xl overflow-hidden relative shadow-2xl flex flex-col">
                    {/* Toolbar */}
                    <div className="bg-slate-900/80 backdrop-blur-md p-3 flex justify-between items-center absolute top-0 w-full z-20 border-b border-white/10">
                        <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                            <button onClick={() => setViewMode('original')} disabled={!preview} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'original' ? 'bg-white text-black' : 'text-slate-400'}`}>
                                <Eye size={14} className="inline mr-1"/> Original
                            </button>
                            <button onClick={() => setViewMode('edge')} disabled={!stats} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'edge' ? 'bg-teal-500 text-white' : 'text-slate-400'}`}>
                                <ScanLine size={14} className="inline mr-1"/> Edge View
                            </button>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={runTechScan} disabled={!preview || analyzing} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold disabled:opacity-50 flex items-center gap-2 transition-colors">
                                 {analyzing && !stats ? <Loader2 className="animate-spin" size={14}/> : <Activity size={14}/>} 1. Run Tech Scan
                             </button>
                             <button onClick={generateClinicalReport} disabled={!stats || analyzing} className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold disabled:opacity-50 flex items-center gap-2 transition-colors">
                                 {analyzing && stats ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>} 2. Get Diagnosis
                             </button>
                        </div>
                    </div>

                    {/* Canvas Layers */}
                    <div className="flex-1 flex items-center justify-center relative bg-gray-900 min-h-[400px]">
                        {!preview && <div className="text-slate-500 text-sm font-medium flex flex-col items-center gap-2"><ImageIcon size={48} className="opacity-20"/>Upload an X-Ray to begin</div>}
                        
                        {/* Original Image Layer */}
                        {preview && (
                            <img src={preview} alt="Original" className={`max-h-[65vh] object-contain transition-opacity duration-500 absolute ${viewMode === 'original' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} />
                        )}
                        
                        {/* Edge Detection Layer (Canvas) */}
                        <canvas ref={edgeCanvasRef} className={`max-h-[65vh] object-contain transition-opacity duration-500 absolute ${viewMode === 'edge' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} />
                        
                        {/* Hidden Canvas for Processing */}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                </div>

                {/* RIGHT: Report */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-full max-h-[80vh]">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <Stethoscope size={18} className="text-teal-600"/>
                        <h4 className="font-black text-slate-800 text-sm uppercase tracking-wide">Clinical Report</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
                        {!aiReport ? (
                            <div className="text-center py-12 text-slate-400">
                                {stats ? (
                                    <div className="space-y-2 animate-in fade-in">
                                        <CheckCircle2 size={40} className="mx-auto text-teal-500 mb-2"/>
                                        <p className="font-bold text-slate-700">Tech Scan Complete</p>
                                        <div className="text-xs bg-slate-50 p-3 rounded-xl inline-block text-left space-y-1 border border-slate-100">
                                          <div>DIM: <span className="font-mono text-slate-900">{stats.dimensions}</span></div>
                                          <div>INT: <span className="font-mono text-slate-900">{stats.meanIntensity}</span></div>
                                          <div>CON: <span className="font-mono text-slate-900">{stats.contrast}</span></div>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-4">Click "Get Diagnosis" for AI report.</p>
                                    </div>
                                ) : <p className="text-sm">No data generated yet.</p>}
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-bottom-4">
                                {renderMarkdown(aiReport)}
                            </div>
                        )}
                    </div>
                </div>
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
    { id: 'symptom_checker', icon: Home, label: 'Home Check', desc: 'Desi Remedies' },
    { id: 'viva', icon: Mic, label: 'Viva Voice', desc: 'Oral Exam' },
    { id: 'radiology', icon: ImageIcon, label: 'Radiology', desc: 'X-Ray Sim' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24">
      {/* Toast Container */}
      <Toaster 
        position="bottom-right" 
        toastOptions={{
            style: {
                background: '#334155',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
            },
            success: {
                iconTheme: {
                    primary: '#2dd4bf',
                    secondary: '#fff',
                },
            },
        }}
      />
      
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
            {activeTool === 'symptom_checker' && <SymptomCheckerView />}
        </div>
      </div>
    </div>
  );
}
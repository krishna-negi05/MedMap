'use client';
import { useState, useEffect } from 'react';
import { Search, Brain, X, CheckCircle2, GraduationCap, Save, FolderOpen, Trash2, Loader2, Clock } from 'lucide-react';
import { callGemini } from '../../lib/gemini';
import MindmapNode from '../../components/MindmapNode';

// Schema for structured JSON output
const MINDMAP_SCHEMA = { 
  type: "OBJECT", 
  properties: { 
    id: { type: "STRING" }, 
    label: { type: "STRING" }, 
    summary: { type: "STRING" }, 
    type: { type: "STRING", enum: ["root", "concept", "subtopic"] }, 
    examPoints: { type: "ARRAY", items: { type: "STRING" } }, 
    children: { 
      type: "ARRAY", 
      items: { 
        type: "OBJECT", 
        properties: { 
          id: { type: "STRING" }, 
          label: { type: "STRING" }, 
          summary: { type: "STRING" }, 
          type: { type: "STRING" }, 
          examPoints: { type: "ARRAY", items: { type: "STRING" } }, 
          children: { type: "ARRAY", items: { type: "OBJECT" } } 
        } 
      } 
    } 
  } 
};

// Fallback data
const MOCK_MINDMAP = { 
  id: 'root', 
  label: 'Cardiac Cycle', 
  summary: 'Performance of the human heart from the beginning of one heartbeat to the beginning of the next.', 
  type: 'root', 
  children: [
    { id: 'systole', label: 'Systole', type: 'concept', summary: 'Contraction phase', children: [] }, 
    { id: 'diastole', label: 'Diastole', type: 'concept', summary: 'Relaxation phase', children: [] }
  ] 
};

export default function MindmapPage() {
  const [search, setSearch] = useState('');
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  
  // New State for Saving/Loading
  const [savedMaps, setSavedMaps] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load saved maps on mount
  useEffect(() => {
    refreshSavedMaps();
  }, []);

  const refreshSavedMaps = async () => {
    try {
      const res = await fetch('/api/mindmap');
      const json = await res.json();
      if (json.ok) setSavedMaps(json.data);
    } catch (e) { console.error("Fetch error", e); }
  };

  const handleGenerate = async () => {
    if (!search) return;
    setGenerating(true);
    try {
      const prompt = `Generate a highly detailed, hierarchical medical mindmap for: "${search}". JSON Output according to schema.`;
      const res = await callGemini(prompt, MINDMAP_SCHEMA);
      setData(res);
      setSelectedNode(res);
      setShowHistory(false); // Close history panel if open
    } catch (err) {
      console.error("Generation failed, using mock data:", err);
      setData(MOCK_MINDMAP);
      setSelectedNode(MOCK_MINDMAP);
      alert("AI Generation failed. Loaded Mock Data.");
    }
    setGenerating(false);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch('/api/mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: search || data.label, data: data })
      });
      if (res.ok) {
        await refreshSavedMaps();
        alert('Mindmap saved successfully!');
      }
    } catch (e) { alert('Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if(!confirm("Delete this mindmap?")) return;
    try {
        await fetch(`/api/mindmap?id=${id}`, { method: 'DELETE' });
        refreshSavedMaps();
    } catch(e) { alert("Delete failed"); }
  };

  const loadMap = (map) => {
    setData(map.data);
    setSearch(map.topic);
    setSelectedNode(map.data);
    setShowHistory(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50/50 relative">
      {/* Search Bar Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b p-4 shadow-sm z-10 sticky top-0">
        <div className="max-w-4xl mx-auto flex gap-3">
           <div className="relative flex-1 group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
             </div>
             <input 
                type="text" 
                className="block w-full pl-10 border border-slate-200 rounded-xl py-2.5 outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-inner bg-slate-50 focus:bg-white" 
                placeholder="Enter topic (e.g., Dengue)" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
             />
           </div>
           
           {/* Action Buttons */}
           <div className="flex gap-2">
                <button 
                    onClick={handleGenerate} 
                    disabled={generating} 
                    className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                >
                {generating ? <Loader2 className="animate-spin w-4 h-4"/> : 'Generate'}
                </button>

                {/* Save Button */}
                {data && (
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-teal-100 text-teal-700 px-4 py-2 rounded-xl font-bold hover:bg-teal-200 transition-colors flex items-center gap-2"
                        title="Save to Account"
                    >
                        {saving ? <Loader2 className="animate-spin w-4 h-4"/> : <Save size={18}/>}
                    </button>
                )}

                {/* History Toggle */}
                <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className={`px-4 py-2 rounded-xl font-bold border transition-all flex items-center gap-2 ${showHistory ? 'bg-slate-200 border-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                    title="Saved Maps"
                >
                    <FolderOpen size={18} className="text-slate-600"/>
                </button>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Empty State */}
        {!data && !generating && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center">
                    <Brain size={48} className="mb-4 text-teal-500 opacity-80"/>
                    <p className="font-medium">Enter a topic to generate a study map.</p>
                    {savedMaps.length > 0 && (
                        <p className="text-xs text-slate-400 mt-2">Or open <span className="font-bold cursor-pointer hover:text-teal-600" onClick={() => setShowHistory(true)}>Saved Maps</span></p>
                    )}
                </div>
            </div>
        )}

        {/* Loading State */}
        {generating && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-teal-500"></div>
                    <p className="text-slate-500 font-medium animate-pulse">AI is thinking...</p>
                </div>
            </div>
        )}

        {/* Saved Maps Dropdown Panel */}
        {showHistory && (
            <div className="absolute top-0 right-0 md:right-8 z-30 w-full md:w-80 h-full md:h-auto md:max-h-[500px] bg-white shadow-2xl border border-slate-200 rounded-b-xl md:rounded-xl overflow-hidden flex flex-col animate-in slide-in-from-top-2">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2"><FolderOpen size={16}/> My Library</h3>
                    <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                    {savedMaps.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">No saved maps yet.</div>
                    ) : (
                        savedMaps.map(map => (
                            <div key={map.id} onClick={() => loadMap(map)} className="group flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex flex-col overflow-hidden">
                                    <span className="font-bold text-slate-800 truncate">{map.topic}</span>
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <Clock size={10}/> {new Date(map.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <button 
                                    onClick={(e) => handleDelete(map.id, e)} 
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 size={14}/>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* Mindmap Render */}
        {data && (
            <div className="flex-1 overflow-auto p-8 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
                <MindmapNode 
                    node={data} 
                    depth={0} 
                    onSelect={setSelectedNode} 
                    selectedId={selectedNode?.id}
                />
            </div>
        )}

        {/* Sidebar Details Panel */}
        <div className={`w-full md:w-[400px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-20 ${selectedNode ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'} transition-transform duration-300 fixed md:relative bottom-[58px] md:bottom-0 md:inset-y-0 h-[60vh] md:h-auto rounded-t-3xl md:rounded-none`}>
           {selectedNode && (
             <div className="p-6 flex flex-col h-full overflow-y-auto bg-white">
               <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="inline-block px-2 py-1 bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-wider rounded-md mb-1">{selectedNode.type}</span>
                        <h3 className="font-bold text-2xl text-slate-900 leading-tight">{selectedNode.label}</h3>
                    </div>
                    <button onClick={()=>setSelectedNode(null)} className="bg-slate-50 p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20}/>
                    </button>
               </div>
               
               <p className="text-slate-600 mb-6 text-[15px] leading-relaxed">{selectedNode.summary}</p>
               
               {selectedNode.examPoints && selectedNode.examPoints.length > 0 && (
                   <div className="bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-100">
                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-900">
                            <GraduationCap size={16}/> High Yield
                        </h4>
                        <ul className="space-y-2">
                            {selectedNode.examPoints.map((p, idx) => (
                                <li key={idx} className="text-sm flex gap-2 items-start">
                                    <CheckCircle2 size={14} className="text-teal-500 mt-0.5 shrink-0"/>
                                    <span className="text-slate-700">{p}</span>
                                </li>
                            ))}
                        </ul>
                   </div>
               )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
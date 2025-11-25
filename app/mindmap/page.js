'use client';
import { useState, useEffect } from 'react';
import { Search, Brain, X, CheckCircle2, GraduationCap, Save, FolderOpen, Trash2, Loader2, Clock, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { callGemini } from '../../lib/gemini';
import MindmapNode from '../../components/MindmapNode';
import { FEATURE_MODELS } from '../../lib/ai-config'; 

// ... (Keep your MINDMAP_SCHEMA and MOCK_MINDMAP constants exactly as they are) ...
const MINDMAP_SCHEMA = { type: "OBJECT", properties: { id: { type: "STRING" }, label: { type: "STRING" }, summary: { type: "STRING" }, type: { type: "STRING", enum: ["root", "concept", "subtopic"] }, examPoints: { type: "ARRAY", items: { type: "STRING" } }, children: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "STRING" }, label: { type: "STRING" }, summary: { type: "STRING" }, type: { type: "STRING" }, examPoints: { type: "ARRAY", items: { type: "STRING" } }, children: { type: "ARRAY", items: { type: "OBJECT" } } } } } } };
const MOCK_MINDMAP = { id: 'root', label: 'Cardiac Cycle', summary: 'Performance of the human heart from the beginning of one heartbeat to the beginning of the next.', type: 'root', children: [ { id: 'systole', label: 'Systole', type: 'concept', summary: 'Contraction phase', children: [] }, { id: 'diastole', label: 'Diastole', type: 'concept', summary: 'Relaxation phase', children: [] } ] };

export default function MindmapPage() {
  const [search, setSearch] = useState('');
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  
  const [savedMaps, setSavedMaps] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Zoom State
  const [zoom, setZoom] = useState(1);

  useEffect(() => { refreshSavedMaps(); }, []);

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
      const res = await callGemini(prompt, MINDMAP_SCHEMA, FEATURE_MODELS.mindmap);
      setData(res);
      setSelectedNode(res);
      setShowHistory(false);
      setZoom(1); // Reset zoom on new generation
    } catch (err) {
      console.error("Generation failed", err);
      setData(MOCK_MINDMAP);
      setSelectedNode(MOCK_MINDMAP);
      alert("AI Generation failed. Loaded Mock Data.");
    }
    setGenerating(false);
  };

  const handleSave = async () => { if (!data) return; setSaving(true); try { const res = await fetch('/api/mindmap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: search || data.label, data: data }) }); if (res.ok) { await refreshSavedMaps(); alert('Mindmap saved successfully!'); } } catch (e) { alert('Failed to save'); } setSaving(false); };
  const handleDelete = async (id, e) => { e.stopPropagation(); if(!confirm("Delete this mindmap?")) return; try { await fetch(`/api/mindmap?id=${id}`, { method: 'DELETE' }); refreshSavedMaps(); } catch(e) { alert("Delete failed"); } };
  const loadMap = (map) => { setData(map.data); setSearch(map.topic); setSelectedNode(map.data); setShowHistory(false); setZoom(1); };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 relative overflow-hidden">
      {/* Search Bar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 p-4 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto flex gap-3">
           <div className="relative flex-1 group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
             </div>
             <input 
                type="text" 
                className="block w-full pl-10 border border-slate-200 rounded-xl py-3 outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-sm bg-slate-50 focus:bg-white font-medium" 
                placeholder="Enter topic (e.g., Cranial Nerves)" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
             />
           </div>
           <div className="flex gap-2">
                <button onClick={handleGenerate} disabled={generating} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2">
                    {generating ? <Loader2 className="animate-spin w-4 h-4"/> : 'Generate'}
                </button>
                {data && (
                    <button onClick={handleSave} disabled={saving} className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-2 rounded-xl font-bold hover:bg-teal-100 transition-colors flex items-center gap-2">
                        {saving ? <Loader2 className="animate-spin w-4 h-4"/> : <Save size={18}/>}
                    </button>
                )}
                <button onClick={() => setShowHistory(!showHistory)} className={`px-4 py-2 rounded-xl font-bold border transition-all flex items-center gap-2 ${showHistory ? 'bg-slate-200 border-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                    <FolderOpen size={18} className="text-slate-600"/>
                </button>
           </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Empty State */}
        {!data && !generating && (
            <div className="absolute inset-0 flex items-center justify-center flex-col bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
                <div className="bg-white p-10 rounded-[2rem] shadow-2xl border border-white/50 flex flex-col items-center max-w-md text-center backdrop-blur-sm">
                    <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                        <Brain size={40} className="text-teal-600"/>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Visual Study Assistant</h3>
                    <p className="text-slate-500 mb-6">Enter a medical topic to generate a comprehensive, structured mindmap instantly.</p>
                    {savedMaps.length > 0 && (
                        <button onClick={() => setShowHistory(true)} className="text-sm font-bold text-teal-600 hover:underline flex items-center gap-1">
                            Open Saved Maps <FolderOpen size={14}/>
                        </button>
                    )}
                </div>
            </div>
        )}

        {/* Loading State */}
        {generating && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-30 backdrop-blur-md">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-teal-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                        <Brain size={24} className="text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"/>
                    </div>
                    <p className="text-slate-600 font-bold animate-pulse">Constructing knowledge graph...</p>
                </div>
            </div>
        )}

        {/* History Sidebar */}
        {showHistory && (
            <div className="absolute top-0 right-0 bottom-0 z-40 w-80 bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right-10">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen size={18} className="text-teal-600"/> Library</h3>
                    <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <div className="overflow-y-auto flex-1 p-3 space-y-2">
                    {savedMaps.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">No maps yet.</div>
                    ) : (
                        savedMaps.map(map => (
                            <div key={map.id} onClick={() => loadMap(map)} className="group p-4 rounded-xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50 cursor-pointer transition-all bg-white shadow-sm hover:shadow-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-slate-800 line-clamp-1">{map.topic}</div>
                                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Clock size={10}/> {new Date(map.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <button onClick={(e) => handleDelete(map.id, e)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* Mindmap Canvas */}
        {data && (
            <div className="flex-1 relative overflow-hidden bg-slate-50">
                {/* Zoom Controls */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
                    <button onClick={() => setZoom(Math.min(zoom + 0.1, 2))} className="p-3 bg-white rounded-xl shadow-lg border border-slate-100 hover:bg-slate-50 text-slate-600"><ZoomIn size={20}/></button>
                    <button onClick={() => setZoom(1)} className="p-3 bg-white rounded-xl shadow-lg border border-slate-100 hover:bg-slate-50 text-slate-600"><Maximize size={20}/></button>
                    <button onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))} className="p-3 bg-white rounded-xl shadow-lg border border-slate-100 hover:bg-slate-50 text-slate-600"><ZoomOut size={20}/></button>
                </div>

                {/* Scrollable Container */}
                <div className="absolute inset-0 overflow-auto p-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px]">
                    <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.2s ease-out' }} className="min-w-fit pb-96 pr-96">
                        <MindmapNode 
                            node={data} 
                            depth={0} 
                            onSelect={setSelectedNode} 
                            selectedId={selectedNode?.id} // 👈 FIXED THIS LINE
                        />
                    </div>
                </div>
            </div>
        )}

        {/* Details Sidebar (Slide-in) */}
        <div className={`fixed md:absolute inset-y-0 right-0 w-full md:w-[400px] bg-white/95 backdrop-blur-xl border-l border-slate-200 shadow-2xl z-30 transform transition-transform duration-300 ease-out ${selectedNode ? 'translate-x-0' : 'translate-x-full'}`}>
           {selectedNode && (
             <div className="h-full flex flex-col">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-100 text-teal-700 text-[10px] font-extrabold uppercase tracking-wider rounded-md border border-teal-200">
                            <Brain size={12}/> {selectedNode.type}
                        </span>
                        <button onClick={()=>setSelectedNode(null)} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"><X size={20}/></button>
                    </div>
                    <h3 className="font-extrabold text-3xl text-slate-900 leading-tight mt-2">{selectedNode.label}</h3>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                   <div>
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Summary</h4>
                       <p className="text-slate-700 text-lg leading-relaxed">{selectedNode.summary || "No summary available for this node."}</p>
                   </div>
                   
                   {selectedNode.examPoints && selectedNode.examPoints.length > 0 && (
                       <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                            <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-amber-900">
                                <GraduationCap size={18} className="text-amber-600"/> High-Yield Exam Points
                            </h4>
                            <ul className="space-y-3">
                                {selectedNode.examPoints.map((p, idx) => (
                                    <li key={idx} className="text-sm flex gap-3 items-start text-amber-900/80">
                                        <CheckCircle2 size={16} className="text-amber-500 mt-0.5 shrink-0"/>
                                        <span className="font-medium">{p}</span>
                                    </li>
                                ))}
                            </ul>
                       </div>
                   )}
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
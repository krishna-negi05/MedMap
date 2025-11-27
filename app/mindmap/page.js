'use client';
import { useState, useEffect } from 'react';
import { Search, Brain, X, CheckCircle2, GraduationCap, Save, FolderOpen, Trash2, Loader2, Clock, ZoomIn, ZoomOut, Maximize, Activity, Sparkles, FileText, ChevronRight, Dna, Microscope } from 'lucide-react';
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

  // Include custom CSS for biological animations
  const customStyles = `
    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-float-slow { animation: float 8s ease-in-out infinite; }
    .animate-float-medium { animation: float 6s ease-in-out infinite; }
    .animate-float-fast { animation: float 4s ease-in-out infinite; }
    .animate-blob { animation: blob 15s infinite ease-in-out alternate; }
  `;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 relative overflow-hidden font-sans selection:bg-cyan-100 selection:text-cyan-900">
      <style>{customStyles}</style>

      {/* --- Biological Background Layer --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large gradient blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-cyan-200/30 rounded-full blur-3xl opacity-50 animate-blob mix-blend-multiply"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-teal-200/30 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000 mix-blend-multiply"></div>
          <div className="absolute top-[40%] left-[30%] w-[25rem] h-[25rem] bg-indigo-200/30 rounded-full blur-3xl opacity-40 animate-blob animation-delay-4000 mix-blend-multiply"></div>

          {/* Floating Biological Icons */}
          {!data && (
            <>
              <Dna size={40} className="absolute top-20 left-[15%] text-cyan-600/20 animate-float-slow" />
              <Brain size={32} className="absolute bottom-32 left-[10%] text-teal-600/20 animate-float-medium" />
              <Microscope size={36} className="absolute top-40 right-[20%] text-indigo-600/20 animate-float-slow" />
              <Activity size={28} className="absolute bottom-20 right-[25%] text-cyan-600/20 animate-float-fast" />
              {/* Subtle cellular dots */}
              <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-[0.15]"></div>
            </>
          )}
      </div>
      
      {/* --- Medical Header / Search Bar --- */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-cyan-100/50 p-4 z-20 shadow-sm sticky top-0">
        <div className="max-w-6xl mx-auto flex gap-4 items-center">
           {/* Logo / Brand Indicator */}
           <div className="hidden md:flex items-center gap-2 text-cyan-900 font-bold tracking-tight opacity-80 pr-4 border-r border-slate-200/50">
             <Activity className="text-cyan-500" size={20} />
             <span>MedMap<span className="text-cyan-500">.ai</span></span>
           </div>

           <div className="relative flex-1 group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
             </div>
             <input 
                type="text" 
                className="block w-full pl-11 pr-4 border border-slate-200/60 rounded-full py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all shadow-sm bg-white/50 focus:bg-white text-slate-700 placeholder:text-slate-400 font-medium" 
                placeholder="Enter medical topic (e.g., Krebs Cycle, Cranial Nerves)..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
             />
           </div>

           <div className="flex gap-2">
                <button 
                    onClick={handleGenerate} 
                    disabled={generating} 
                    className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-900/10 hover:shadow-cyan-900/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2 border border-slate-700/50"
                >
                    {generating ? <Loader2 className="animate-spin w-4 h-4"/> : <><Sparkles size={16} className="text-cyan-300"/> Generate</>}
                </button>
                
                {data && (
                    <button onClick={handleSave} disabled={saving} className="bg-white/80 border border-slate-200/60 text-slate-600 px-4 py-2 rounded-full font-medium hover:bg-cyan-50/50 hover:text-cyan-700 hover:border-cyan-200 transition-all flex items-center gap-2 shadow-sm backdrop-blur-md">
                        {saving ? <Loader2 className="animate-spin w-4 h-4"/> : <Save size={18}/>}
                    </button>
                )}
                
                <button 
                    onClick={() => setShowHistory(!showHistory)} 
                    className={`px-4 py-2 rounded-full font-medium border transition-all flex items-center gap-2 shadow-sm backdrop-blur-md ${showHistory ? 'bg-cyan-100/80 border-cyan-300 text-cyan-800' : 'bg-white/80 border-slate-200/60 text-slate-600 hover:bg-slate-50/50'}`}
                >
                    <FolderOpen size={18} />
                </button>
           </div>
        </div>
      </div>

      {/* --- Main Canvas Area --- */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Empty State / Dashboard View */}
        {!data && !generating && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="relative bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-cyan-100/30 border border-white/50 flex flex-col items-center max-w-md text-center mx-4 transition-all hover:bg-white/70">
                    
                    {/* Floating Icon above card */}
                    <div className="absolute -top-12 animate-float-slow">
                        <div className="bg-gradient-to-br from-cyan-400 to-teal-500 p-4 rounded-2xl shadow-lg shadow-cyan-500/30">
                             <Brain size={36} className="text-white"/>
                        </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 mt-6 mb-2 tracking-tight">Medical Mindmap AI</h3>
                    
                    {/* Minimized Text */}
                    <p className="text-slate-500 text-sm mb-6 font-medium">Enter a topic to visualize clinical structures.</p>

                    {savedMaps.length > 0 && (
                        <div className="w-full bg-slate-50/50 rounded-2xl p-3 border border-slate-100/50">
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-left pl-1">Recent</div>
                            <div className="flex flex-col gap-2 w-full">
                                {savedMaps.slice(0, 2).map(map => (
                                    <button key={map.id} onClick={() => loadMap(map)} className="flex items-center gap-3 w-full p-2 rounded-xl bg-white border border-slate-200/50 hover:border-cyan-300/50 hover:shadow-sm transition-all group text-left">
                                        <div className="bg-cyan-50 p-1.5 rounded-lg text-cyan-600"><Activity size={14}/></div>
                                        <div className="flex-1 font-semibold text-slate-700 text-sm truncate">{map.topic}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Loading State with Biological Pulse */}
        {generating && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 z-30 backdrop-blur-lg">
                <div className="flex flex-col items-center justify-center">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* Organic pulsing rings */}
                        <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping opacity-75 duration-[3s]"></div>
                        <div className="absolute inset-2 bg-teal-400/20 rounded-full animate-ping opacity-75 delay-300 duration-[3s]"></div>
                        <div className="absolute inset-4 bg-indigo-400/20 rounded-full animate-ping opacity-75 delay-700 duration-[3s]"></div>
                        
                        {/* Central spinning element */}
                        <div className="relative bg-white p-4 rounded-full shadow-xl shadow-cyan-200/50 border-4 border-cyan-50 z-10">
                             <Loader2 size={32} className="text-cyan-600 animate-spin"/>
                        </div>
                    </div>
                    <p className="mt-8 text-cyan-900 font-bold text-lg animate-pulse">Synthesizing...</p>
                </div>
            </div>
        )}

        {/* Library / History Sidebar */}
        {showHistory && (
            <div className="absolute top-0 right-0 bottom-0 z-40 w-80 bg-white/90 backdrop-blur-xl shadow-2xl border-l border-slate-200/50 flex flex-col animate-in slide-in-from-right-10 duration-300">
                <div className="p-5 border-b border-slate-100/50 bg-slate-50/50">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <FolderOpen size={18} className="text-cyan-600"/> Library
                        </h3>
                        <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1 rounded-full transition-colors"><X size={18}/></button>
                    </div>
                </div>
                <div className="overflow-y-auto flex-1 p-3 space-y-2">
                    {savedMaps.map(map => (
                        <div key={map.id} onClick={() => loadMap(map)} className="group relative p-3 rounded-xl border border-white bg-white/80 shadow-sm hover:shadow-md hover:border-cyan-200/50 cursor-pointer transition-all">
                            <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-cyan-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex justify-between items-center pl-2">
                                <div className="font-bold text-slate-700 text-sm line-clamp-1 group-hover:text-cyan-700 transition-colors">{map.topic}</div>
                                <button onClick={(e) => handleDelete(map.id, e)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Mindmap Interactive Canvas */}
        {data && (
            <div className="flex-1 relative overflow-hidden">
                {/* Canvas Background Texture */}
                 <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none"></div>

                {/* Floating Zoom Controls */}
                <div className="absolute bottom-8 left-8 flex items-center gap-1 z-20 bg-white/80 backdrop-blur-md border border-slate-200/50 p-1 rounded-full shadow-lg shadow-slate-200/20">
                    <button onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))} className="p-2.5 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"><ZoomOut size={16}/></button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button onClick={() => setZoom(Math.min(zoom + 0.1, 2))} className="p-2.5 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"><ZoomIn size={16}/></button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button onClick={() => setZoom(1)} className="p-2.5 hover:bg-cyan-50 hover:text-cyan-600 rounded-full text-slate-600 transition-colors" title="Fit"><Maximize size={16}/></button>
                </div>

                {/* Infinite Canvas Container */}
                <div className="absolute inset-0 overflow-auto cursor-grab active:cursor-grabbing p-10 z-10">
                    <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)' }} className="min-w-fit pb-[500px] pr-[500px]">
                        <MindmapNode 
                            node={data} 
                            depth={0} 
                            onSelect={setSelectedNode} 
                            selectedId={selectedNode?.id} 
                        />
                    </div>
                </div>
            </div>
        )}

        {/* Clinical Details Sidebar (Slide-over) */}
        <div className={`fixed md:absolute inset-y-0 right-0 w-full md:w-[420px] bg-white/90 backdrop-blur-2xl border-l border-slate-200/50 shadow-2xl z-30 transform transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${selectedNode ? 'translate-x-0' : 'translate-x-full'}`}>
           {selectedNode && (
             <div className="h-full flex flex-col">
               {/* Sidebar Header */}
               <div className="px-6 py-5 border-b border-slate-100/50 bg-gradient-to-b from-white/50 to-slate-50/30">
                    <div className="flex justify-between items-center mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${selectedNode.type === 'root' ? 'bg-purple-100/80 text-purple-700 border-purple-200' : 'bg-cyan-100/80 text-cyan-700 border-cyan-200'}`}>
                            {selectedNode.type}
                        </span>
                        <button onClick={()=>setSelectedNode(null)} className="p-2 -mr-2 rounded-full hover:bg-slate-100/50 text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
                    </div>
                    <h3 className="font-extrabold text-2xl text-slate-900 leading-tight tracking-tight">{selectedNode.label}</h3>
               </div>
               
               {/* Sidebar Content */}
               <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                   
                   {/* Summary Section */}
                   <div>
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <FileText size={12}/> Clinical Summary
                       </h4>
                       <p className="text-slate-700 text-sm leading-6 font-medium bg-slate-50/80 p-4 rounded-2xl border border-slate-100/50">
                         {selectedNode.summary || "No summary available."}
                       </p>
                   </div>
                   
                   {/* High Yield Points (Prescription pad style) */}
                   {selectedNode.examPoints && selectedNode.examPoints.length > 0 && (
                       <div className="relative bg-amber-50/90 p-5 rounded-2xl border border-amber-200/50 shadow-sm">
                            <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-amber-800">
                                <GraduationCap size={16} className="text-amber-600"/> 
                                High-Yield Points
                            </h4>
                            <ul className="space-y-2 relative z-10">
                                {selectedNode.examPoints.map((p, idx) => (
                                    <li key={idx} className="text-sm flex gap-2 items-start text-amber-900 font-medium">
                                        <CheckCircle2 size={15} className="text-amber-500 mt-0.5 shrink-0"/>
                                        <span className="leading-tight">{p}</span>
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
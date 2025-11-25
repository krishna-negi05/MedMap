'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Search, Upload, Filter, FileText, 
  Download, User, Users, Loader2, X, Trash2, 
  TrendingUp, Eye, ExternalLink, Maximize2,
  MessageCircle, HelpCircle, Coffee, Hash,
  Bone, Activity, FlaskConical, Bug, Pill, Scale,
  Ear, Eye as EyeIcon, HeartPulse, Baby, Stethoscope,
  Scissors, Sparkles, Zap, Plus, ArrowUp, ArrowDown, Check, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- 🎨 SIDEBAR THEMES ---
const NAV_THEMES = {
  library: { 
    active: 'bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-lg', 
    hover: 'hover:bg-teal-50 hover:text-teal-700',
    icon: FileText
  },
  qa: { 
    active: 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-lg', 
    hover: 'hover:bg-violet-50 hover:text-violet-700',
    icon: HelpCircle
  },
  social: { 
    active: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg', 
    hover: 'hover:bg-amber-50 hover:text-amber-700',
    icon: Coffee
  },
  groups: { 
    active: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg', 
    hover: 'hover:bg-rose-50 hover:text-rose-700',
    icon: Hash
  }
};

// --- 🎨 SUBJECT THEMES ---
const THEMES = {
  'Anatomy': { color: 'rose', bg: 'from-rose-100 to-orange-100', text: 'text-rose-600', icon: Bone },
  'Physiology': { color: 'blue', bg: 'from-blue-100 to-indigo-100', text: 'text-blue-600', icon: Activity },
  'Biochemistry': { color: 'emerald', bg: 'from-emerald-100 to-teal-100', text: 'text-emerald-600', icon: FlaskConical },
  'Pathology': { color: 'purple', bg: 'from-fuchsia-100 to-purple-100', text: 'text-purple-600', icon: Bug },
  'Pharmacology': { color: 'cyan', bg: 'from-cyan-100 to-blue-100', text: 'text-cyan-600', icon: Pill },
  'Forensic Medicine': { color: 'slate', bg: 'from-slate-200 to-gray-300', text: 'text-slate-700', icon: Scale },
  'ENT': { color: 'amber', bg: 'from-amber-100 to-yellow-100', text: 'text-amber-600', icon: Ear },
  'Ophthalmology': { color: 'sky', bg: 'from-sky-100 to-blue-100', text: 'text-sky-600', icon: EyeIcon },
  'Community Medicine': { color: 'green', bg: 'from-green-100 to-emerald-100', text: 'text-green-600', icon: Users },
  'General Medicine': { color: 'indigo', bg: 'from-indigo-100 to-violet-100', text: 'text-indigo-600', icon: Stethoscope },
  'General Surgery': { color: 'red', bg: 'from-red-100 to-rose-100', text: 'text-red-600', icon: Scissors },
  'OBG': { color: 'pink', bg: 'from-pink-100 to-rose-100', text: 'text-pink-600', icon: Baby },
  'Pediatrics': { color: 'orange', bg: 'from-orange-100 to-amber-100', text: 'text-orange-600', icon: Baby },
  'Orthopaedics': { color: 'stone', bg: 'from-stone-200 to-zinc-200', text: 'text-stone-600', icon: Bone },
  'Default': { color: 'slate', bg: 'from-slate-100 to-gray-200', text: 'text-slate-500', icon: FileText }
};

// --- MAIN LAYOUT ---
export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('library');
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'library': return <LibraryView />;
      case 'qa': return <QAView />;
      case 'social': return <PlaceholderView title="Med Life" icon={Coffee} color="amber" desc="Discussions, Polls, and Rants (Reddit style)." />;
      case 'groups': return <PlaceholderView title="Study Groups" icon={Hash} color="rose" desc="Real-time chat rooms for specific topics." />;
      default: return <LibraryView />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-[calc(100vh-64px)] flex flex-col md:flex-row bg-gradient-to-b from-[#fbfdff] to-[#f6f9ff]">
      
      {/* MOBILE BUTTON */}
      <button onClick={() => setMobileOpen(true)} className="md:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-slate-200 text-slate-600">
        <Users size={20} />
      </button>

      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="hidden md:flex w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 p-6 flex-col gap-4 shrink-0 sticky top-16 h-[calc(100vh-64px)] z-40">
        <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* --- SIDEBAR (Mobile) --- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
           <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)}></div>
           <div className="relative w-72 bg-white h-full shadow-2xl p-6 flex flex-col gap-4">
              <div className="flex justify-end"><button onClick={() => setMobileOpen(false)}><X size={24}/></button></div>
              <SidebarContent activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setMobileOpen(false); }} />
           </div>
        </div>
      )}

      {/* --- CONTENT --- */}
      <main className="flex-1 p-4 md:p-8 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}

function SidebarContent({ activeTab, setActiveTab }) {
  return (
    <>
      <div className="mb-2 px-2 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
          <Users size={20} />
        </div>
        <div className="leading-tight">
          <h2 className="font-extrabold text-xl tracking-tight text-slate-900">Community</h2>
          <p className="text-xs text-slate-400 uppercase font-semibold">Hub • Resources</p>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <NavButton id="library" label="Library" active={activeTab} onClick={setActiveTab} hint="Notes, PDFs & diagrams" />
        <NavButton id="qa" label="Q&A Forum" active={activeTab} onClick={setActiveTab} hint="Ask & resolve doubts" />
        <NavButton id="social" label="Med Life" active={activeTab} onClick={setActiveTab} hint="Chats & polls" />
        <NavButton id="groups" label="Study Groups" active={activeTab} onClick={setActiveTab} hint="Topic rooms" />
      </div>

      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg relative overflow-hidden group cursor-pointer">
        <div className="absolute -top-6 -right-8 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <Sparkles size={20} className="mb-2 text-yellow-200 animate-pulse"/>
        <h4 className="font-bold text-lg leading-tight mb-1">Go Premium</h4>
        <p className="text-xs text-indigo-100/90">Unlock unlimited uploads & verified badges.</p>
      </div>
    </>
  );
}

function NavButton({ id, active, onClick, label, hint }) {
  const theme = NAV_THEMES[id];
  const Icon = theme.icon;
  const isActive = active === id;

  return (
    <button 
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-250 focus:outline-none ${isActive ? theme.active : 'bg-white hover:shadow-sm'} `}
    >
      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-100'} shadow-inner`}> 
        <Icon size={18} className={isActive ? 'text-white' : 'text-slate-600'} />
      </div>
      <div className="flex-1 text-left">
        <div className={`${isActive ? 'text-white' : 'text-slate-800'}`}>{label}</div>
        <div className={`text-[11px] ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{hint}</div>
      </div>
      {isActive && <div className="w-2 h-8 rounded-full bg-white/30" />}
    </button>
  );
}

function PlaceholderView({ title, icon: Icon, desc, color }) {
  const colors = {
    violet: 'bg-violet-50 text-violet-600 border-violet-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
  };
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-in fade-in zoom-in-95 duration-500">
      <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-xl mb-8 border-4 border-white ${colors[color]}`}>
        <Icon size={48} strokeWidth={1.5}/>
      </div>
      <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 max-w-md text-lg leading-relaxed mb-8">{desc}</p>
      <button className="px-8 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-400 shadow-sm hover:bg-slate-50 transition-all cursor-not-allowed flex items-center gap-2">
        <Loader2 size={16} className="animate-spin"/> Coming Soon
      </button>
    </div>
  );
}

/* ==================== LIBRARY VIEW ==================== */

function LibraryView() {
  const [showUpload, setShowUpload] = useState(false);
  const [resources, setResources] = useState([]); 
  const [topResources, setTopResources] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [previewResource, setPreviewResource] = useState(null);
  const [yearFilter, setYearFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef(null);

  const SUBJECTS = {
    1: ['Anatomy', 'Physiology', 'Biochemistry'],
    2: ['Pathology', 'Microbiology', 'Pharmacology', 'Forensic Medicine'],
    3: ['ENT', 'Ophthalmology', 'Community Medicine'],
    4: ['General Medicine', 'General Surgery', 'OBG', 'Pediatrics', 'Orthopaedics']
  };

  useEffect(() => {
    async function init() {
        try {
            const sessionRes = await fetch('/api/auth/session');
            const sessionData = await sessionRes.json();
            if (sessionData.ok) setCurrentUser(sessionData.user);
        } catch(e) {}

        try {
            const topRes = await fetch('/api/community/resources?mode=top');
            const topJson = await topRes.json();
            if (topJson.ok) setTopResources(topJson.data);
        } catch(e) {}

        fetchResources();
    }
    init();
  }, []);

  // Auto-Scroll Logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let scrollAmount = 0;
    const speed = 0.5; 
    const step = () => {
        if (scrollContainer) {
            scrollAmount += speed;
            if (scrollAmount >= (scrollContainer.scrollWidth - scrollContainer.clientWidth)) {
                scrollAmount = 0; 
            }
            scrollContainer.scrollLeft = scrollAmount;
            requestAnimationFrame(step);
        }
    };
    const anim = requestAnimationFrame(step);
    return () => cancelAnimationFrame(anim);
  }, [topResources]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (yearFilter !== 'All') params.append('year', yearFilter);
      if (subjectFilter !== 'All') params.append('subject', subjectFilter);
      if (searchQuery.trim()) params.append('search', searchQuery);

      const res = await fetch(`/api/community/resources?${params.toString()}`);
      const json = await res.json();
      if (json.ok) setResources(json.data);
    } catch (e) {
      toast.error("Failed to load library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, [yearFilter, subjectFilter]);

  const handleDelete = async (id) => {
      toast.dismiss();
      const loadingToast = toast.loading("Deleting...");
      try {
          const res = await fetch(`/api/community/resources?id=${id}`, { method: 'DELETE' });
          if (res.ok) {
              toast.success("Deleted", { id: loadingToast });
              fetchResources();
          } else {
              toast.error("Failed", { id: loadingToast });
          }
      } catch(e) { toast.error("Error", { id: loadingToast }); }
  };

  const triggerDelete = (id) => {
      toast((t) => (
        <div className="flex flex-col gap-2 min-w-[200px]">
            <p className="text-sm font-bold text-slate-800">Delete this resource?</p>
            <div className="flex gap-2">
                <button onClick={() => toast.dismiss(t.id)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors">Cancel</button>
                <button onClick={() => { toast.dismiss(t.id); handleDelete(id); }} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors">Delete</button>
            </div>
        </div>
      ), { duration: 4000 });
  };

  const handleDownloadCount = async (resourceId) => {
      try {
          await fetch(`/api/community/resources?id=${resourceId}`, { method: 'PATCH' });
          setResources(prev => prev.map(r => r.id === resourceId ? { ...r, downloads: r.downloads + 1 } : r));
          setTopResources(prev => prev.map(r => r.id === resourceId ? { ...r, downloads: r.downloads + 1 } : r));
      } catch(e) { console.error("Count update failed"); }
  };

  const myUploads = resources.filter(r => currentUser && r.userId === currentUser.id);
  const communityUploads = resources.filter(r => !currentUser || r.userId !== currentUser.id);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Library</h1>
          <p className="text-slate-500 font-medium mt-1">Curated medical resources & notes.</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
          <Upload size={20}/> Upload
        </button>
      </div>

      {topResources.length > 0 && (
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-2xl"><TrendingUp size={20}/></div>
                <h2 className="text-xl font-bold text-slate-800">Trending Now</h2>
            </div>
            <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide"
                style={{ scrollBehavior: 'auto' }}
                onMouseEnter={() => { if(scrollRef.current) scrollRef.current.style.scrollBehavior = 'smooth'; }}
            >
                {topResources.map((res) => (
                    <ResourceCardSmall 
                        key={res.id} 
                        resource={res} 
                        onView={() => setPreviewResource(res)}
                        onDownload={handleDownloadCount}
                    />
                ))}
            </div>
        </div>
      )}

      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm mb-10 flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/80">
        <div className="relative w-full lg:max-w-md group">
            <Search size={20} className="text-slate-400 absolute left-4 top-3.5 group-focus-within:text-teal-500 transition-colors"/>
            <input 
                type="text" placeholder="Search notes, diagrams, topics..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-bold text-slate-700"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchResources()}
            />
        </div>
        <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-1">
            <select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setSubjectFilter('All'); }} className="bg-slate-50 border-transparent text-slate-700 text-sm rounded-xl block p-3 font-bold outline-none min-w-[140px] focus:border-teal-500 cursor-pointer hover:bg-slate-100 transition-colors">
              <option value="All">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="bg-slate-50 border-transparent text-slate-700 text-sm rounded-xl block p-3 font-bold outline-none min-w-[180px] focus:border-teal-500 cursor-pointer hover:bg-slate-100 transition-colors">
              <option value="All">All Subjects</option>
              {yearFilter !== 'All' && SUBJECTS[yearFilter]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
        </div>
      </div>

      {myUploads.length > 0 && (
          <div className="mb-12">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-teal-100 text-teal-600 rounded-xl"><User size={20}/></div> My Uploads
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {myUploads.map((res) => (
                      <ResourceCard 
                        key={res.id} 
                        resource={res} 
                        currentUser={currentUser} 
                        onDelete={() => triggerDelete(res.id)} 
                        onDownload={handleDownloadCount}
                        onView={() => setPreviewResource(res)}
                      />
                  ))}
              </div>
          </div>
      )}

      <div>
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><Users size={20}/></div> Recent Uploads
          </h3>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-600 w-10 h-10"/></div>
          ) : communityUploads.length === 0 && myUploads.length === 0 ? (
            <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <FileText size={32} className="text-slate-300"/>
              </div>
              <p className="text-slate-500 font-medium text-lg">No resources found.</p>
              <button onClick={() => {setYearFilter('All'); setSubjectFilter('All'); setSearchQuery(''); fetchResources();}} className="text-teal-600 text-sm font-bold hover:underline mt-2">Clear All Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {communityUploads.map((res) => (
                <ResourceCard 
                    key={res.id} 
                    resource={res} 
                    currentUser={currentUser} 
                    onDelete={() => triggerDelete(res.id)} 
                    onDownload={handleDownloadCount}
                    onView={() => setPreviewResource(res)}
                />
              ))}
            </div>
          )}
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onRefresh={fetchResources} subjectsMap={SUBJECTS}/>}
      {previewResource && <PreviewModal resource={previewResource} onClose={() => setPreviewResource(null)} />}
    </div>
  );
}

/* ==================== Q&A VIEW ==================== */

function QAView() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAskModal, setShowAskModal] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'mine'
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      if (sessionData.ok) setCurrentUser(sessionData.user);

      const res = await fetch(`/api/community/questions${search ? `?search=${search}` : ''}`);
      const json = await res.json();
      if (json.ok) setQuestions(json.data);
    } catch(e) { toast.error("Failed to load questions"); }
    finally { setLoading(false); }
  };

  if (selectedQuestionId) {
    return <QADetailView questionId={selectedQuestionId} onBack={() => { setSelectedQuestionId(null); fetchQuestions(); }} />;
  }

  // Filter questions based on toggle
  const filteredQuestions = viewMode === 'mine' 
    ? questions.filter(q => q.user?.id === currentUser?.id)
    : questions.filter(q => q.user?.id !== currentUser?.id); // Only show others' questions in 'all'

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Doubt Clearing</h1>
          <p className="text-slate-500 font-medium mt-1">Ask specific questions, get verified answers.</p>
        </div>
        <button onClick={() => setShowAskModal(true)} className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-violet-200 transition-all active:scale-95">
          <Plus size={20}/> Ask Question
        </button>
      </div>

      {/* Toggle & Search Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-2">
        {/* Toggle */}
        <div className="flex p-1 bg-slate-100 rounded-xl shrink-0 w-full sm:w-auto">
            <button 
                onClick={() => setViewMode('all')}
                className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'all' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
                Community
            </button>
            <button 
                onClick={() => setViewMode('mine')}
                className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'mine' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
                My Questions
            </button>
        </div>

        {/* Search Input */}
        <div className="flex-1 flex items-center w-full">
            <Search size={20} className="text-slate-400 ml-3"/>
            <input 
              className="flex-1 p-3 bg-transparent outline-none font-medium text-slate-700 w-full" 
              placeholder="Search questions..."
              value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchQuestions()}
            />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-violet-600 w-8 h-8"/></div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">No questions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map(q => (
            <div key={q.id} onClick={() => setSelectedQuestionId(q.id)} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <span className="text-xl font-black text-slate-700">{q.score}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Votes</span>
                  {q.isSolved && <CheckCircle2 className="text-green-500 mt-2" size={20}/>}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-700 transition-colors">{q.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {q.tags.map(t => <span key={t} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-lg">{t}</span>)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <User size={14}/> {q.user?.name || 'Anonymous'} • {new Date(q.createdAt).toLocaleDateString()} • {q._count?.answers || 0} Answers
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAskModal && <AskQuestionModal onClose={() => setShowAskModal(false)} onRefresh={fetchQuestions} />}
    </div>
  );
}

function QADetailView({ questionId, onBack }) {
  const [question, setQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        if (sessionData.ok) setCurrentUser(sessionData.user);

        const res = await fetch(`/api/community/questions/${questionId}`);
        const json = await res.json();
        if (json.ok) setQuestion(json.data);
      } catch(e) {} finally { setLoading(false); }
    };
    load();
  }, [questionId]);

  const handleVote = async (type, id, value) => {
    try {
      const res = await fetch('/api/community/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, value })
      });
      if(res.ok) {
          toast.success("Voted!");
          const r = await fetch(`/api/community/questions/${questionId}`);
          const j = await r.json();
          if (j.ok) setQuestion(j.data);
      } else {
          toast.error("Please login to vote");
      }
    } catch(e) { toast.error("Vote failed"); }
  };

  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/community/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newAnswer, questionId })
      });
      if (res.ok) {
        toast.success("Answer Posted!");
        setNewAnswer('');
        const qRes = await fetch(`/api/community/questions/${questionId}`);
        const qJson = await qRes.json();
        if (qJson.ok) setQuestion(qJson.data);
      }
    } catch(e) { toast.error("Failed to post"); }
    finally { setSubmitting(false); }
  };

  const handleAccept = async (answerId) => {
    try {
      const res = await fetch('/api/community/answers/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerId })
      });
      if(res.ok) {
        toast.success("Answer Accepted!");
        const qRes = await fetch(`/api/community/questions/${questionId}`);
        const qJson = await qRes.json();
        if (qJson.ok) setQuestion(qJson.data);
      }
    } catch(e) {}
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-violet-600"/></div>;
  if (!question) return <div className="text-center py-20">Question not found</div>;

  const isAuthor = currentUser?.id === question.user.id;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
        <X size={20}/> Back to Questions
      </button>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm mb-8">
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-2">
            <button onClick={() => handleVote('question', question.id, 1)} className="p-2 bg-slate-100 rounded-xl hover:bg-violet-100 hover:text-violet-600 transition-colors"><ArrowUp size={24}/></button>
            <span className="font-black text-2xl text-slate-700">{question.score}</span>
            <button onClick={() => handleVote('question', question.id, -1)} className="p-2 bg-slate-100 rounded-xl hover:bg-red-100 hover:text-red-600 transition-colors"><ArrowDown size={24}/></button>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight">{question.title}</h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-6 whitespace-pre-wrap">{question.content}</p>
            
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex gap-2">
                {question.tags.map(t => <span key={t} className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-bold uppercase rounded-lg">{t}</span>)}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs">{question.user.name?.[0]}</div>
                {question.user.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-6">{question.answers.length} Answers</h3>
      <div className="space-y-6 mb-10">
        {question.answers.map(ans => (
          <div key={ans.id} className={`p-6 rounded-3xl border ${ans.isAccepted ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-white border-slate-200'} flex gap-4`}>
            <div className="flex flex-col items-center gap-1">
              <button onClick={() => handleVote('answer', ans.id, 1)} className="p-1 hover:text-violet-600"><ArrowUp size={20}/></button>
              <span className="font-bold text-slate-700">{ans.score}</span>
              <button onClick={() => handleVote('answer', ans.id, -1)} className="p-1 hover:text-red-600"><ArrowDown size={20}/></button>
              {ans.isAccepted && <CheckCircle2 className="text-green-600 mt-2" size={24}/>}
            </div>
            <div className="flex-1">
              <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">{ans.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{ans.user.name} • {new Date(ans.createdAt).toLocaleDateString()}</span>
                {isAuthor && !ans.isAccepted && (
                  <button onClick={() => handleAccept(ans.id)} className="px-3 py-1 bg-slate-100 hover:bg-green-100 text-slate-600 hover:text-green-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
                    <Check size={14}/> Accept
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isAuthor && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg">
          <h3 className="font-bold text-lg mb-4">Your Answer</h3>
          <textarea 
            className="w-full h-32 p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-violet-500 resize-none mb-4"
            placeholder="Type your explanation here..."
            value={newAnswer} onChange={e => setNewAnswer(e.target.value)}
          />
          <button 
            onClick={handlePostAnswer} 
            disabled={submitting}
            className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-200 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin"/> : 'Post Answer'}
          </button>
        </div>
      )}
    </div>
  );
}

function AskQuestionModal({ onClose, onRefresh }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  // 🧠 FIX: Ensure tags are processed correctly
  const handleSubmit = async () => {
    if (!title || !content) return toast.error("Missing fields");
    setLoading(true);
    try {
      const res = await fetch('/api/community/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          content, 
          tags: tags.split(',').map(t => t.trim()).filter(t => t) // Clean tags
        })
      });
      if (res.ok) {
        toast.success("Question Posted!");
        onRefresh();
        onClose();
      } else { throw new Error(); }
    } catch(e) { toast.error("Failed to post"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-2xl text-slate-900">Ask Question</h3>
          <button onClick={onClose}><X size={24} className="text-slate-400 hover:text-slate-600"/></button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl font-bold" placeholder="e.g. Mechanism of Action of Atropine?"/>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Details</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-32 p-3 bg-slate-50 border rounded-xl resize-none" placeholder="Describe your doubt..."/>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Tags (comma separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="Pharmacology, ANS, Hard"/>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : 'Post Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- HELPERS & SHARED ---------------- */

const getTheme = (subject) => THEMES[subject] || THEMES['Default'];

const getDownloadUrl = (url) => {
  if (!url) return '#';
  if (url.includes('/image/upload/')) return url.replace('/image/upload/', '/image/upload/fl_attachment/');
  if (url.includes('/raw/upload/')) return url.replace('/raw/upload/', '/raw/upload/fl_attachment/');
  if (url.includes('/upload/') && !url.includes('fl_attachment')) {
    return url.replace('/upload/', '/upload/fl_attachment/');
  }
  return url;
};

function ResourceCardSmall({ resource, onView, onDownload }) {
  const theme = getTheme(resource.subject);
  const ThemeIcon = theme.icon;
  return (
    <div className="min-w-[280px] max-w-[280px] bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-default">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${theme.bg} shadow-inner`}>
          <ThemeIcon size={18} className={theme.text} />
        </div>
        <div className="overflow-hidden flex-1">
          <p className="font-semibold text-slate-900 truncate leading-tight" title={resource.title}>{resource.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{resource.user.name}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-auto">
        <button onClick={onView} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors">View</button>
        <a href={getDownloadUrl(resource.fileUrl)} onClick={() => onDownload(resource.id)} className="flex-1 py-2.5 bg-slate-900 text-white hover:bg-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer">Get</a>
      </div>
    </div>
  );
}

function ResourceCard({ resource, currentUser, onDelete, onDownload, onView }) {
  const isOwner = currentUser?.id === resource.userId;
  const theme = getTheme(resource.subject);
  const ThemeIcon = theme.icon;
  return (
    <div className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col relative h-full">
      <div onClick={onView} className={`h-44 relative overflow-hidden cursor-pointer bg-gradient-to-br ${theme.bg}`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        {resource.fileType === 'image' ? (
          <img src={resource.fileUrl} alt="preview" className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full relative z-10">
             <div className={`w-16 h-20 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center border-l-4 border-b-4 border-slate-200 group-hover:-translate-y-2 transition-transform duration-500`}>
                <ThemeIcon size={32} className={theme.text} strokeWidth={1.5}/>
                <div className="mt-2 w-8 h-1 bg-slate-100 rounded-full"></div>
                <div className="mt-1 w-6 h-1 bg-slate-100 rounded-full"></div>
             </div>
             <span className="text-xs font-semibold uppercase mt-4 tracking-wide text-slate-500 opacity-70">PDF Document</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wide text-slate-600 shadow-sm z-10 flex items-center gap-2">
          <ThemeIcon size={12} className={theme.text}/>
          {resource.subject}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold text-slate-800 text-sm transform translate-y-3 group-hover:translate-y-0 transition-transform">
                <Maximize2 size={16}/> Preview
            </div>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-900 text-lg mb-2 leading-snug line-clamp-2" title={resource.title}>{resource.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1 font-medium">{resource.description || 'No description provided.'}</p>
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
          <div className="flex items-center gap-3">
            {resource.user.avatar ? (
                <img src={resource.user.avatar} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"/>
            ) : (
                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-sm font-bold text-slate-600 border-2 border-white shadow-sm">
                    {resource.user.name?.[0]}
                </div>
            )}
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">{resource.user.name}</span>
                <span className="text-[11px] text-slate-400 font-medium">Year {resource.user.year}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
              {isOwner ? (
                  <button onClick={(e) => { e.preventDefault(); onDelete(); }} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18}/></button>
              ) : (
                  <a href={getDownloadUrl(resource.fileUrl)} onClick={() => onDownload(resource.id)} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg active:scale-95" title="Download">
                    <Download size={18} />
                  </a>
              )}
          </div>
        </div>
        <div className="absolute top-36 right-6 -translate-y-1/2 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm text-xs font-semibold text-slate-500 flex items-center gap-1.5 z-10">
            <Download size={12}/> {resource.downloads}
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ resource, onClose }) {
  const isPDF = resource.fileType === 'pdf';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[1rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 relative">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700"><FileText size={18}/></div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{resource.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">Shared by {resource.user.name}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <a href={getDownloadUrl(resource.fileUrl)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 flex items-center gap-2 shadow-lg">
                    <Download size={14}/> Download
                </a>
                <button onClick={onClose} className="p-2.5 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={20}/></button>
            </div>
        </div>
        <div className="flex-1 bg-slate-100 overflow-hidden flex items-center justify-center relative">
            {!isPDF ? (
                <img src={resource.fileUrl} alt="Full Preview" className="max-w-full max-h-full object-contain shadow-lg" />
            ) : (
                <object data={resource.fileUrl} type="application/pdf" className="w-full h-full border-none">
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                        <FileText size={48} className="text-slate-300"/>
                        <p className="font-medium">Preview unavailable on this device.</p>
                        <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 font-bold hover:underline flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                            Open in New Tab <ExternalLink size={16}/>
                        </a>
                    </div>
                </object>
            )}
        </div>
      </div>
    </div>
  );
}

// ... UploadModal (Same as previous, just ensure imports match) ...
function UploadModal({ onClose, onRefresh, subjectsMap }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [year, setYear] = useState('1');
  const [subject, setSubject] = useState(subjectsMap[1][0]);

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { toast.error("File too large (Max 10MB)"); return; }
    setFile(f);
    if (f.type.startsWith('image/')) setPreview(URL.createObjectURL(f));
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!title) return toast.error("Please enter a title");
    setUploading(true);
    const loadingToast = toast.loading("Uploading resource...");
    try {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadData.ok) throw new Error('Upload failed');

        const dbRes = await fetch('/api/community/resources', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title, description: desc, year, subject, fileUrl: uploadData.url, fileType: uploadData.type
            })
        });
        if (dbRes.ok) {
            toast.success("Uploaded successfully!", { id: loadingToast });
            onRefresh(); onClose();
        } else throw new Error("DB Save Failed");
    } catch (e) { toast.error("Upload failed. Try again.", { id: loadingToast }); } 
    finally { setUploading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800">Upload Resource</h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-500"><X size={20}/></button>
        </div>
        <div className="p-5">
            {step === 1 ? (
                <div className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors relative group">
                    <input type="file" accept="image/*,application/pdf" onChange={handleFileSelect} className="absolute inset-0 opacity-0 cursor-pointer z-50"/>
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                        <Upload size={28} className="text-teal-600"/>
                    </div>
                    <p className="font-semibold text-slate-700">Click to Upload</p>
                    <p className="text-xs text-slate-400 mt-1">PDF or Images (Max 10MB)</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        {preview ? <img src={preview} className="w-12 h-12 rounded object-cover bg-white"/> : <FileText className="w-12 h-12 text-red-500"/>}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-700 truncate">{file.name}</p>
                            <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button onClick={() => {setStep(1); setFile(null); setPreview(null)}} className="text-xs font-semibold text-red-500 hover:underline">Change</button>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Title</label>
                        <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 font-medium" placeholder="e.g. Upper Limb Anatomy Notes"/>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Description (Optional)</label>
                        <input value={desc} onChange={(e)=>setDesc(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 font-medium" placeholder="Short description..."/>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Year</label>
                            <select value={year} onChange={(e)=>{setYear(e.target.value); setSubject(subjectsMap[e.target.value][0])}} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 font-medium">
                                <option value="1">Year 1</option>
                                <option value="2">Year 2</option>
                                <option value="3">Year 3</option>
                                <option value="4">Year 4</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Subject</label>
                            <select value={subject} onChange={(e)=>setSubject(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 font-medium">
                                {subjectsMap[year].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleSubmit} disabled={uploading} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2 disabled:opacity-70">
                        {uploading ? <Loader2 className="animate-spin"/> : 'Publish Resource'}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
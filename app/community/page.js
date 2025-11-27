'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Search, Upload, Filter, FileText, Menu,
  Download, User, Users, Loader2, X, Trash2, 
  TrendingUp, Eye, ExternalLink, Maximize2,
  MessageCircle, HelpCircle, Coffee, Hash,
  Bone, Activity, FlaskConical, Bug, Pill, Scale,
  Ear, Eye as EyeIcon, HeartPulse, Baby, Stethoscope,
  Scissors, Sparkles, Zap, Plus, ArrowUp, ArrowDown, Check, CheckCircle2,
  ThumbsUp, Send, Type, List, Image as ImageIcon, Link as LinkIcon,
  BarChart2, MoreHorizontal, Heart, Share2,
  ChevronLeft, Paperclip, Smile, LogOut, Gift, Lock, Copy, Crown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
  },
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

const getTheme = (subject) => THEMES[subject] || THEMES['Default'];
const getDownloadUrl = (url) => url ? url.replace('/upload/', '/upload/fl_attachment/') : '#';

// --- MAIN LAYOUT ---
export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('library');
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'library': return <LibraryView />;
      case 'qa': return <QAView />;
      case 'social': return <SocialView />;
      case 'groups': return <GroupsView />;
      default: return <LibraryView />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-[calc(100vh-64px)] flex flex-col md:flex-row bg-gradient-to-b from-[#fbfdff] to-[#f6f9ff]">
      
      {/* MOBILE BUTTON */}
      <button 
        onClick={() => setMobileOpen(true)} 
        className="md:hidden fixed top-20 left-4 z-50 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-slate-200 text-slate-700 hover:text-teal-600 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="hidden md:flex w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 p-6 flex-col gap-4 shrink-0 sticky top-16 h-[calc(100vh-64px)] z-40">
        <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* --- SIDEBAR (Mobile Slide-out) --- */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
                onClick={() => setMobileOpen(false)}
             />
             <motion.div 
                initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-80 bg-white h-full shadow-2xl p-6 flex flex-col gap-4 z-50"
             >
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg text-slate-800">Menu</span>
                    <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24}/></button>
                </div>
                <SidebarContent activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setMobileOpen(false); }} />
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CONTENT --- */}
      <main className="flex-1 p-4 md:p-8 overflow-hidden pt-16 md:pt-8">
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
        <NavButton id="social" label="Med Life" active={activeTab} onClick={setActiveTab} hint="Rants & Discussions" />
        <NavButton id="groups" label="Study Groups" active={activeTab} onClick={setActiveTab} hint="Topic rooms" />
        
        <div className="my-2 border-t border-slate-100 mx-4"></div>
      
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


/* ==================== 2. GROUPS VIEW (REDESIGNED) ==================== */

function GroupsView() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchGroups();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.ok) setCurrentUser(data.user);
    } catch(e) {}
  };

  const fetchGroups = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `/api/community/groups?search=${query}` : '/api/community/groups';
      const res = await fetch(url);
      const json = await res.json();
      if (json.ok) setGroups(json.data);
    } catch(e) { toast.error("Failed to load groups"); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
      setSearch(e.target.value);
      if (e.key === 'Enter') fetchGroups(e.target.value);
  };

  // If a group is selected, show the Chat Room
  if (selectedGroup) {
    return <ChatRoom group={selectedGroup} currentUser={currentUser} onBack={() => { setSelectedGroup(null); fetchGroups(); }} />;
  }

  // Premium Check for Creation
  const isPremium = currentUser?.role === 'premium' || currentUser?.role === 'admin';

  // Define gradients for random assignment if no avatar
  const GRADIENTS = [
    'from-rose-400 to-orange-400',
    'from-violet-400 to-indigo-400',
    'from-teal-400 to-emerald-400',
    'from-amber-400 to-yellow-400',
    'from-cyan-400 to-blue-400',
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Study Groups</h1>
            <p className="text-slate-500 font-medium mt-1">Collaborate with peers in real-time.</p>
        </div>
        <button 
            onClick={() => {
                if (isPremium) setShowCreate(true);
                else toast((t) => (
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <Lock size={16}/> Premium Feature
                        <button onClick={() => toast.dismiss(t.id)} className="ml-auto text-xs text-slate-400">Dismiss</button>
                    </div>
                ));
            }} 
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-slate-900/20 flex items-center gap-2 hover:scale-105 transition-all active:scale-95 relative overflow-hidden"
        >
            {!isPremium && <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center"><Lock size={16}/></div>}
            <Plus size={20}/> Create Squad
        </button>
      </div>

      <div className="relative w-full mb-8">
            <Search size={20} className="text-slate-400 absolute left-4 top-3.5 group-focus-within:text-rose-500 transition-colors"/>
            <input 
                type="text" placeholder="Find a topic or squad..." 
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-bold text-slate-700 shadow-sm"
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
            />
      </div>

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} onRefresh={fetchGroups} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
            <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-rose-400"/></div>
        ) : groups.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No active groups found.</p>
                {isPremium && <button onClick={() => setShowCreate(true)} className="text-rose-600 font-bold hover:underline mt-2">Create one now</button>}
            </div>
        ) : (
            groups.map((group, idx) => (
                <div 
                    key={group.id} 
                    onClick={() => group.isMember && setSelectedGroup(group)}
                    className={`
                        relative bg-white rounded-[2rem] p-1 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group
                        ${group.isMember ? 'cursor-pointer ring-1 ring-slate-100' : ''}
                    `}
                >
                    <div className="bg-slate-50 rounded-[1.8rem] p-6 h-full flex flex-col relative overflow-hidden">
                        {/* Background Decor */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]} opacity-10 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-700`}></div>
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]}`}>
                                {group.avatar ? (
                                    <img src={group.avatar} className="w-full h-full object-cover rounded-2xl"/>
                                ) : (
                                    <span className="text-xl font-bold">{group.name[0]}</span>
                                )}
                            </div>
                            {group.isMember ? (
                                <span className="bg-white/80 backdrop-blur text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-sm">
                                    Joined <CheckCircle2 size={12} className="text-green-500"/>
                                </span>
                            ) : (
                                <JoinButton group={group} onJoin={(g) => setSelectedGroup(g)} />
                            )}
                        </div>

                        <h3 className="font-bold text-xl text-slate-900 mb-2 leading-tight relative z-10 line-clamp-1">{group.name}</h3>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium relative z-10 h-10">{group.description || "Join us to discuss and learn together."}</p>

                        <div className="mt-auto flex items-center gap-3 pt-4 border-t border-slate-200/60 relative z-10">
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-300 border-2 border-slate-50"></div>)}
                            </div>
                            <span className="text-xs font-bold text-slate-400">{group.memberCount} Members</span>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}

function JoinButton({ group, onJoin }) {
    const [joining, setJoining] = useState(false);
    const handleJoin = async (e) => {
        e.stopPropagation();
        setJoining(true);
        try {
            const res = await fetch('/api/community/groups/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupId: group.id })
            });
            if (res.ok) {
                toast.success(`Welcome to ${group.name}!`);
                onJoin({ ...group, isMember: true });
            }
        } catch(e) { toast.error("Error joining"); }
        finally { setJoining(false); }
    };

    return (
        <button 
            onClick={handleJoin} 
            disabled={joining}
            className="bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold px-4 py-2 rounded-xl shadow-sm border border-slate-200 transition-all active:scale-95 disabled:opacity-50"
        >
            {joining ? <Loader2 size={14} className="animate-spin"/> : 'Join'}
        </button>
    );
}

// --- ChatRoom (Required for Groups View) ---

function ChatRoom({ group, currentUser, onBack }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState(null); 
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); 
        return () => clearInterval(interval);
    }, [group.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/community/groups/${group.id}/messages`);
            const json = await res.json();
            if (json.ok) {
                 setMessages(json.data);
            }
        } catch(e) {}
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
            const uploadData = await uploadRes.json();
            if (uploadData.ok) {
                setAttachment({ url: uploadData.url, type: uploadData.type });
                toast.success("File attached");
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() && !attachment) return;
        
        const msgData = {
            content: input,
            attachmentUrl: attachment?.url,
            attachmentType: attachment?.type
        };

        const tempMsg = {
            id: Date.now().toString(),
            content: input,
            attachmentUrl: attachment?.url,
            attachmentType: attachment?.type,
            senderId: currentUser.id,
            sender: currentUser,
            createdAt: new Date().toISOString(),
            reactions: [],
            reactionCounts: {},
            temp: true
        };
        
        // Optimistic update
        setMessages(prev => [...prev, tempMsg]);
        setInput('');
        setAttachment(null);
        setSending(true);

        try {
            await fetch(`/api/community/groups/${group.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(msgData)
            });
            fetchMessages(); 
        } catch(e) { toast.error("Failed to send"); }
        finally { setSending(false); }
    };

    const handleLeave = async () => {
        toast((t) => (
            <div className="flex flex-col gap-2 min-w-[200px]">
                <p className="text-sm font-bold text-slate-800">Leave this group?</p>
                <div className="flex gap-2">
                    <button onClick={() => toast.dismiss(t.id)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors">Cancel</button>
                    <button onClick={() => {
                        toast.dismiss(t.id);
                        performLeave();
                    }} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors">Leave</button>
                </div>
            </div>
        ));
    };

    const performLeave = async () => {
        try {
            const res = await fetch('/api/community/groups/leave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupId: group.id })
            });
            if (res.ok) {
                toast.success("Left group");
                onBack();
            } else {
                throw new Error("Failed");
            }
        } catch(e) {
            toast.error("Failed to leave group");
        }
    };

    const handleReaction = async (messageId, emoji) => {
        setShowReactionPicker(null); 
        
        const targetMsg = messages.find(m => m.id === messageId);
        if (targetMsg?.temp) return;

        setMessages(prev => prev.map(msg => {
            if (msg.id !== messageId) return msg;
            
            const counts = { ...(msg.reactionCounts || {}) };
            if (!counts[emoji]) counts[emoji] = { count: 0, hasReacted: false };
            
            if (counts[emoji].hasReacted) {
                counts[emoji] = { ...counts[emoji], count: counts[emoji].count - 1, hasReacted: false };
                if (counts[emoji].count <= 0) delete counts[emoji];
            } else {
                counts[emoji] = { ...counts[emoji], count: counts[emoji].count + 1, hasReacted: true };
            }
            return { ...msg, reactionCounts: counts };
        }));

        try {
            await fetch('/api/community/messages/react', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageId, emoji })
            });
        } catch (error) {
            fetchMessages(); 
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                    <ChevronLeft size={24}/>
                </button>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg">{group.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Users size={10}/> {group.memberCount} members</p>
                </div>
                <button onClick={handleLeave} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors" title="Leave Group">
                    <LogOut size={20}/>
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                {messages.map((msg, i) => {
                    const isMe = msg.senderId === currentUser?.id;
                    const hasAttachment = !!msg.attachmentUrl;
                    return (
                        <div key={msg.id || i} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''} group relative`}>
                            {!isMe && (
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-700 shrink-0 self-end mb-2">
                                    {msg.sender?.name?.[0] || 'U'}
                                </div>
                            )}
                            <div className={`relative max-w-[70%]`}>
                                {!isMe && <span className="text-[10px] font-bold text-slate-400 block mb-1 ml-1">{msg.sender?.name}</span>}
                                
                                <div className={`p-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-rose-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
                                    {hasAttachment && (
                                        <div className="mb-2 rounded-lg overflow-hidden bg-black/5">
                                            {msg.attachmentType === 'image' ? (
                                                <img src={msg.attachmentUrl} alt="attachment" className="max-w-full h-auto rounded-lg" />
                                            ) : (
                                                <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg hover:bg-black/10 transition-colors">
                                                    <FileText size={16} className={isMe ? "text-white" : "text-slate-600"}/> 
                                                    <span className="underline">Document</span>
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    {msg.content}
                                    <span className={`text-[9px] block mt-1 text-right ${isMe ? 'text-rose-200' : 'text-slate-300'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>

                                {/* Reactions Display */}
                                {msg.reactionCounts && Object.keys(msg.reactionCounts).length > 0 && (
                                    <div className={`flex gap-1 mt-1 flex-wrap ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        {Object.entries(msg.reactionCounts).map(([emoji, data]) => (
                                            <button 
                                                key={emoji}
                                                onClick={() => handleReaction(msg.id, emoji)}
                                                className={`text-[10px] px-1.5 py-0.5 rounded-full border flex items-center gap-1 transition-colors ${data.hasReacted ? 'bg-rose-100 border-rose-200 text-rose-700' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                                            >
                                                {emoji} {data.count > 1 && <span className="font-bold">{data.count}</span>}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Reaction Picker (On Click of Smile Icon) */}
                                {showReactionPicker === msg.id && (
                                    <div className={`absolute -top-10 ${isMe ? 'right-0' : 'left-0'} bg-white shadow-xl border border-slate-200 rounded-full p-1 flex gap-1 z-20 animate-in zoom-in-95`}>
                                        {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
                                            <button 
                                                key={emoji}
                                                onClick={() => handleReaction(msg.id, emoji)}
                                                className="hover:scale-125 transition-transform text-xl p-1"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Add Reaction Trigger (Visible on Hover) */}
                                <button 
                                    onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                                    className={`absolute top-1/2 -translate-y-1/2 ${isMe ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-500 p-1`}
                                >
                                    <Smile size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
                {attachment && (
                    <div className="flex items-center gap-2 mb-2 bg-slate-50 p-2 rounded-lg w-fit border border-slate-200 animate-in slide-in-from-bottom-2">
                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                            {attachment.type === 'image' ? <ImageIcon size={14}/> : <FileText size={14}/>} 
                            Attached
                        </span>
                        <button onClick={() => setAttachment(null)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={16}/></button>
                    </div>
                )}
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-full border border-slate-200 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                    <label className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer hover:bg-slate-200 rounded-full transition-colors">
                        {uploading ? <Loader2 size={20} className="animate-spin"/> : <Paperclip size={20}/>}
                        <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*,application/pdf"/>
                    </label>
                    <input 
                        className="flex-1 bg-transparent outline-none px-2 text-sm font-medium text-slate-700 placeholder:text-slate-400"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                        onClick={handleSend} 
                        disabled={(!input.trim() && !attachment) || sending}
                        className="p-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 disabled:opacity-50 transition-transform active:scale-95 shadow-md"
                    >
                        <Send size={16}/>
                    </button>
                </div>
            </div>
        </div>
    );
}

function CreateGroupModal({ onClose, onRefresh }) {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) return toast.error("Group name required");
        setLoading(true);
        try {
            const res = await fetch('/api/community/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description: desc })
            });
            if (res.ok) {
                toast.success("Group Created!");
                onRefresh();
                onClose();
            } else throw new Error();
        } catch(e) { toast.error("Failed to create"); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-slate-900">Create Study Group</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400"/></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Group Name</label>
                        <input 
                            autoFocus
                            value={name} onChange={e => setName(e.target.value)}
                            className="w-full p-3 bg-slate-50 border rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                            placeholder="e.g. Final Year Surgery Prep"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                        <textarea 
                            value={desc} onChange={e => setDesc(e.target.value)}
                            className="w-full p-3 bg-slate-50 border rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 h-24 resize-none"
                            placeholder="What's this group about?"
                        />
                    </div>
                    <button onClick={handleSubmit} disabled={loading} className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : 'Create Group'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- SOCIAL VIEW (Med Life) ---

function SocialView() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.ok) setCurrentUser(data.user);
    } catch(e) {}
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/community/posts');
      const json = await res.json();
      if (json.ok) setPosts(json.data);
    } catch(e) { toast.error("Failed to load feed"); }
    finally { setLoading(false); }
  };

  const filteredPosts = posts.filter(post => 
    post.content?.toLowerCase().includes(search.toLowerCase()) ||
    post.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Med Life</h1>
                <p className="text-slate-500 font-medium">Campus buzz, rants & polls.</p>
            </div>
            <button onClick={() => setShowCreate(true)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95">
                <Plus size={20}/> New Post
            </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
            <Search size={20} className="text-slate-400 absolute left-4 top-3.5 group-focus-within:text-amber-500 transition-colors"/>
            <input 
                type="text" placeholder="Search discussions..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold text-slate-700 shadow-sm"
                value={search} onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} onRefresh={fetchPosts} user={currentUser} />}
      </AnimatePresence>

      {/* Feed */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-slate-400"/></div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">No posts found.</p>
        </div>
      ) : (
        <div className="space-y-6">
            {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} currentUser={currentUser} onRefresh={fetchPosts} />
            ))}
        </div>
      )}
    </div>
  );
}

function CreatePostModal({ onClose, onRefresh, user }) {
  const [type, setType] = useState('text'); // text, poll
  const [content, setContent] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [uploading, setUploading] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => { if (options.length < 4) setOptions([...options, '']); };

  const handleSubmit = async () => {
    if (!content.trim()) return toast.error("Post content cannot be empty");
    if (type === 'poll' && options.some(o => !o.trim())) return toast.error("Fill all poll options");

    setUploading(true);
    try {
        const res = await fetch('/api/community/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content,
                type,
                pollOptions: type === 'poll' ? options : undefined
            })
        });
        if (res.ok) {
            toast.success("Posted successfully!");
            onRefresh();
            onClose();
        } else throw new Error();
    } catch(e) { toast.error("Failed to post"); }
    finally { setUploading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
        >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800">Create Post</h3>
                <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-700"/></button>
            </div>
            
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center font-bold text-teal-700">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-sm text-slate-900">{user?.name}</p>
                        <button className="text-xs text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            Public <Users size={10}/>
                        </button>
                    </div>
                </div>

                <textarea 
                    className="w-full min-h-[100px] text-lg outline-none placeholder:text-slate-300 text-slate-800 resize-none mb-4"
                    placeholder="What's happening in med school?"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    autoFocus
                />

                {type === 'poll' && (
                    <div className="space-y-2 mb-4 animate-in slide-in-from-top-2">
                        {options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <input 
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={(e) => handleOptionChange(i, e.target.value)}
                                />
                            </div>
                        ))}
                        {options.length < 4 && (
                            <button onClick={addOption} className="text-xs font-bold text-amber-600 hover:underline ml-1">+ Add Option</button>
                        )}
                    </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div className="flex gap-2">
                        <button onClick={() => setType('text')} className={`p-2 rounded-xl transition-all ${type === 'text' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:bg-slate-50'}`}>
                            <Type size={20}/>
                        </button>
                        <button onClick={() => setType('poll')} className={`p-2 rounded-xl transition-all ${type === 'poll' ? 'bg-amber-50 text-amber-600' : 'text-slate-400 hover:bg-slate-50'}`}>
                            <BarChart2 size={20}/>
                        </button>
                    </div>
                    <button 
                        onClick={handleSubmit} 
                        disabled={uploading || !content.trim()} 
                        className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
                    >
                        {uploading ? <Loader2 className="animate-spin w-4 h-4"/> : 'Post'}
                    </button>
                </div>
            </div>
        </motion.div>
    </div>
  );
}

function PostCard({ post, currentUser, onRefresh }) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);
  const isOwner = currentUser?.id === post.userId;

  const handleLike = async () => {
    const prevLiked = isLiked;
    const prevCount = likesCount;
    
    setIsLiked(!isLiked);
    setLikesCount(prevLiked ? likesCount - 1 : likesCount + 1);

    try {
        await fetch('/api/community/posts/like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: post.id })
        });
    } catch (e) {
        setIsLiked(prevLiked);
        setLikesCount(prevCount);
    }
  };

  const handleDelete = async () => {
      if(!confirm("Delete this post?")) return;
      await fetch(`/api/community/posts/${post.id}`, { method: 'DELETE' });
      onRefresh();
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        toast.success("Link copied to clipboard!");
    }).catch(() => {
        toast.error("Failed to copy link");
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
       {/* Header */}
       <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-300 rounded-full flex items-center justify-center text-slate-700 font-bold border-2 border-white shadow-sm">
                {post.user?.name?.[0] || 'U'}
             </div>
             <div>
                <h4 className="font-bold text-slate-900 text-sm">{post.user?.name}</h4>
                <p className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</p>
             </div>
          </div>
          {isOwner && <button onClick={handleDelete} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>}
       </div>

       {/* Content */}
       <div className="mb-4">
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">{post.content}</p>
       </div>

       {/* Poll Render */}
       {post.type === 'poll' && (
           <PollComponent post={post} currentUser={currentUser} />
       )}

       {/* Footer Actions */}
       <div className="flex items-center gap-6 pt-4 border-t border-slate-100 mt-4">
          <button onClick={handleLike} className={`flex items-center gap-2 text-sm font-bold transition-colors ${isLiked ? 'text-pink-600' : 'text-slate-500 hover:text-pink-500'}`}>
             <Heart size={18} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-bounce" : ""}/> {likesCount}
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors">
             <MessageCircle size={18}/> {post.commentsCount}
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors ml-auto">
             <Share2 size={18}/>
          </button>
       </div>

       {/* Comments Section */}
       {showComments && <CommentsSection postId={post.id} currentUser={currentUser} />}
    </div>
  );
}

function PollComponent({ post, currentUser }) {
    const [options, setOptions] = useState(post.pollOptions);
    const [totalVotes, setTotalVotes] = useState(options.reduce((a,b)=>a+b.count,0));
    const [userVotedId, setUserVotedId] = useState(post.userVotedOptionId);
    const [loading, setLoading] = useState(false);

    const handleVote = async (optionId) => {
        if (loading) return;
        setLoading(true);
        
        const prevOptions = [...options];
        const prevTotal = totalVotes;
        const prevUserVotedId = userVotedId;

        let newOptions = [...options];
        let newTotal = totalVotes;
        let newUserVotedId = userVotedId;

        if (userVotedId === optionId) {
            newOptions = newOptions.map(opt => 
                opt.id === optionId ? { ...opt, count: Math.max(0, opt.count - 1) } : opt
            );
            newTotal = Math.max(0, newTotal - 1);
            newUserVotedId = null;
        } else {
            newOptions = newOptions.map(opt => {
                if (opt.id === optionId) return { ...opt, count: opt.count + 1 }; 
                if (opt.id === userVotedId) return { ...opt, count: Math.max(0, opt.count - 1) }; 
                return opt;
            });
            
            if (!userVotedId) {
                newTotal += 1; 
            } 
            newUserVotedId = optionId;
        }
        
        setOptions(newOptions);
        setTotalVotes(newTotal);
        setUserVotedId(newUserVotedId);

        try {
            await fetch('/api/community/posts/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId: post.id, optionId })
            });
        } catch(e) {
            setOptions(prevOptions);
            setTotalVotes(prevTotal);
            setUserVotedId(prevUserVotedId);
            toast.error("Vote failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="space-y-2 my-4">
            {options.map(opt => {
                const percentage = totalVotes === 0 ? 0 : Math.round((opt.count / totalVotes) * 100);
                const isSelected = userVotedId === opt.id;
                
                return (
                    <button 
                        key={opt.id}
                        onClick={() => handleVote(opt.id)}
                        disabled={loading}
                        className="relative w-full text-left h-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 transition-all hover:border-amber-300 group"
                    >
                        {totalVotes > 0 && (
                            <div className={`absolute top-0 left-0 h-full transition-all duration-500 ${isSelected ? 'bg-amber-100' : 'bg-slate-200/50'}`} style={{ width: `${percentage}%` }}></div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                            <span className={`text-sm font-bold ${isSelected ? 'text-amber-700' : 'text-slate-700'}`}>
                                {opt.text} {isSelected && <CheckCircle2 size={14} className="inline ml-1"/>}
                            </span>
                            {totalVotes > 0 && <span className="text-xs font-bold text-slate-500">{percentage}%</span>}
                        </div>
                    </button>
                );
            })}
            <div className="text-xs text-slate-400 font-bold px-1">{totalVotes} votes</div>
        </div>
    );
}

function CommentsSection({ postId, currentUser }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/community/posts/comment?postId=${postId}`);
            const json = await res.json();
            if (json.ok) setComments(json.data);
        } catch(e) {} finally { setLoading(false); }
    };

    const handlePost = async () => {
        if(!newComment.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/community/posts/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, content: newComment })
            });
            const json = await res.json();
            if (json.ok) {
                setComments([...comments, json.data]);
                setNewComment('');
            }
        } catch(e) {} finally { setSubmitting(false); }
    };

    return (
        <div className="pt-4 mt-4 border-t border-slate-100 bg-slate-50/50 -mx-6 px-6 pb-4 rounded-b-3xl animate-in slide-in-from-top-2">
            <div className="space-y-4 max-h-60 overflow-y-auto mb-4 pr-2 custom-scrollbar">
                {loading ? <div className="text-center text-xs text-slate-400">Loading comments...</div> : 
                 comments.length === 0 ? <div className="text-center text-xs text-slate-400">No comments yet.</div> :
                 comments.map(c => (
                    <div key={c.id} className="flex gap-3 text-sm">
                        <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                            {c.user.name?.[0]}
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                            <span className="font-bold text-slate-900 text-xs block mb-0.5">{c.user.name}</span>
                            <p className="text-slate-600">{c.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="relative">
                <input 
                    className="w-full bg-white border border-slate-200 rounded-full pl-4 pr-12 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                />
                <button onClick={handlePost} disabled={submitting || !newComment} className="absolute right-1 top-1 p-1.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-50 transition-all">
                    {submitting ? <Loader2 size={14} className="animate-spin"/> : <ArrowUp size={14}/>}
                </button>
            </div>
        </div>
    );
}

// --- Library & QA Views ---

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

function QAView() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAskModal, setShowAskModal] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [viewMode, setViewMode] = useState('all'); 
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

  const filteredQuestions = viewMode === 'mine' 
    ? questions.filter(q => q.user?.id === currentUser?.id)
    : questions; 

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

      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-2">
        <div className="flex p-1 bg-slate-100 rounded-xl shrink-0 w-full sm:w-auto">
            <button 
                onClick={() => setViewMode('all')}
                className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'all' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
                All Questions
            </button>
            <button 
                onClick={() => setViewMode('mine')}
                className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'mine' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
                My Questions
            </button>
        </div>

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
          const data = await res.json();
          if (data.status === 'created') {
              toast.success("Vote Added!", { icon: '👍' });
          } else if (data.status === 'updated') {
              toast.success("Vote Changed!", { icon: '🔄' });
          } else if (data.status === 'removed') {
              toast('Vote Removed.', { icon: '👋' });
          }

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

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        toast.success("Link copied to clipboard!");
    }).catch(() => {
        toast.error("Failed to copy link");
    });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-violet-600"/></div>;
  if (!question) return <div className="text-center py-20">Question not found</div>;

  const isAuthor = currentUser?.id === question.user.id;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
        <X size={20}/> Back to Questions
      </button>

      {/* --- QUESTION CARD --- */}
      <div className="bg-gradient-to-br from-white to-violet-50/50 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="flex gap-6 relative z-10">
          {/* Vote Button */}
          <div className="flex flex-col items-center gap-2 pt-2">
            <motion.button 
                whileTap={{ scale: 1.1, rotate: 10 }}
                onClick={() => handleVote('question', question.id, 1)} 
                className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center hover:bg-amber-100 transition-colors shadow-lg shadow-amber-100 ring-1 ring-amber-200/50"
            >
                <ThumbsUp size={24} fill="currentColor" className="drop-shadow-sm"/>
            </motion.button>
            <span className="font-black text-2xl text-slate-700">{question.score}</span>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex gap-2 mb-4 flex-wrap">
                {question.tags.map(t => (
                    <span key={t} className="px-3 py-1 bg-white border border-violet-100 text-violet-600 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                        {t}
                    </span>
                ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">{question.title}</h1>
            <div className="prose prose-slate max-w-none mb-8">
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">{question.content}</p>
            </div>
            
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-sm font-bold text-slate-600 border-2 border-white shadow-sm">
                    {question.user.name?.[0]}
                </div>
                <div className="leading-tight">
                    <span className="block text-sm font-bold text-slate-800">{question.user.name}</span>
                    <span className="block text-xs text-slate-400">Asked on {new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button onClick={handleShare} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                 <Share2 size={18}/> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-6 px-2 flex items-center gap-2">
        <MessageCircle className="text-violet-600" size={20}/> {question.answers.length} Answers
      </h3>
      
      <div className="space-y-6 mb-12">
        {question.answers.map(ans => (
          <div key={ans.id} className={`p-6 md:p-8 rounded-[2rem] border transition-all ${ans.isAccepted ? 'bg-green-50/50 border-green-200 shadow-sm ring-1 ring-green-100' : 'bg-white border-slate-200'}`}>
            <div className="flex gap-5">
                <div className="flex flex-col items-center gap-1 pt-1">
                    <motion.button 
                        whileTap={{ scale: 1.2, y: -2 }}
                        onClick={() => handleVote('answer', ans.id, 1)} 
                        className={`p-2 rounded-xl transition-colors ${ans.isAccepted ? 'text-green-700 bg-green-100' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}
                    >
                        <ThumbsUp size={20}/>
                    </motion.button>
                    <span className={`font-bold ${ans.isAccepted ? 'text-green-800' : 'text-slate-600'}`}>{ans.score}</span>
                    {ans.isAccepted && <div className="mt-3 text-green-600 bg-green-100 p-1.5 rounded-full"><CheckCircle2 size={20}/></div>}
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {ans.user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-800 block">{ans.user.name}</span>
                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Answered {new Date(ans.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        {isAuthor && !ans.isAccepted && (
                            <button onClick={() => handleAccept(ans.id)} className="text-xs font-bold text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-green-200">
                                Accept Answer
                            </button>
                        )}
                    </div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{ans.content}</p>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- ANSWER INPUT --- */}
      {!isAuthor && (
        <div className="bg-gradient-to-b from-white to-slate-50 p-1 rounded-[2rem] border border-slate-200 shadow-sm sticky bottom-6 z-20">
          <div className="bg-white rounded-[1.8rem] p-6 relative">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                Your Answer
              </h3>
              <div className="relative group">
                <textarea 
                    className="w-full min-h-[160px] p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-violet-100 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400 font-medium"
                    placeholder="Write a helpful answer..."
                    value={newAnswer} 
                    onChange={e => setNewAnswer(e.target.value)}
                />
                <div className="absolute bottom-4 right-4">
                    <button 
                        onClick={handlePostAnswer} 
                        disabled={submitting || !newAnswer.trim()}
                        className="bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-violet-700 transition-all disabled:opacity-0 disabled:scale-90 transform duration-200 flex items-center gap-2 active:scale-95"
                    >
                        {submitting ? <Loader2 className="animate-spin w-4 h-4"/> : <><Send size={16}/> Post Answer</>}
                    </button>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

function AskQuestionModal({ onClose, onRefresh }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) return toast.error("Title and Content required");
    setLoading(true);
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await fetch('/api/community/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags: tagList })
      });
      if (res.ok) {
        toast.success("Question Posted!");
        onRefresh();
        onClose();
      } else throw new Error();
    } catch(e) { toast.error("Failed to post"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-slate-900">Ask Question</h3>
            <button onClick={onClose}><X size={20} className="text-slate-400"/></button>
        </div>
        <div className="space-y-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Question Title</label>
                <input autoFocus value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" placeholder="e.g. Mechanism of action of Aspirin?"/>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Details</label>
                <textarea value={content} onChange={e=>setContent(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 h-32 resize-none" placeholder="Describe your doubt in detail..."/>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tags (comma separated)</label>
                <input value={tags} onChange={e=>setTags(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" placeholder="e.g. Pharmacology, NSAIDs"/>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin mx-auto"/> : 'Post Question'}
            </button>
        </div>
      </div>
    </div>
  );
}
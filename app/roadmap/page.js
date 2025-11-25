// app/roadmap/page.js
'use client';
import { useState, useEffect } from 'react';
import { BookOpen, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { MBBS_SYLLABUS } from '../../lib/data';

// Utility function to get the current academic year (FIXED)
const getCurrentAcademicYear = (savedYear) => {
    // 1. Sanitize input
    savedYear = parseInt(savedYear) || 1;
    
    // FIX: Removed the month-based auto-promotion. 
    // The displayed year now directly reflects the year set in your Profile/Onboard page.
    return Math.min(Math.max(savedYear, 1), 4); 
};


export default function RoadmapPage() {
  const [completedTopics, setCompletedTopics] = useState({}); 
  const [expandedSubjects, setExpandedSubjects] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [userYear, setUserYear] = useState(1); 

  // 1. Load data and determine effective academic year
  useEffect(() => {
    async function loadData() {
      // Fetch User Session for current year
      let actualYear = 1;
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        
        if (sessionData.ok && sessionData.user) {
          const savedYear = sessionData.user.year || 1; 
          // Use the fixed logic
          actualYear = getCurrentAcademicYear(savedYear);
          setUserYear(actualYear);
        }
      } catch (e) {
        console.error("Failed to load user session for year check", e);
      }

      // Fetch Topic Progress
      try {
        const res = await fetch('/api/roadmap/progress');
        const json = await res.json();
        if (json.ok) {
          setCompletedTopics(json.data);
        }
      } catch (e) {
        console.error("Failed to load progress", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);


  const toggleTopic = async (topic) => {
    const isNowCompleted = !completedTopics[topic];
    const updated = { ...completedTopics, [topic]: isNowCompleted };
    setCompletedTopics(updated);

    try {
      await fetch('/api/roadmap/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId: topic, isCompleted: isNowCompleted })
      });
    } catch (e) {
      console.error("Failed to sync progress");
    }
  };

  const toggleSubject = (id) => setExpandedSubjects(prev => ({ ...prev, [id]: !prev[id] }));

  const getSubjectProgress = (subject) => {
    let total = 0, completed = 0;
    if (subject.modules) {
      subject.modules.forEach(mod => {
        if (mod.topics) {
          mod.topics.forEach(top => { 
            total++; 
            if (completedTopics[top]) completed++; 
          });
        }
      });
    }
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">MBBS Syllabus Roadmap</h2>
      </div>
      <div className="space-y-8">
        {MBBS_SYLLABUS.map((yearData) => {
            const isCurrentYear = yearData.id === userYear;
            const isFutureYear = yearData.id > userYear;
            
            return (
              <section key={yearData.id}>
                 <div className={`mb-4 border-l-4 pl-4 transition-colors duration-500 
                     ${isCurrentYear ? 'border-teal-500' : 'border-slate-300'}`}>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isCurrentYear ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>{yearData.semesters}</span>
                    <h3 className="text-2xl font-bold mt-2 text-slate-800">{yearData.yearLabel}</h3>
                 </div>
                 <div className="grid gap-6 md:grid-cols-2">
                    {yearData.subjects.map((subject) => {
                       const progress = getSubjectProgress(subject);
                       const isExpanded = !!expandedSubjects[subject.id];
                       const Icon = subject.icon || BookOpen;
                       
                       // Apply styling based on current year
                       const subjectClass = isCurrentYear 
                           ? 'ring-2 ring-teal-500/50' 
                           : isFutureYear
                           ? 'opacity-60 cursor-not-allowed'
                           : '';
                       
                       return (
                         <article 
                           key={subject.id} 
                           className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all 
                               ${isExpanded ? 'ring-2 ring-teal-500 md:col-span-2' : 'border-slate-200'} ${subjectClass}`}
                           // Disable interaction and show tooltip for future years
                           {...(isFutureYear && { onClick: (e) => e.preventDefault(), title: "Unlock next year's syllabus!" })}
                         >
                            {/* Header Section */}
                            <header onClick={() => !isFutureYear && toggleSubject(subject.id)} className="p-5 flex items-center justify-between gap-4 cursor-pointer">
                               
                               {/* Left: Icon + Title */}
                               <div className="flex items-center gap-4 min-w-0 flex-1">
                                  <div className={`p-3 rounded-xl flex-shrink-0 ${isCurrentYear ? 'bg-teal-200' : subject.bg || 'bg-slate-100'}`}>
                                    <Icon size={28} className={isCurrentYear ? 'text-teal-700' : subject.color || 'text-slate-600'} />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="font-bold text-lg text-slate-800 truncate">{subject.name}</h4>
                                    {/* Mobile Progress Bar (Hidden on Desktop) */}
                                    <div className="md:hidden flex items-center gap-2 mt-1">
                                       <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                                          <div className="h-full bg-teal-500 transition-all" style={{ width: `${progress}%` }} />
                                       </div>
                                       <span className="text-[10px] font-bold text-slate-500">{progress}%</span>
                                    </div>
                                  </div>
                               </div>

                               {/* Right: Desktop Progress Bar + Expand Icon */}
                               <div className="flex items-center gap-6">
                                  {/* Desktop Progress (Hidden on Mobile) */}
                                  <div className="hidden md:flex items-center gap-3 w-40">
                                     <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full transition-all duration-500 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-teal-500'}`} style={{ width: `${progress}%` }} />
                                     </div>
                                     <span className="text-xs font-bold text-slate-600 w-8 text-right">{progress}%</span>
                                  </div>

                                  <div className="text-slate-400">
                                    {isExpanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                                  </div>
                               </div>
                            </header>

                            {/* Expanded Content */}
                            {isExpanded && (
                               <div className="border-t border-slate-100 bg-slate-50 p-6 grid gap-6 md:grid-cols-2">
                                  {subject.modules?.map((mod, idx) => (
                                     <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200">
                                        <h5 className="font-bold text-sm text-slate-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                                           <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
                                           {mod.title}
                                        </h5>
                                        <div className="space-y-2">
                                          {mod.topics?.map((topic, tIdx) => {
                                             const isChecked = !!completedTopics[topic];
                                             return (
                                               <label key={tIdx} className="flex items-start gap-3 cursor-pointer group select-none">
                                                  <input 
                                                    type="checkbox" 
                                                    checked={isChecked} 
                                                    onChange={(e) => { e.stopPropagation(); toggleTopic(topic); }} 
                                                    // Disable checkbox if it's a future year 
                                                    disabled={isFutureYear} 
                                                    className={`mt-1 w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500 ${isFutureYear ? 'opacity-50' : ''}`} 
                                                  />
                                                  <span className={`text-sm transition-colors ${isChecked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                    {topic}
                                                  </span>
                                               </label>
                                             );
                                          })}
                                        </div>
                                     </div>
                                  ))}
                               </div>
                            )}
                         </article>
                       );
                    })}
                 </div>
              </section>
            );
        })}
      </div>
    </div>
  );
}
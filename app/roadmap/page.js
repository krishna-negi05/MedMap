'use client';
import { useState, useEffect } from 'react';
import { BookOpen, ChevronUp, ChevronDown } from 'lucide-react';
import { MBBS_SYLLABUS } from '../../lib/data';

export default function RoadmapPage() {
  const [completedTopics, setCompletedTopics] = useState({}); 
  const [expandedSubjects, setExpandedSubjects] = useState({}); 

  // Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('medmap_progress');
    if (saved) { try { setCompletedTopics(JSON.parse(saved)); } catch (e) {} }
  }, []);

  const toggleTopic = (topic) => {
    const updated = { ...completedTopics, [topic]: !completedTopics[topic] };
    setCompletedTopics(updated);
    localStorage.setItem('medmap_progress', JSON.stringify(updated));
  };

  const toggleSubject = (id) => setExpandedSubjects(prev => ({ ...prev, [id]: !prev[id] }));

  const getSubjectProgress = (subject) => {
    let total = 0, completed = 0;
    // Safe check for modules and topics to prevent crashes
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

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
      <div className="mb-6"><h2 className="text-3xl font-bold text-slate-900">MBBS Syllabus Roadmap</h2></div>
      <div className="space-y-8">
        {MBBS_SYLLABUS.map((yearData) => (
          <section key={yearData.id}>
             <div className="mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-500">{yearData.semesters}</span>
                <h3 className="text-2xl font-bold mt-2 text-slate-800">{yearData.yearLabel}</h3>
             </div>
             <div className="grid gap-6 md:grid-cols-2">
                {yearData.subjects.map((subject) => {
                   const progress = getSubjectProgress(subject);
                   const isExpanded = !!expandedSubjects[subject.id];
                   const Icon = subject.icon || BookOpen;
                   
                   return (
                     <article key={subject.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isExpanded ? 'ring-2 ring-teal-500 md:col-span-2' : 'border-slate-200'}`}>
                        {/* Header Section */}
                        <header onClick={() => toggleSubject(subject.id)} className="p-5 flex items-center justify-between gap-4 cursor-pointer">
                           
                           {/* Left: Icon + Title */}
                           <div className="flex items-center gap-4 min-w-0 flex-1">
                              <div className={`p-3 rounded-xl flex-shrink-0 ${subject.bg || 'bg-slate-100'}`}>
                                <Icon size={28} className={subject.color || 'text-slate-600'} />
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
                                                className="mt-1 w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" 
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
        ))}
      </div>
    </div>
  );
}
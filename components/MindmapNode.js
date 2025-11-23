'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function MindmapNode({ node, depth, onSelect, selectedId }) {
  const [expanded, setExpanded] = useState(true);
  const isSelected = selectedId === node.id;

  return (
    <div className="flex flex-col relative">
      <div className="flex items-center group">
        {/* Connection Lines (Visual hierarchy) */}
        {depth > 0 && (
          <div className="relative w-8 h-10 -mt-10 -ml-4 mr-2">
             <div className="absolute top-0 left-4 h-full border-l-2 border-slate-200 rounded-bl-xl"></div>
             <div className="absolute bottom-[18px] left-4 w-4 border-b-2 border-slate-200"></div>
          </div>
        )}

        {/* Node Card */}
        <div 
            onClick={() => onSelect(node)} 
            className={`
                relative flex items-center gap-3 px-4 sm:px-5 py-3 my-2 rounded-xl border transition-all duration-300 cursor-pointer group max-w-[80vw] sm:max-w-md 
                ${isSelected 
                    ? 'bg-gradient-to-r from-teal-50 to-white border-teal-400 shadow-md shadow-teal-100 ring-2 ring-teal-400/20 scale-[1.02]' 
                    : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-sm hover:scale-[1.01]'
                } 
                ${node.type === 'root' ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : ''}
            `}
        >
           {/* Expand/Collapse Button (Only if children exist) */}
           {node.children && node.children.length > 0 && (
               <button 
                    onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} 
                    className={`absolute -right-3 w-6 h-6 flex items-center justify-center rounded-full shadow-sm border z-10 transition-colors ${isSelected ? 'bg-teal-100 border-teal-300 text-teal-700' : 'bg-white border-slate-200 text-slate-400 hover:text-teal-600'}`}
               >
                    {expanded ? <ChevronDown size={12} strokeWidth={3} /> : <ChevronRight size={12} strokeWidth={3} />}
               </button>
           )}

           {/* Node Text content */}
          <div className="flex flex-col">
              <span className={`font-semibold tracking-tight leading-snug ${node.type === 'root' ? 'text-white text-lg' : 'text-slate-700 text-sm sm:text-base'}`}>
                  {node.label}
              </span>
              {node.type !== 'root' && (
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {node.type}
                  </span>
              )}
          </div>
          
          {/* Decorative Dot for concepts */}
          {node.type === 'concept' && node.type !== 'root' && (
              <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]"></div>
          )}
        </div>
      </div>

      {/* Recursive Children Rendering */}
      {expanded && node.children && node.children.length > 0 && (
          <div className={`flex flex-col ml-${depth === 0 ? '0' : '8'} pl-4`}>
              {node.children.map(child => (
                  <MindmapNode 
                    key={child.id} 
                    node={child} 
                    depth={depth + 1} 
                    onSelect={onSelect} 
                    selectedId={selectedId} 
                  />
              ))}
          </div>
      )}
    </div>
  );
}
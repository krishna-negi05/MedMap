'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Circle, FileText, Layers, Sparkles } from 'lucide-react';

export default function MindmapNode({ node, depth, onSelect, selectedId, isLast = true }) {
  const [expanded, setExpanded] = useState(true);
  const isSelected = selectedId === node.id;

  // Dynamic Styles based on Depth
  const getCardStyles = (d) => {
    if (d === 0) return 'bg-slate-900 text-white border-slate-900 shadow-2xl'; // Root
    if (d === 1) return 'bg-white border-teal-200 text-slate-800 shadow-md border-l-4 border-l-teal-500'; // Main Concept
    return 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-teal-300 transition-colors'; // Detail
  };

  // Dynamic Icons
  const Icon = depth === 0 ? Layers : (depth === 1 ? Sparkles : Circle);

  return (
    <div className="relative pl-8"> {/* Indentation for hierarchy */}
      
      {/* --- Connector Lines --- */}
      {depth > 0 && (
        <>
          {/* Horizontal line to current node */}
          <div className="absolute top-8 left-0 w-8 h-[2px] bg-slate-300 rounded-full"></div>
          
          {/* Vertical line connecting from parent */}
          {/* If not last, line goes full height to connect to next sibling */}
          {!isLast && <div className="absolute top-0 left-0 w-[2px] h-full bg-slate-300"></div>}
          
          {/* If last, line stops at the curve (L-shape) */}
          {isLast && <div className="absolute top-0 left-0 w-[2px] h-8 bg-slate-300"></div>}
        </>
      )}

      {/* --- Node Card --- */}
      <div className="py-2">
        <motion.div 
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: depth * 0.1 }}
            onClick={() => onSelect(node)} 
            className={`
                relative flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-pointer group w-full max-w-lg
                ${getCardStyles(depth)}
                ${isSelected ? 'ring-2 ring-offset-4 ring-teal-500 scale-[1.02]' : ''}
            `}
        >
           {/* Icon Badge */}
           <div className={`p-2.5 rounded-xl shrink-0 ${depth === 0 ? 'bg-white/10 text-teal-300' : 'bg-slate-100 text-slate-500 group-hover:text-teal-600'}`}>
             <Icon size={depth === 0 ? 24 : 18} strokeWidth={2.5} />
           </div>

           {/* Text Content */}
           <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                  <h4 className={`font-bold truncate tracking-tight ${depth === 0 ? 'text-xl' : 'text-base'}`}>
                      {node.label}
                  </h4>
                  
                  {/* Expand/Collapse Toggle */}
                  {node.children && node.children.length > 0 && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} 
                        className={`ml-2 p-1.5 rounded-full transition-all ${depth === 0 ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-700'}`}
                    >
                        <motion.div animate={{ rotate: expanded ? 0 : -90 }}>
                            <ChevronDown size={16} strokeWidth={3} />
                        </motion.div>
                    </button>
                  )}
              </div>
              
              {/* Summary (only for top levels) */}
              {(depth < 2 && node.summary) && (
                  <p className={`text-xs mt-1 truncate ${depth===0?'text-slate-400':'text-slate-500'}`}>
                      {node.summary}
                  </p>
              )}
           </div>
        </motion.div>
      </div>

      {/* --- Recursive Children --- */}
      <AnimatePresence>
        {expanded && node.children && node.children.length > 0 && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col"
            >
                {node.children.map((child, idx) => (
                    <MindmapNode 
                      key={child.id} 
                      node={child} 
                      depth={depth + 1} 
                      onSelect={onSelect} 
                      selectedId={selectedId} 
                      // Pass isLast to draw the correct L-shape connector
                      isLast={idx === node.children.length - 1}
                    />
                ))}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
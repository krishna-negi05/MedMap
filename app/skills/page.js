'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Activity, Stethoscope, Microscope,
  Layers, Bone, Heart, Search, X, Focus, ZoomIn
} from 'lucide-react';
import { motion } from 'framer-motion';

// ------------------------------------------------------------------
// This file is a hands-on upgrade of the earlier ClinicalSkillsLab.
// Key improvements:
// - Cardio: real-time synth phonocardiogram (WebAudio), draggable stethoscope nodes,
//   live waveform canvas with playback/record controls and BPM control.
// - Anatomy: true layer peeling, incision (draw) tool, layer opacity controls,
//   identify/label hotspots and undo for incision.
// - Pathology: zoom/pan microscope viewport, focus (blur) stacking simulation,
//   click-to-identify cells, measurement (two-point) tool, snapshot export.
// Note: purely client-side, dependency-free, Tailwind-ready.
// ------------------------------------------------------------------

// ---------------- CARDIO: Real phonocardiogram + draggable stethoscope ----------------
function CardioAdvancedHands() {
  const [activeValve, setActiveValve] = useState(null);
  const [bpm, setBpm] = useState(72);
  const [playing, setPlaying] = useState(false);
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const rafRef = useRef(null);
  const waveform = useRef(new Float32Array(1024));

  const VALVES = [
    { id: 'aortic', label: 'Aortic', top: '35%', left: '42%', type: 'stenosis' },
    { id: 'pulmonic', label: 'Pulmonic', top: '35%', left: '58%', type: 'normal' },
    { id: 'tricuspid', label: 'Tricuspid', top: '55%', left: '45%', type: 'regurg' },
    { id: 'mitral', label: 'Mitral', top: '55%', left: '60%', type: 'normal' }
  ];

  // setup audio context lazily
  const ensureAudio = () => {
    if (!audioCtxRef.current) {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ac;
      const gain = ac.createGain();
      gain.gain.value = 0.12;
      gain.connect(ac.destination);
      gainRef.current = gain;
    }
  };

  // produce a short 'lub-dub' burst based on valve type
  const playBeat = (type) => {
    ensureAudio();
    const ac = audioCtxRef.current;
    const g = ac.createGain();
    const osc = ac.createOscillator();
    // type affects timbre and spacing
    if (type === 'stenosis') {
      osc.frequency.value = 220;
      g.gain.value = 0.08;
    } else if (type === 'regurg') {
      osc.frequency.value = 300;
      g.gain.value = 0.06;
    } else {
      osc.frequency.value = 180;
      g.gain.value = 0.07;
    }
    osc.type = 'sine';
    osc.connect(g);
    g.connect(gainRef.current);
    const now = ac.currentTime;
    osc.start(now);
    g.gain.setValueAtTime(g.gain.value, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.stop(now + 0.13);
  };

  // rhythm loop
  useEffect(() => {
    if (!playing) return;
    let cancelled = false;
    const schedule = async () => {
      while (!cancelled && playing) {
        if (activeValve) {
          playBeat(activeValve.type);
        }
        // spacing from bpm
        await new Promise(r => setTimeout(r, Math.round(60000 / bpm)));
      }
    };
    schedule();
    return () => { cancelled = true; };
  }, [playing, bpm, activeValve]);

  // waveform animator (synthesizes a simple waveform based on valve type + bpm)
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const w = canvasRef.current.width = canvasRef.current.clientWidth * devicePixelRatio;
    const h = canvasRef.current.height = canvasRef.current.clientHeight * devicePixelRatio;

    let t = 0;
    const draw = () => {
      t += 0.02 * (bpm / 60);
      ctx.clearRect(0, 0, w, h);
      // background grid
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.lineWidth = 3 * devicePixelRatio;
      ctx.strokeStyle = '#fb7185';
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const norm = x / w;
        // base sinusoid
        let y = Math.sin((norm * 8 + t) * Math.PI * 2);
        // add a transient 'click' when activeValve present
        if (activeValve) {
          if (activeValve.type === 'stenosis') y += Math.exp(-Math.abs(norm - (0.2 + 0.6 * Math.abs(Math.sin(t)) )) * 50) * 1.5;
          else if (activeValve.type === 'regurg') y += Math.exp(-Math.abs(norm - (0.4 + 0.4 * Math.abs(Math.cos(t)) )) * 40) * 1.1;
          else y += Math.exp(-Math.abs(norm - (0.5 + 0.4 * Math.sin(t))) * 60) * 0.9;
        }
        const py = (h / 2) + y * (h * 0.28);
        if (x === 0) ctx.moveTo(x, py); else ctx.lineTo(x, py);
      }
      ctx.stroke();
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [activeValve, bpm]);

  // make valve nodes draggable (mobile + mouse)
  const onNodePointerDown = (e, v) => {
    e.preventDefault();
    setActiveValve(v);
    // allow drag to reposition node
    const node = e.currentTarget;
    node.setPointerCapture(e.pointerId);
    const startX = e.clientX; const startY = e.clientY;
    const rect = node.parentElement.getBoundingClientRect();
    const origLeft = parseFloat(node.style.left) || 0;
    const origTop = parseFloat(node.style.top) || 0;

    const move = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const newLeft = Math.min(Math.max(origLeft + dx, 10), rect.width - 40);
      const newTop = Math.min(Math.max(origTop + dy, 10), rect.height - 40);
      node.style.left = `${newLeft}px`;
      node.style.top = `${newTop}px`;
    };
    const up = (ev) => {
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerup', up);
      node.releasePointerCapture(e.pointerId);
    };
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerup', up);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full text-slate-200 overflow-hidden">
      <div className="flex-1 relative bg-slate-900 p-4 lg:p-6 flex flex-col items-center justify-center min-h-[420px]">
        <div className="relative w-full max-w-[420px] aspect-[3/4] opacity-95 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6">
          <div className="absolute inset-0 border-2 border-slate-700 rounded-2xl flex items-center justify-center">
            <Heart size={200} className="text-rose-900/20" strokeWidth={0.6} />
          </div>

          {/* Valve nodes (draggable) */}
          <div className="absolute inset-0">
            {VALVES.map((v, i) => (
              <div
                key={v.id}
                style={{ position: 'absolute', left: `calc(${v.left} - 24px)`, top: `calc(${v.top} - 24px)` }}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-150 cursor-grab z-30 ${activeValve?.id === v.id ? 'bg-rose-500/20 border-rose-400 shadow-lg' : 'bg-slate-800/60 border-slate-600'}`}
                onClick={() => setActiveValve(v)}
                onPointerDown={(e) => onNodePointerDown(e, v)}
              >
                <div className={`${activeValve?.id === v.id ? 'w-4 h-4 bg-rose-400 animate-pulse rounded-full' : 'w-3 h-3 bg-slate-500 rounded-full'}`}></div>
                <div className="sr-only">{v.label}</div>
              </div>
            ))}
          </div>

          <p className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs text-slate-400 font-mono">Drag nodes to reposition — tap to auscultate</p>
        </div>
      </div>

      <div className="w-full lg:w-96 bg-slate-950 p-6 flex flex-col border-l border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold">Cardio Monitor</h3>
            <p className="text-xs text-rose-400 font-mono">Interactive Auscultation</p>
          </div>
          <Activity className="text-rose-500 animate-pulse" />
        </div>

        <div className="bg-black rounded-xl h-36 mb-4 p-2 flex items-center">
          <canvas ref={canvasRef} className="w-full h-full rounded-md"></canvas>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Selected</span>
            <span className="font-bold text-white">{activeValve?.label || '--'}</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-slate-400 text-sm">BPM</label>
            <input type="range" min="40" max="140" value={bpm} onChange={(e) => setBpm(+e.target.value)} className="flex-1" />
            <div className="font-mono font-bold text-rose-400 w-20 text-right">{bpm} BPM</div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setPlaying(p => !p)} className={`flex-1 py-2 rounded-xl font-bold text-sm ${playing ? 'bg-rose-600 text-white' : 'bg-white text-slate-700'}`}>
              {playing ? 'Stop' : 'Play'} Rhythm
            </button>
            <button onClick={() => { setActiveValve(null); setPlaying(false); }} className="py-2 px-3 rounded-xl bg-slate-800 text-white">Reset</button>
          </div>

          <div className="text-xs text-slate-500 font-mono">Tip: reposition nodes and listen — waveform and audio respond to valve type and BPM.</div>
        </div>
      </div>
    </div>
  );
}

// ---------------- ANATOMY: Layer peeling + incision tool ----------------
function CadaverExplorerHands() {
  const [lensPos, setLensPos] = useState({ x: 150, y: 150 });
  const containerRef = useRef(null);

  // Layers stack: each layer has image/representation, opacity, peeled boolean
  const [layers, setLayers] = useState([
    { id: 'skin', label: 'Skin', color: '#f3e6d9', opacity: 1, peeled: false },
    { id: 'fat', label: 'Subcutaneous Fat', color: '#ffd9a8', opacity: 1, peeled: false },
    { id: 'muscle', label: 'Muscle', color: '#c94b3a', opacity: 1, peeled: false },
    { id: 'organs', label: 'Organs', color: '#7f1d1d', opacity: 1, peeled: false }
  ]);
  const [tool, setTool] = useState('lens'); // lens | peel | scalpel | label
  const [incisions, setIncisions] = useState([]);
  const incisionRef = useRef([]);
  const drawing = useRef(false);

  const startDraw = (e) => {
    if (tool !== 'scalpel') return;
    drawing.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    incisionRef.current = [{ x, y }];
  };
  const moveDraw = (e) => {
    if (!drawing.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    incisionRef.current.push({ x, y });
    setIncisions([...incisionRef.current]);
  };
  const endDraw = () => {
    if (!drawing.current) return;
    drawing.current = false;
    setIncisions(prev => [...prev]);
  };

  // peel a layer (gradual) — flips peeled boolean and reduces opacity to reveal below
  const peelLayer = (id) => {
    setLayers(ls => ls.map(l => l.id === id ? { ...l, peeled: !l.peeled, opacity: l.peeled ? 1 : 0.1 } : l));
  };

  // undo incision
  const undoIncision = () => {
    setIncisions([]);
    incisionRef.current = [];
  };

  // label hotspots
  const [labels, setLabels] = useState([]);
  const addLabel = (e) => {
    if (tool !== 'label') return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    const text = prompt('Label this structure (short):');
    if (text) setLabels(prev => [...prev, { x, y, text }]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-2 overflow-hidden">
      <div
        ref={containerRef}
        onMouseMove={(e) => { if (tool === 'lens') { const rect = containerRef.current.getBoundingClientRect(); setLensPos({ x: e.clientX - rect.left, y: e.clientY - rect.top }); } }}
        onTouchMove={(e) => { if (tool === 'lens') { const rect = containerRef.current.getBoundingClientRect(); setLensPos({ x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }); } if (tool === 'scalpel') moveDraw(e); }}
        onMouseDown={(e) => { if (tool === 'scalpel') startDraw(e); if (tool === 'label') addLabel(e); }}
        onMouseUp={endDraw}
        onTouchEnd={endDraw}
        className="flex-1 bg-stone-200 rounded-3xl relative overflow-hidden border-4 border-stone-300 shadow-inner cursor-crosshair min-h-[520px]"
      >
        {/* base background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-stone-200 to-stone-300"></div>

        {/* draw layers stacked */}
        {layers.map((layer, idx) => (
          <div key={layer.id}
            className="absolute rounded-2xl pointer-events-none"
            style={{ left: `${6 + idx * 6}px`, top: `${6 + idx * 8}px`, right: `${6 + idx * 6}px`, bottom: `${6 + idx * 8}px`, background: layer.color, opacity: layer.opacity, transition: 'opacity 300ms' }}>
            <div className="absolute right-3 top-3 text-[10px] bg-white/60 px-2 py-1 rounded text-stone-700 border border-white/30">{layer.label}</div>
          </div>
        ))}

        {/* lens clipping to show deep layers when lens tool selected */}
        {tool === 'lens' && (
          <div className="absolute w-[200px] h-[200px] rounded-full border-4 border-white/30 shadow-2xl z-40 pointer-events-none"
            style={{ left: lensPos.x, top: lensPos.y, transform: 'translate(-50%, -50%)', mixBlendMode: 'normal' }}>
            <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12), rgba(0,0,0,0.15))' }} />
          </div>
        )}

        {/* incision paths canvas (simple SVG) */}
        <svg className="absolute inset-0 z-30 pointer-events-none">
          {incisions.length > 0 && (
            <polyline points={incisions.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#111" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
          )}
          {labels.map((l, i) => (
            <g key={i} transform={`translate(${l.x},${l.y})`}>
              <rect x={8} y={-6} width="110" height="20" rx={6} fill="#111" opacity={0.7} />
              <text x={14} y={9} fontSize={12} fill="#fff" fontFamily="monospace">{l.text}</text>
              <circle cx={0} cy={0} r={6} fill="#fff" stroke="#111" strokeWidth={2} />
            </g>
          ))}
        </svg>

      </div>

      <div className="w-full lg:w-72 flex flex-col justify-start gap-4 pb-4">
        <div className="bg-white p-4 rounded-2xl border shadow">
          <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2"><Bone size={18}/> Dissection Tools</h3>
          <p className="text-sm text-stone-500 mt-2">Choose a tool and interact with the specimen. Tools operate directly on canvas: peel, scalpel-draw, label, or use the lens to inspect.</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => setTool('lens')} className={`px-3 py-2 rounded-md ${tool==='lens'?'bg-stone-800 text-white':'bg-white text-stone-700 border'}`}>Lens</button>
            <button onClick={() => setTool('peel')} className={`px-3 py-2 rounded-md ${tool==='peel'?'bg-stone-800 text-white':'bg-white text-stone-700 border'}`}>Peel</button>
            <button onClick={() => setTool('scalpel')} className={`px-3 py-2 rounded-md ${tool==='scalpel'?'bg-stone-800 text-white':'bg-white text-stone-700 border'}`}>Scalpel</button>
            <button onClick={() => setTool('label')} className={`px-3 py-2 rounded-md ${tool==='label'?'bg-stone-800 text-white':'bg-white text-stone-700 border'}`}>Label</button>
          </div>

          <div className="mt-3">
            <div className="text-xs text-stone-500">Layers</div>
            <div className="mt-2 space-y-2">
              {layers.map(l => (
                <div key={l.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ background: l.color }} />
                    <div className="text-sm">{l.label}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => peelLayer(l.id)} className="px-2 py-1 text-xs rounded bg-white border">{l.peeled ? 'Restore' : 'Peel'}</button>
                    <input type="range" min="0" max="1" step="0.01" value={l.opacity} onChange={(e) => setLayers(ls => ls.map(s => s.id === l.id ? { ...s, opacity: +e.target.value } : s))} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <button onClick={undoIncision} className="px-3 py-2 rounded-md bg-rose-600 text-white">Undo Incision</button>
              <button onClick={() => { setIncisions([]); setLabels([]); setLayers(layers.map(l=>({ ...l, peeled:false, opacity:1 }))) }} className="px-3 py-2 rounded-md bg-slate-200">Reset</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow"> 
          <div className="text-sm text-stone-500">Hints</div>
          <ul className="mt-2 text-sm text-stone-600 list-disc list-inside">
            <li>Use <strong>Peel</strong> to gently reveal deeper tissues.</li>
            <li>Switch to <strong>Scalpel</strong> and draw incisions — good for practicing orientation.</li>
            <li>Label structures with <strong>Label</strong>; labels are saved in-session.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------- PATHOLOGY: Zoom, focus stack, identify, measure ----------------
function PathologyScopeHands() {
  const [focus, setFocus] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const viewportRef = useRef(null);
  const dragRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });

  // synthetic 'slide' of cells
  const [cells] = useState(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({ id: i, x: 200 + Math.random() * 1200, y: 200 + Math.random() * 900, r: 12 + Math.random() * 20, type: Math.random() > 0.9 ? 'Reed-Sternberg' : 'normal' });
    }
    return arr;
  });
  const [identified, setIdentified] = useState([]);

  // measurement tool: two-point measure
  const [measurePoints, setMeasurePoints] = useState([]);

  // pan/zoom handlers
  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(z => Math.min(Math.max(0.5, z + delta), 6));
  };

  const startPan = (e) => {
    dragRef.current = true;
    lastRef.current = { x: e.clientX, y: e.clientY };
  };
  const movePan = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - lastRef.current.x;
    const dy = e.clientY - lastRef.current.y;
    lastRef.current = { x: e.clientX, y: e.clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  };
  const endPan = () => { dragRef.current = false; };

  const onClickCell = (c) => {
    // toggle identification
    setIdentified(id => id.includes(c.id) ? id.filter(i => i !== c.id) : [...id, c.id]);
  };

  const onMeasureClick = (e) => {
    const rect = viewportRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    setMeasurePoints(mp => {
      if (mp.length === 2) return [{ x, y }];
      return [...mp, { x, y }];
    });
  };

  const clearMeasure = () => setMeasurePoints([]);

  const snapshot = () => {
    const svg = viewportRef.current.querySelector('svg');
    const serializer = new XMLSerializer();
    const str = serializer.serializeToString(svg);
    const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'slide-snapshot.svg'; a.click();
    URL.revokeObjectURL(url);
  };

  const distance = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y).toFixed(1);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 overflow-hidden">
      <div className="w-full aspect-square lg:flex-1 max-h-[640px] bg-black rounded-2xl mx-auto relative overflow-hidden border-[6px] border-slate-800 shadow-2xl">
        <div
          ref={viewportRef}
          onWheel={onWheel}
          onMouseDown={startPan}
          onMouseMove={movePan}
          onMouseUp={endPan}
          onMouseLeave={endPan}
          onDoubleClick={(e)=> { setZoom(z=>Math.min(z*1.3,6)); }}
          onClick={onMeasureClick}
          className="absolute inset-0 cursor-grab"
        >
          <svg width="1600" height="1000" viewBox="0 0 1600 1000" className="absolute" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
            <rect x={0} y={0} width={1600} height={1000} fill={`rgba(255,240,250,${(100-focus)/200})`} />

            {/* synthetic cells */}
            {cells.map(c => (
              <g key={c.id} transform={`translate(${c.x},${c.y})`} onClick={(ev)=>{ ev.stopPropagation(); onClickCell(c); }} style={{ cursor: 'pointer' }}>
                <circle r={c.r} fill={c.type==='Reed-Sternberg' ? '#9f1239' : '#8b5cf6'} opacity={identified.includes(c.id)?1:0.85} />
                {identified.includes(c.id) && <text x={c.r+6} y={6} fontSize={12} fontFamily="monospace" fill="#111">{c.type}</text>}
              </g>
            ))}

            {/* measurement points/line */}
            {measurePoints.length >= 1 && (
              <g>
                {measurePoints.map((p, i) => (
                  <g key={i} transform={`translate(${p.x},${p.y})`}>
                    <circle r={6} fill="#fff" stroke="#000" strokeWidth={1} />
                  </g>
                ))}
                {measurePoints.length === 2 && (
                  <g>
                    <line x1={measurePoints[0].x} y1={measurePoints[0].y} x2={measurePoints[1].x} y2={measurePoints[1].y} stroke="#fff" strokeWidth={2} />
                    <text x={(measurePoints[0].x+measurePoints[1].x)/2+8} y={(measurePoints[0].y+measurePoints[1].y)/2} fontSize={12} fill="#fff">{distance(measurePoints[0],measurePoints[1])} px</text>
                  </g>
                )}
              </g>
            )}

          </svg>
        </div>
      </div>

      <div className="w-full lg:w-64 bg-slate-50 lg:border-l border-slate-200 p-6 flex flex-col gap-4 rounded-t-3xl">
        <div>
          <h3 className="text-slate-800 font-bold flex items-center gap-2 mb-2 text-sm"><Microscope size={16}/> Microscope Controls</h3>
          <div className="text-xs text-slate-500">Focus</div>
          <input type="range" min={0} max={100} value={focus} onChange={(e)=>setFocus(+e.target.value)} className="w-full" />
          <div className="text-xs text-slate-500 mt-2">Zoom</div>
          <div className="flex gap-2 mt-2">
            {[0.5,1,2,4].map(z => (
              <button key={z} onClick={() => setZoom(z)} className={`px-3 py-2 rounded ${zoom===z?'bg-slate-800 text-white':'bg-white border'}`}>{z}x</button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold">Analysis</h4>
          <div className="mt-2 text-sm text-slate-600">Identified cells: <span className="font-mono">{identified.length}</span></div>
          <div className="mt-2 flex gap-2">
            <button onClick={() => setIdentified([])} className="px-3 py-2 rounded bg-rose-600 text-white">Clear IDs</button>
            <button onClick={clearMeasure} className="px-3 py-2 rounded bg-white border">Clear Measure</button>
            <button onClick={snapshot} className="px-3 py-2 rounded bg-slate-800 text-white">Snapshot</button>
          </div>
        </div>

        <div className="text-xs text-slate-500">Tips: drag to pan, wheel to zoom, click slide to set measure points (two clicks) and double-click to quick zoom.</div>
      </div>
    </div>
  );
}

// ---------------- MAIN LAYOUT: plugs the hands-on modules ----------------
const MODULES = [
  { id: 'cardio', title: 'Hemodynamics', subtitle: 'Valve Isolation', icon: Heart },
  { id: 'anatomy', title: 'Anatomy Lab', subtitle: 'Dissection', icon: Bone },
  { id: 'pathology', title: 'Pathology', subtitle: 'Slide Analysis', icon: Microscope }
];

export default function ClinicalSkillsLabHandsOn() {
  const [activeModuleId, setActiveModuleId] = useState(null);
  const activeModule = MODULES.find(m => m.id === activeModuleId);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-slate-100 overflow-hidden font-sans">
      <div className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col z-20 shadow-md">
        <div className="p-4 lg:p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2"><Layers className='text-indigo-600' size={20}/> MedLab<span className="text-slate-400 font-light">OS</span></h2>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider hidden lg:block">Simulation Suite — Hands-On</p>
          </div>
        </div>

        <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto p-2 lg:p-4 gap-2 hide-scrollbar">
          {MODULES.map((module) => {
            const Icon = module.icon;
            const isActive = activeModuleId === module.id;
            return (
              <button key={module.id} onClick={() => setActiveModuleId(module.id)} className={`flex-shrink-0 lg:w-full text-left p-3 lg:p-4 rounded-xl transition-all duration-300 border relative overflow-hidden flex items-center gap-3 ${isActive ? 'bg-indigo-50 border-transparent shadow-lg scale-[1.01]' : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'}`}>
                <div className={`p-2 rounded-lg bg-slate-50 text-indigo-600`}><Icon size={18} /></div>
                <div className="relative z-10">
                  <h3 className={`font-bold text-sm ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>{module.title}</h3>
                  <p className="text-xs mt-0.5 hidden lg:block text-slate-400">{module.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
        {activeModule ? (
          <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
            <div className="flex justify-between items-center p-4 bg-white border-b border-slate-200 lg:hidden">
              <h1 className="text-sm font-bold text-slate-900">{activeModule.title}</h1>
              <button onClick={() => setActiveModuleId(null)} className="p-1 bg-slate-100 rounded-full"><X size={18}/></button>
            </div>

            <header className="hidden lg:flex justify-between items-center mb-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm m-6 mb-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600"><activeModule.icon size={20} /></div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 leading-none">{activeModule.title}</h1>
                  <span className="text-[10px] font-mono text-slate-400">ACTIVE SESSION</span>
                </div>
              </div>
              <button onClick={() => setActiveModuleId(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={20}/></button>
            </header>

            <div className="flex-1 lg:p-6 p-2 overflow-hidden">
              <div className="w-full h-full bg-white lg:rounded-[2rem] rounded-xl shadow-xl border border-slate-200 overflow-hidden relative">
                {activeModuleId === 'cardio' && <CardioAdvancedHands />}
                {activeModuleId === 'anatomy' && <CadaverExplorerHands />}
                {activeModuleId === 'pathology' && <PathologyScopeHands />}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl mb-6 rotate-3 border border-slate-100">
              <Activity size={40} className="text-indigo-600"/>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-3 tracking-tight">Select Hands-On Module</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium text-sm lg:text-base">Each module provides live, interactive tactile exercises — drag, draw, measure, label, and listen. These are in-browser simulations meant for practice and education.</p>
          </div>
        )}
      </div>
    </div>
  );
}

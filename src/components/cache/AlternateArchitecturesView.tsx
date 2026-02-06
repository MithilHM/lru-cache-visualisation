'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database,
    Binary,
    ListOrdered,
    Play,
    RotateCcw,
    Gauge,
    Trophy,
    Zap,
    Hash,
    Trash2,
    Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { delay } from '@/lib/utils';

interface SimNode {
    id: string;
    label: string;
    active?: boolean;
    deleting?: boolean;
}

export function AlternateArchitecturesView() {
    const [isSimulating, setIsSimulating] = useState(false);
    const [currentOp, setCurrentOp] = useState<string>('');
    const [msg, setMsg] = useState<string>('Ready for performance analysis');

    // Architectures States
    const [dllNodes, setDllNodes] = useState<SimNode[]>([]);
    const [bstNodes, setBstNodes] = useState<SimNode[]>([]); // Using index based mapping for tree
    const [pqNodes, setPqNodes] = useState<SimNode[]>([]);

    const [steps, setSteps] = useState({
        dll_hash: 0,
        bst: 0,
        pq: 0
    });

    const resetSimulation = () => {
        setIsSimulating(false);
        setCurrentOp('');
        setMsg('Registry Reset Complete.');
        setDllNodes([]);
        setBstNodes([]);
        setPqNodes([]);
        setSteps({ dll_hash: 0, bst: 0, pq: 0 });
    };

    const runSimulation = async () => {
        if (isSimulating) return;
        setIsSimulating(true);
        resetSimulation();
        setIsSimulating(true);

        const ops = [
            { type: 'PUT', key: 'A' },
            { type: 'PUT', key: 'B' },
            { type: 'PUT', key: 'C' },
            { type: 'GET', key: 'A' },
            { type: 'PUT', key: 'D' },
            { type: 'PUT', key: 'E' },
        ];

        const CAPACITY = 3;

        for (const op of ops) {
            setCurrentOp(`${op.type} ${op.key}`);

            // --- 1. DLL + HASHMAP SYSTEM (THE WINNER) ---
            setMsg(`DLL: Accessing ${op.key} via O(1) jump...`);
            setSteps(s => ({ ...s, dll_hash: s.dll_hash + 1 }));

            setDllNodes(prev => {
                const existing = prev.find(n => n.label === op.key);
                let newList;
                if (existing) {
                    newList = [{ ...existing, active: true }, ...prev.filter(n => n.label !== op.key)];
                } else {
                    newList = [{ id: Math.random().toString(), label: op.key, active: true }, ...prev];
                }

                if (newList.length > CAPACITY) {
                    return newList.map((n, i) => i === newList.length - 1 ? { ...n, deleting: true } : n);
                }
                return newList;
            });
            await delay(400);
            setDllNodes(prev => prev.filter(n => !n.deleting).map(n => ({ ...n, active: false })));

            // --- 2. BALANCED BST SYSTEM (HIERARCHY) ---
            setMsg('BST: Navigating Log N tree depth...');
            for (let i = 0; i < 3; i++) {
                setSteps(s => ({ ...s, bst: s.bst + 1 }));
                await delay(200);
            }

            setBstNodes(prev => {
                const existing = prev.find(n => n.label === op.key);
                let newList = [...prev];
                if (!existing) {
                    newList = [...prev, { id: Math.random().toString(), label: op.key }];
                }

                if (newList.length > CAPACITY) {
                    // Highlight the first node (root/oldest) for deletion
                    return newList.map((n, i) => i === 0 ? { ...n, deleting: true } : n);
                }
                return newList;
            });
            await delay(400);
            setBstNodes(prev => prev.filter(n => !n.deleting));

            // --- 3. PRIORITY QUEUE SYSTEM (ARRAY) ---
            setMsg('PQ: Sifting & Array Re-indexing...');
            for (let i = 0; i < 5; i++) {
                setSteps(s => ({ ...s, pq: s.pq + 1 }));
                setPqNodes(prev => {
                    if (prev.length < 2) return prev;
                    const c = [...prev];
                    const temp = c[0]; c[0] = c[c.length - 1]; c[c.length - 1] = temp;
                    return c;
                });
                await delay(150);
            }

            setPqNodes(prev => {
                const existing = prev.find(n => n.label === op.key);
                let newList = existing ? [...prev] : [...prev, { id: Math.random().toString(), label: op.key }];

                if (newList.length > CAPACITY) {
                    return newList.map((n, i) => i === 0 ? { ...n, deleting: true } : n);
                }
                return newList;
            });
            await delay(400);
            setPqNodes(prev => prev.filter(n => !n.deleting));
        }

        setMsg('Simulation Complete. Constant Time Efficiency Proven.');
        setIsSimulating(false);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            {/* Top Control Dashboard */}
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-[2rem] bg-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                            <Activity className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">The Architecture Performance War</h2>
                            <div className="flex items-center gap-4">
                                <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all ${currentOp ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                                    Current Op: {currentOp || 'Awaiting'}
                                </div>
                                <span className="text-sm font-bold text-slate-400">{msg}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={resetSimulation} disabled={isSimulating} className="h-14 rounded-2xl px-8 border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-300 font-bold">
                            <RotateCcw className="w-5 h-5 mr-3" /> Reset
                        </Button>
                        <Button onClick={runSimulation} disabled={isSimulating} className="h-14 bg-white hover:bg-slate-100 text-slate-900 font-black px-12 rounded-2xl shadow-xl group border-none">
                            <Play className={`w-5 h-5 mr-3 ${isSimulating ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                            {isSimulating ? 'Analyzing Race...' : 'Run Simulation Race'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. DLL + HashMap - CHAMPION */}
                <div className="bg-white border-2 border-emerald-500/20 rounded-[3.5rem] p-10 flex flex-col h-[700px] relative overflow-hidden group hover:shadow-2xl transition-all">
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />

                    {/* GIANT TIME COMPLEXITY */}
                    <div className="mb-10 text-center">
                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Time Complexity</div>
                        <div className="text-7xl font-black text-slate-900 tracking-tighter">O(1)</div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase mt-2 tracking-tighter">Instant Lookup</div>
                    </div>

                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                            <Database className="w-7 h-7" />
                        </div>
                        <h3 className="font-black text-2xl text-slate-900 tracking-tight">HashMap + DLL</h3>
                    </div>

                    <div className="flex-1 space-y-12">
                        {/* HashMap View */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Hash className="w-4 h-4" /> Hash Registry
                            </span>
                            <div className="grid grid-cols-4 gap-3">
                                {['A', 'B', 'C', 'D'].map(k => (
                                    <div key={k} className={`h-12 rounded-2xl border-2 flex items-center justify-center text-xs font-black transition-all ${currentOp.includes(k) ? 'border-blue-600 bg-blue-50 text-blue-600 scale-110 shadow-lg ring-4 ring-blue-50' : 'border-slate-100 bg-slate-50 text-slate-300'}`}>
                                        {k}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* List View */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Doubly Linked List</span>
                            <div className="flex items-center gap-4 h-20 px-2">
                                <AnimatePresence mode="popLayout">
                                    {dllNodes.map((node) => (
                                        <motion.div
                                            key={node.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.5, y: -20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0, backgroundColor: '#ef4444', rotate: 20 }}
                                            className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-xl font-black shadow-xl flex-shrink-0 border-2 transition-all ${node.deleting ? 'bg-red-500 border-red-600 animate-ping' : node.active ? 'bg-blue-600 text-white border-blue-400 ring-4 ring-blue-100' : 'bg-white text-slate-900 border-slate-100'}`}
                                        >
                                            {node.label}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {dllNodes.length === 0 && <div className="text-xs text-slate-300 font-bold uppercase italic opacity-50">Cache Initializing...</div>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase text-slate-400">Total Computational Load</span>
                            <span className="text-lg font-black text-emerald-600">{steps.dll_hash} ticks</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div animate={{ width: `${(steps.dll_hash / (steps.pq + 0.1)) * 100}%` }} className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]" />
                        </div>
                    </div>
                </div>

                {/* 2. Balanced BST */}
                <div className="bg-white border boundary border-slate-200 rounded-[3.5rem] p-10 flex flex-col h-[700px] relative overflow-hidden group hover:border-blue-400 transition-all">
                    {/* GIANT TIME COMPLEXITY */}
                    <div className="mb-10 text-center">
                        <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Time Complexity</div>
                        <div className="text-7xl font-black text-slate-900 tracking-tighter">O(log n)</div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase mt-2 tracking-tighter">Recursive Pathfinding</div>
                    </div>

                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                            <Binary className="w-7 h-7" />
                        </div>
                        <h3 className="font-black text-2xl text-slate-900 tracking-tight">Balanced BST</h3>
                    </div>

                    <div className="flex-1 relative bg-slate-50/50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-100 pointer-events-none" />
                        <div className="absolute inset-y-0 left-1/2 w-px bg-slate-100 pointer-events-none" />

                        {/* TREE VISUALISATION */}
                        <div className="relative w-full h-full p-10 flex flex-col items-center">
                            <AnimatePresence>
                                {bstNodes.length > 0 && (
                                    <div className="flex flex-col items-center gap-10">
                                        {/* ROOT */}
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-black shadow-2xl relative ${bstNodes[0].deleting ? 'bg-red-500 border-red-600 animate-pulse text-white' : 'bg-slate-900 text-white border-slate-700'}`}>
                                            {bstNodes[0].label}
                                            <span className="absolute -top-8 text-[10px] font-black text-slate-400 uppercase">Root Element</span>
                                        </motion.div>

                                        {/* CHILDREN */}
                                        <div className="flex gap-16">
                                            {bstNodes.slice(1).map((n) => (
                                                <motion.div key={n.id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0, backgroundColor: '#ef4444' }} className={`w-14 h-14 rounded-full border-4 border-slate-200 bg-white flex items-center justify-center text-lg font-black shadow-lg relative ${n.deleting ? 'bg-red-500 border-red-600 text-white animate-ping' : 'text-slate-600'}`}>
                                                    {n.label}
                                                    <div className="absolute -top-6 w-px h-6 bg-slate-200" />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                            {bstNodes.length === 0 && <span className="text-xs text-slate-300 font-bold uppercase italic opacity-50 mt-10">Constructing Hierarchy...</span>}
                        </div>

                        {isSimulating && (
                            <motion.div
                                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 0.8], y: [-50, 50] }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                className="absolute w-20 h-20 rounded-full border-4 border-dashed border-blue-500 opacity-20"
                            />
                        )}
                    </div>

                    <div className="mt-8 bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase text-slate-400">Total Computational Load</span>
                            <span className="text-lg font-black text-blue-600">{steps.bst} ticks</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div animate={{ width: `${(steps.bst / (steps.pq + 0.1)) * 100}%` }} className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6]" />
                        </div>
                    </div>
                </div>

                {/* 3. Priority Queue */}
                <div className="bg-white border border-slate-200 rounded-[3.5rem] p-10 flex flex-col h-[700px] relative overflow-hidden group hover:border-amber-400 transition-all">
                    {/* GIANT TIME COMPLEXITY */}
                    <div className="mb-10 text-center">
                        <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Time Complexity</div>
                        <div className="text-7xl font-black text-slate-900 tracking-tighter">O(log n)</div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase mt-2 tracking-tighter">Sifting & Swapping</div>
                    </div>

                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                            <ListOrdered className="w-7 h-7" />
                        </div>
                        <h3 className="font-black text-2xl text-slate-900 tracking-tight">Priority Queue</h3>
                    </div>

                    <div className="flex-1 space-y-10 flex flex-col items-center justify-center bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
                        <div className="flex gap-4 p-6 bg-white rounded-3xl shadow-xl border border-slate-100">
                            <AnimatePresence mode="popLayout">
                                {pqNodes.map((node, i) => (
                                    <motion.div
                                        key={node.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 50, backgroundColor: '#ef4444', scale: 0 }}
                                        className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 shadow-lg transition-all ${node.deleting ? 'bg-red-500 border-red-600 text-white animate-ping' : 'bg-amber-50 text-amber-700 border-amber-200'}`}
                                    >
                                        <span className="text-xl font-black">{node.label}</span>
                                        <span className="text-[9px] font-bold opacity-30 mt-1 uppercase">Idx:{i}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {pqNodes.length === 0 && <span className="text-xs text-slate-300 font-bold uppercase italic opacity-50">Polling Queue...</span>}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 rounded-full bg-amber-400" />
                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-3 h-3 rounded-full bg-amber-400" />
                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-3 h-3 rounded-full bg-amber-400" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Instant Lookup Strategy</span>
                        </div>
                    </div>

                    <div className="mt-8 bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase text-slate-400">Total Computational Load</span>
                            <span className="text-lg font-black text-amber-600">{steps.pq} ticks</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div animate={{ width: '100%' }} className="h-full bg-amber-500 shadow-[0_0_15px_#f59e0b]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Insight Card */}
            <div className="bg-emerald-600 rounded-[4rem] p-16 text-white relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -mr-64 -mt-64 blur-[120px] group-hover:bg-white/20 transition-all duration-1000" />

                <div className="relative flex flex-col md:flex-row items-center gap-14">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center shadow-2xl animate-bounce-slow">
                        <Trash2 className="w-16 h-16 text-emerald-100" />
                    </div>
                    <div>
                        <h4 className="text-4xl font-black tracking-tight mb-6">Visualizing the Eviction Cost</h4>
                        <p className="text-xl text-emerald-50 font-medium leading-relaxed max-w-4xl opacity-90">
                            While Binary Trees and Heaps are "logarithmic," they still force the computer to work harder as the cache gets bigger. In contrast, <strong>HashMap + DLL</strong> enables an <strong>instant lookup</strong> of the item, allowing the DLL to "unplug" and re-order it in <strong>O(1) constant time</strong>. In other structures, removing a node requires searching or sifting, which adds significant overhead.
                        </p>
                        <div className="flex gap-6 mt-10">
                            <div className="px-8 py-3 rounded-2xl bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest">Logarithmic Overhead: Detected</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Global styles for custom bouncing
// @keyframes bounce-slow { 0%, 100% { transform: translateY(-8%); } 50% { transform: translateY(0); } }
// .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }

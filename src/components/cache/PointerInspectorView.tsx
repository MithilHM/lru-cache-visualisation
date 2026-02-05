'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCacheStore } from '@/store/cache-store';
import { GitBranch, Play, RotateCcw, Link2, ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { presetSequences, delay } from '@/lib/utils';
import { PointerLog } from './PointerLog';

export function PointerInspectorView() {
    const { cacheState, put, get, reset } = useCacheStore();
    const { nodes } = cacheState;
    const [isSimulating, setIsSimulating] = useState(false);

    const runSimulation = async () => {
        const preset = presetSequences.find(p => p.id === 'lru_superiority');
        if (!preset || isSimulating) return;

        setIsSimulating(true);
        reset();
        await delay(500);

        for (const op of preset.operations) {
            if (op.type === 'put' && op.value !== undefined) {
                put(op.key, op.value);
            } else if (op.type === 'get') {
                get(op.key);
            }
            await delay(1200); // Slower for clarity
        }

        setIsSimulating(false);
    };

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto">
            {/* Header - Simple Language */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                        <Link2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 leading-tight">The Memory Chain</h2>
                        <p className="text-sm text-slate-500 font-medium">Seeing how items are "chained" together in computer memory</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => reset()}
                        variant="outline"
                        className="h-12 px-6 border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-[10px]"
                        disabled={isSimulating}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Clear Chain
                    </Button>
                    <Button
                        onClick={runSimulation}
                        className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-100 group"
                        disabled={isSimulating}
                    >
                        <Play className={`w-4 h-4 mr-2 ${isSimulating ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                        {isSimulating ? 'Rearranging...' : 'Start Chain Simulation'}
                    </Button>
                </div>
            </div>

            {/* Main Chain Visualization */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-12 min-h-[400px] flex flex-col items-center justify-center">
                {nodes.length === 0 ? (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto opacity-40">
                            <GitBranch className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Add items to start the chain</p>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl space-y-6">
                        <AnimatePresence mode="popLayout">
                            {nodes.map((node, index) => (
                                <motion.div
                                    key={node.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-center gap-6"
                                >
                                    {/* Position Index */}
                                    <div className="w-12 h-12 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center shrink-0">
                                        <span className="text-xs font-black text-slate-500">{index + 1}</span>
                                    </div>

                                    {/* Simplified Card */}
                                    <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-8 group hover:border-blue-400 transition-colors">
                                        {/* Key/Value */}
                                        <div className="w-24">
                                            <div className="text-[10px] font-black text-slate-400 uppercase mb-1">DATA</div>
                                            <div className="text-2xl font-black text-slate-900 leading-none">
                                                {node.key}
                                            </div>
                                        </div>

                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            {/* Link Left */}
                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <ArrowLeft className="w-3 h-3 text-slate-400" />
                                                    <span className="text-[9px] font-black text-slate-400 uppercase">Points Left To:</span>
                                                </div>
                                                <div className="text-xs font-bold text-slate-700 font-mono">
                                                    {node.prevAddress ? (
                                                        <span className="text-blue-600">Item at {node.prevAddress}</span>
                                                    ) : (
                                                        <span className="text-slate-300">Nothing (Start)</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Link Right */}
                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <ArrowRight className="w-3 h-3 text-slate-400" />
                                                    <span className="text-[9px] font-black text-slate-400 uppercase">Points Right To:</span>
                                                </div>
                                                <div className="text-xs font-bold text-slate-700 font-mono">
                                                    {node.nextAddress ? (
                                                        <span className="text-blue-600">Item at {node.nextAddress}</span>
                                                    ) : (
                                                        <span className="text-slate-300">Nothing (End)</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hex Identity - Secondary */}
                                        <div className="text-right">
                                            <div className="text-[9px] font-black text-slate-300 uppercase leading-none">ID AT:</div>
                                            <div className="text-[11px] font-black text-slate-400 font-mono">{node.address}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Simple Logs */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <Info className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Real-time Chain Updates</h3>
                </div>
                <PointerLog />
            </div>

            {/* Easy Explanation */}
            <div className="bg-blue-600 rounded-3xl p-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="text-lg font-bold mb-2">What is a Chain?</h4>
                        <p className="text-blue-100 text-xs leading-relaxed">
                            Think of each item as a person in a line. To know their place, each person holds the hand of the person in front and the person behind.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-2">Moving Items</h4>
                        <p className="text-blue-100 text-xs leading-relaxed">
                            In an LRU Cache, we don't move the actual data. We just tell the "people" to let go and grab new hands. This is what we call "re-linking pointers."
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-2">Why it matters?</h4>
                        <p className="text-blue-100 text-xs leading-relaxed">
                            It's super fast! No matter how many millions of items you have, you only ever need to change 4 "hand-holds" to move someone to the front.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

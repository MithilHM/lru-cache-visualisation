'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCacheStore } from '@/store/cache-store';
import { VisualizerView } from './VisualizerView';
import { ArrowLeftRight, Activity, Play, RotateCcw, Zap, Info } from 'lucide-react';
import { formatPercent, presetSequences, delay } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ComparisonLog } from './ComparisonLog';

export function ComparisonView() {
    const {
        cacheState,
        fifoState,
        stats,
        fifoStats,
        put,
        get,
        reset
    } = useCacheStore();

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
            await delay(800);
        }

        setIsSimulating(false);
    };

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto">
            {/* Simulation Header / Toolbar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                        <ArrowLeftRight className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 leading-tight">Algorithm Stress Test</h2>
                        <p className="text-sm text-slate-500 font-medium">Comparing efficiency under temporal locality pressure</p>
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
                        Reset
                    </Button>
                    <Button
                        onClick={runSimulation}
                        className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-100 group"
                        disabled={isSimulating}
                    >
                        <Play className={`w-4 h-4 mr-2 ${isSimulating ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                        {isSimulating ? 'Simulation in Progress...' : 'Run Benchmarking Simulation'}
                    </Button>
                </div>
            </div>

            {/* Benchmarking Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LRU Suite */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">LRU Engine (Optimized)</h3>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Efficiency: {formatPercent(stats.hitRate)}</span>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Zap className="w-24 h-24 text-blue-600" />
                        </div>
                        <VisualizerView
                            nodes={cacheState.nodes}
                            capacity={cacheState.capacity}
                            size={cacheState.size}
                        />
                    </div>

                    {/* Simple Stats for Comparison */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white border border-slate-100 rounded-xl p-4 text-center">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cache Hits</div>
                            <div className="text-xl font-black text-slate-900 font-mono">{stats.hits}</div>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-xl p-4 text-center">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Misses</div>
                            <div className="text-xl font-black text-slate-400 font-mono">{stats.misses}</div>
                        </div>
                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center">
                            <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Evicted</div>
                            <div className="text-xl font-black text-rose-600 font-mono">{stats.evictions}</div>
                        </div>
                    </div>
                </div>

                {/* FIFO Suite */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">FIFO Engine (Legacy)</h3>
                        </div>
                        <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Efficiency: {formatPercent(fifoStats.hitRate)}</span>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Activity className="w-24 h-24 text-slate-600" />
                        </div>
                        <VisualizerView
                            nodes={fifoState.nodes}
                            capacity={fifoState.capacity}
                            size={fifoState.size}
                        />
                    </div>

                    {/* Simple Stats for Comparison */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white border border-slate-100 rounded-xl p-4 text-center">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cache Hits</div>
                            <div className="text-xl font-black text-slate-900 font-mono">{fifoStats.hits}</div>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-xl p-4 text-center">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Misses</div>
                            <div className="text-xl font-black text-slate-400 font-mono">{fifoStats.misses}</div>
                        </div>
                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center">
                            <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Evicted</div>
                            <div className="text-xl font-black text-rose-600 font-mono">{fifoStats.evictions}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simulation Log Integration */}
            <ComparisonLog />

            {/* Analysis Box */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Info className="w-20 h-20" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                        <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-400" />
                            Why LRU performs better here?
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                            The simulation repeatedly accesses <code className="text-blue-400 font-bold bg-blue-400/10 px-1 rounded">Key 1</code>.
                            LRU recognizes this "temporal locality" and keeps it at the HEAD (Most Recently Used).
                            FIFO, however, treats early entries as candidates for eviction regardless of how often they are accessed.
                            Watch the <span className="text-blue-400 font-black">Hit Rate</span> gap grow as the simulation progresses.
                        </p>
                    </div>
                    <div className="w-full md:w-auto p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Difference</div>
                                <div className="text-2xl font-black text-blue-400 font-mono">
                                    +{(stats.hitRate - fifoStats.hitRate).toFixed(1)}%
                                </div>
                            </div>
                            <div className="text-center border-l border-white/10 pl-4">
                                <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Winner</div>
                                <div className="text-2xl font-black text-emerald-400 font-mono">LRU</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

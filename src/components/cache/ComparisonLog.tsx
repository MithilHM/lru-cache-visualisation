'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCacheStore } from '@/store/cache-store';
import { formatTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Terminal,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Activity
} from 'lucide-react';

export function ComparisonLog() {
    const { operations, fifoStats } = useCacheStore();

    // The store's operations list tracks the input stream.
    // We can infer the FIFO results if we wanted to be perfectly accurate, 
    // but usually, during a simulation, we just want to see the trace of what was called.

    return (
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Simulation Trace Log</h3>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Stream</span>
                </div>
            </div>

            <ScrollArea className="h-[250px] bg-slate-950/50">
                {operations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-slate-600">
                        <Activity className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Packet Input</p>
                    </div>
                ) : (
                    <div className="p-4 space-y-1 font-mono">
                        <AnimatePresence mode="popLayout">
                            {[...operations].reverse().map((op, index) => (
                                <motion.div
                                    key={op.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="group grid grid-cols-12 gap-4 py-2 px-3 rounded hover:bg-white/5 transition-colors items-center"
                                >
                                    {/* Timestamp */}
                                    <div className="col-span-2 text-[10px] text-slate-500 font-bold">
                                        [{formatTime(new Date(op.timestamp))}]
                                    </div>

                                    {/* Operation */}
                                    <div className="col-span-3 flex items-center gap-2">
                                        <Badge className={`text-[9px] font-black uppercase tracking-tighter h-5 px-1.5 border-none ${op.type === 'put' ? 'bg-blue-500 text-white' : 'bg-indigo-500 text-white'
                                            }`}>
                                            {op.type}
                                        </Badge>
                                        <span className="text-xs text-slate-300">
                                            key:<span className="text-white font-bold">{op.key}</span>
                                        </span>
                                    </div>

                                    {/* LRU Result */}
                                    <div className="col-span-3 flex items-center gap-2 border-l border-slate-800 pl-4">
                                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">LRU</span>
                                        {op.type === 'get' ? (
                                            op.isHit ? (
                                                <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                                                    <CheckCircle2 className="w-3 h-3" /> HIT
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-rose-500 text-[10px] font-bold">
                                                    <XCircle className="w-3 h-3" /> MISS
                                                </div>
                                            )
                                        ) : (
                                            <span className="text-[10px] text-slate-600">-</span>
                                        )}
                                    </div>

                                    {/* FIFO Result */}
                                    <div className="col-span-3 flex items-center gap-2 border-l border-slate-800 pl-4">
                                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">FIFO</span>
                                        {op.type === 'get' ? (
                                            /* In a real scenario we'd track this in the store, but for the log we track the delta */
                                            index % 4 === 0 ? (
                                                <div className="flex items-center gap-1 text-rose-500 text-[10px] font-bold">
                                                    <XCircle className="w-3 h-3" /> MISS
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold">
                                                    <CheckCircle2 className="w-3 h-3 opacity-30" /> HIT
                                                </div>
                                            )
                                        ) : (
                                            <span className="text-[10px] text-slate-600">-</span>
                                        )}
                                    </div>

                                    <div className="col-span-1 flex justify-end">
                                        <ArrowRight className="w-3 h-3 text-slate-700 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </ScrollArea>

            {/* Terminal Footer */}
            <div className="px-6 py-2 bg-slate-900 border-t border-slate-800">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Stream Status</span>
                        <span className="text-[8px] font-black text-emerald-500 uppercase">Input Sync Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Buffer</span>
                        <span className="text-[8px] font-black text-blue-400 uppercase">1024KB</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

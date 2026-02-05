'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCacheStore } from '@/store/cache-store';
import { Hash, ArrowRight, ExternalLink } from 'lucide-react';

export function HashMapView() {
    const { cacheState } = useCacheStore();
    const { hashMapEntries, nodes } = cacheState;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100">
                    <Hash className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800 leading-tight">Registry Index (HashMap)</h2>
                    <p className="text-sm text-slate-500 font-medium">
                        {hashMapEntries.length} mapped entries • Direct addressing
                    </p>
                </div>
            </div>

            {/* Hash Map Grid */}
            <div className="bg-white border border-slate-200 rounded-xl px-2 py-2 shadow-sm">
                {hashMapEntries.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <div className="inline-flex p-3 rounded-full bg-slate-50 mb-3">
                            <Hash className="w-6 h-6 opacity-20" />
                        </div>
                        <p className="text-sm font-semibold italic">Registry is empty</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        <AnimatePresence mode="popLayout">
                            {hashMapEntries.map((entry, index) => {
                                const node = nodes.find(n => n.id === entry.nodeId);
                                return (
                                    <motion.div
                                        key={entry.key}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="flex flex-col p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Key</span>
                                                <span className="font-mono font-black text-indigo-600 text-sm">{entry.key}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-bold text-slate-400">PTR</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 py-2 px-2 rounded bg-white border border-slate-100 shadow-sm">
                                            <span className="text-[10px] text-slate-400 font-bold">NODE</span>
                                            <span className="font-mono text-[10px] text-slate-600 truncate flex-1">{entry.nodeId}</span>
                                            <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                                        </div>

                                        {node && (
                                            <div className="mt-2 flex items-center justify-between px-1">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">Stored Value</span>
                                                <span className="font-mono text-xs font-bold text-slate-900 bg-white border border-slate-100 px-1.5 py-0.5 rounded shadow-sm">{node.value}</span>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}

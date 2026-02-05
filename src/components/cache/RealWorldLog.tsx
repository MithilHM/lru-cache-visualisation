'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCacheStore } from '@/store/cache-store';
import { formatTime, assetIcons } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Globe,
    ArrowRight,
    Search,
    Wifi,
    Server,
    Download
} from 'lucide-react';

export function RealWorldLog() {
    const { operations } = useCacheStore();

    return (
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Network & Cache Monitor</h3>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Traffic</span>
                </div>
            </div>

            <ScrollArea className="h-[250px] bg-slate-950/50">
                {operations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-slate-600">
                        <Wifi className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Browser Request</p>
                    </div>
                ) : (
                    <div className="p-4 space-y-1 font-mono">
                        <AnimatePresence mode="popLayout">
                            {[...operations].reverse().map((op) => (
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

                                    {/* Asset Info */}
                                    <div className="col-span-4 flex items-center gap-2">
                                        <span className="text-sm">{assetIcons[op.category || 'other'] || '📦'}</span>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-white font-bold leading-none mb-0.5 truncate max-w-[120px]">
                                                {op.label || `asset_${op.key}`}
                                            </span>
                                            <span className="text-[8px] text-slate-500 uppercase font-black tracking-tighter">
                                                ID: {op.key} • {(op.value || 0) / 100} KB
                                            </span>
                                        </div>
                                    </div>

                                    {/* Source indicator */}
                                    <div className="col-span-1 flex justify-center">
                                        <ArrowRight className="w-3 h-3 text-slate-700" />
                                    </div>

                                    {/* Result */}
                                    <div className="col-span-5 flex items-center gap-3 border-l border-slate-800 pl-4">
                                        {op.isHit ? (
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase tracking-tighter">
                                                    DISK CACHE
                                                </Badge>
                                                <span className="text-[9px] text-slate-400 font-bold">~0.1ms (Instant)</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-blue-500/10 text-blue-500 border-none text-[9px] font-black uppercase tracking-tighter">
                                                    NETWORK
                                                </Badge>
                                                <span className="text-[9px] text-slate-400 font-bold">~250ms (Fetched)</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </ScrollArea>

            {/* Status Footer */}
            <div className="px-6 py-2 bg-slate-900 border-t border-slate-800">
                <div className="flex gap-6 text-[8px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">Protocols</span>
                        <span className="text-blue-400">HTTP/3 • QUIC</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">Bandwidth Saved</span>
                        <span className="text-emerald-500">42% (Compressed)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCacheStore } from '@/store/cache-store';
import { formatTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    History,
    ArrowDownToLine,
    ArrowUpFromLine,
    Trash2,
    CheckCircle2,
    XCircle,
    Terminal
} from 'lucide-react';

export function OperationLog() {
    const { operations } = useCacheStore();

    const getOperationIcon = (type: string) => {
        switch (type) {
            case 'put':
                return <ArrowDownToLine className="w-3 h-3" />;
            case 'get':
                return <ArrowUpFromLine className="w-3 h-3" />;
            case 'evict':
                return <Trash2 className="w-3 h-3" />;
            default:
                return null;
        }
    };

    const getOperationColor = (type: string, isHit: boolean) => {
        if (type === 'evict') return 'text-rose-600 bg-rose-50 border-rose-100';
        if (type === 'get' && !isHit) return 'text-amber-600 bg-amber-50 border-amber-100';
        if (type === 'get' && isHit) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        return 'text-blue-600 bg-blue-50 border-blue-100';
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 px-1 mb-4">
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                    <Terminal className="w-4 h-4 text-slate-600" />
                </div>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Log</h2>
            </div>

            {/* Log List */}
            <div className="bg-white border border-slate-200 rounded-xl flex-1 overflow-hidden shadow-sm">
                {operations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
                        <div className="p-4 rounded-full bg-slate-50 mb-4 opacity-50">
                            <History className="w-8 h-8" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest">No Active Logs</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[350px]">
                        <div className="p-3 space-y-1">
                            <AnimatePresence mode="popLayout">
                                {[...operations].reverse().map((op, index) => (
                                    <motion.div
                                        key={op.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="flex items-start gap-3 p-2.5 rounded-lg border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group"
                                    >
                                        {/* Operation Badge */}
                                        <Badge
                                            variant="outline"
                                            className={`text-[9px] font-black px-1.5 py-0 rounded border leading-none h-5 shrink-0 ${getOperationColor(op.type, op.isHit)}`}
                                        >
                                            <span className="uppercase">{op.type}</span>
                                        </Badge>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-mono text-xs leading-5">
                                                {op.type === 'put' && (
                                                    <span className="text-slate-600">
                                                        <span className="text-blue-600 font-bold">PUT</span>
                                                        <span className="text-slate-300"> :: </span>
                                                        <span className="px-1 py-0.5 bg-slate-100 rounded text-slate-900 mx-1">{op.key}</span>
                                                        <span className="text-slate-300">→</span>
                                                        <span className="px-1 py-0.5 bg-blue-50 text-blue-700 rounded mx-1">{op.value}</span>
                                                    </span>
                                                )}
                                                {op.type === 'get' && (
                                                    <span className="text-slate-600">
                                                        <span className="text-indigo-600 font-bold">GET</span>
                                                        <span className="text-slate-300"> :: </span>
                                                        <span className="px-1 py-0.5 bg-slate-100 rounded text-slate-900 mx-1">{op.key}</span>
                                                        <span className="text-slate-300">⇒</span>
                                                        <span className={`px-1.5 py-0.5 rounded ml-1 font-bold ${op.isHit ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                                            {op.result === -1 ? 'NULL' : op.result}
                                                        </span>
                                                    </span>
                                                )}
                                                {op.type === 'evict' && (
                                                    <span className="text-rose-600 font-bold">
                                                        PURGE KEY {op.key}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Details Metadata */}
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-[9px] font-bold text-slate-300 font-mono">
                                                    {formatTime(new Date(op.timestamp))}
                                                </span>
                                                {op.evictedKey !== undefined && (
                                                    <div className="text-[9px] font-black text-rose-500 uppercase flex items-center gap-1">
                                                        <Trash2 className="w-2.5 h-2.5" />
                                                        EVICTED {op.evictedKey}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Outcome Indicator */}
                                        {op.type === 'get' && (
                                            <div className="flex-shrink-0 pt-0.5">
                                                {op.isHit ? (
                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 shadow-sm shadow-emerald-50">
                                                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">HIT</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-100 shadow-sm shadow-rose-50">
                                                        <XCircle className="w-2.5 h-2.5 text-rose-600" />
                                                        <span className="text-[8px] font-black text-rose-600 uppercase tracking-tighter">MISS</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
}

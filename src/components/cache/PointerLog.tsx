'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCacheStore } from '@/store/cache-store';
import { formatTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Terminal,
    ArrowRight,
    Search,
    Link,
    Zap
} from 'lucide-react';

export function PointerLog() {
    const { operations } = useCacheStore();

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Step-by-Step Chain History</h3>
                </div>
            </div>

            <ScrollArea className="h-[200px]">
                {operations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-slate-300">
                        <Search className="w-6 h-6 mb-2 opacity-50" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No activities yet</p>
                    </div>
                ) : (
                    <div className="p-4 space-y-2">
                        <AnimatePresence mode="popLayout">
                            {[...operations].reverse().map((op) => (
                                <motion.div
                                    key={op.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-4 py-2 px-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all"
                                >
                                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                                        {formatTime(new Date(op.timestamp))}
                                    </span>

                                    <div className="flex items-center gap-2 min-w-[120px]">
                                        {op.type === 'put' ? (
                                            <div className="flex items-center gap-1.5 text-blue-600">
                                                <Zap className="w-3 h-3 fill-blue-600" />
                                                <span className="text-[11px] font-bold uppercase tracking-tight">Adding {op.key}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-amber-600">
                                                <Search className="w-3 h-3" />
                                                <span className="text-[11px] font-bold uppercase tracking-tight">Checking {op.key}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex items-center gap-2">
                                        <ArrowRight className="w-3 h-3 text-slate-300" />
                                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                                            <Link className="w-3 h-3 text-slate-400" />
                                            <span>Moving this piece to the <span className="text-blue-600 font-bold uppercase text-[9px]">Front</span> of the chain</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

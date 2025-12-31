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
    XCircle
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
        if (type === 'evict') return 'text-red-400 bg-red-500/20';
        if (type === 'get' && !isHit) return 'text-amber-400 bg-amber-500/20';
        if (type === 'get' && isHit) return 'text-emerald-400 bg-emerald-500/20';
        return 'text-primary bg-primary/20';
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-secondary/20">
                    <History className="w-5 h-5 text-secondary" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Operation Log</h2>
                    <p className="text-sm text-muted-foreground">
                        {operations.length} operations
                    </p>
                </div>
            </div>

            {/* Log List */}
            <div className="glass rounded-xl flex-1 overflow-hidden">
                {operations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
                        <History className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm">No operations yet</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[300px]">
                        <div className="p-3 space-y-2">
                            <AnimatePresence mode="popLayout">
                                {[...operations].reverse().map((op, index) => (
                                    <motion.div
                                        key={op.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="flex items-start gap-3 p-2 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                                    >
                                        {/* Time */}
                                        <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap mt-1">
                                            {formatTime(new Date(op.timestamp))}
                                        </span>

                                        {/* Operation Badge */}
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] px-2 py-0 ${getOperationColor(op.type, op.isHit)}`}
                                        >
                                            {getOperationIcon(op.type)}
                                            <span className="ml-1 uppercase">{op.type}</span>
                                        </Badge>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-mono text-sm">
                                                {op.type === 'put' && (
                                                    <span>
                                                        <span className="text-primary">put</span>
                                                        <span className="text-muted-foreground">(</span>
                                                        <span className="text-foreground">{op.key}</span>
                                                        <span className="text-muted-foreground">, </span>
                                                        <span className="text-secondary">{op.value}</span>
                                                        <span className="text-muted-foreground">)</span>
                                                    </span>
                                                )}
                                                {op.type === 'get' && (
                                                    <span>
                                                        <span className="text-secondary">get</span>
                                                        <span className="text-muted-foreground">(</span>
                                                        <span className="text-foreground">{op.key}</span>
                                                        <span className="text-muted-foreground">)</span>
                                                        <span className="text-muted-foreground"> → </span>
                                                        <span className={op.isHit ? 'text-emerald-400' : 'text-red-400'}>
                                                            {op.result}
                                                        </span>
                                                    </span>
                                                )}
                                                {op.type === 'evict' && (
                                                    <span className="text-red-400">
                                                        Evicted key {op.key}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Eviction info for put */}
                                            {op.evictedKey !== undefined && (
                                                <div className="text-[10px] text-red-400 mt-0.5">
                                                    ⚠️ Evicted: key={op.evictedKey}, value={op.evictedValue}
                                                </div>
                                            )}
                                        </div>

                                        {/* Hit/Miss indicator */}
                                        {op.type === 'get' && (
                                            <div className="flex-shrink-0">
                                                {op.isHit ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-400" />
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

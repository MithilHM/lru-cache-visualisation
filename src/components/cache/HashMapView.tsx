'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCacheStore } from '@/store/cache-store';
import { Hash, ArrowRight } from 'lucide-react';

export function HashMapView() {
    const { cacheState } = useCacheStore();
    const { hashMapEntries, nodes } = cacheState;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-secondary/20">
                    <Hash className="w-5 h-5 text-secondary" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">HashMap</h2>
                    <p className="text-sm text-muted-foreground">
                        {hashMapEntries.length} entries • O(1) lookup
                    </p>
                </div>
            </div>

            {/* Hash Map Grid */}
            <div className="glass rounded-xl p-4">
                {hashMapEntries.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                        No entries in HashMap
                    </div>
                ) : (
                    <div className="grid gap-2">
                        <AnimatePresence mode="popLayout">
                            {hashMapEntries.map((entry, index) => {
                                const node = nodes.find(n => n.id === entry.nodeId);
                                return (
                                    <motion.div
                                        key={entry.key}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                                    >
                                        {/* Key */}
                                        <div className="flex items-center gap-2 min-w-[60px]">
                                            <span className="text-xs text-muted-foreground">Key:</span>
                                            <span className="font-mono font-bold text-primary">{entry.key}</span>
                                        </div>

                                        {/* Arrow */}
                                        <ArrowRight className="w-4 h-4 text-muted-foreground" />

                                        {/* Node Reference */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">Node:</span>
                                            <span className="font-mono text-xs text-foreground/70">{entry.nodeId}</span>
                                        </div>

                                        {/* Value Preview */}
                                        {node && (
                                            <>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">Value:</span>
                                                <span className="font-mono text-secondary">{node.value}</span>
                                            </>
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

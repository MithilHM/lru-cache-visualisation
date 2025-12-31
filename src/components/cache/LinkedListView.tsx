'use client';

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { CacheNode, NodeArrow } from './CacheNode';
import { useCacheStore } from '@/store/cache-store';
import { ArrowRight, Database } from 'lucide-react';

export function LinkedListView() {
    const { cacheState } = useCacheStore();
    const { nodes, capacity, size } = cacheState;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/20">
                    <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Doubly Linked List</h2>
                    <p className="text-sm text-muted-foreground">
                        {size} / {capacity} items • O(1) access
                    </p>
                </div>
            </div>

            {/* Linked List Visualization */}
            <div className="glass rounded-2xl p-6 min-h-[200px]">
                {nodes.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-[160px] text-muted-foreground"
                    >
                        <Database className="w-12 h-12 mb-3 opacity-50" />
                        <p className="text-sm">Cache is empty</p>
                        <p className="text-xs mt-1">Add items using the control panel</p>
                    </motion.div>
                ) : (
                    <LayoutGroup>
                        <div className="flex items-center justify-center flex-wrap gap-y-6">
                            {/* Head indicator */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col items-center mr-2"
                            >
                                <span className="text-xs text-emerald-400 font-medium mb-1">HEAD</span>
                                <span className="text-[10px] text-muted-foreground">(Most Recent)</span>
                            </motion.div>

                            <AnimatePresence mode="popLayout">
                                {nodes.map((node, index) => (
                                    <motion.div
                                        key={node.id}
                                        className="flex items-center"
                                        layout
                                    >
                                        <CacheNode
                                            node={node}
                                            totalNodes={nodes.length}
                                            animationDelay={index * 0.05}
                                        />
                                        {index < nodes.length - 1 && (
                                            <NodeArrow />
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Tail indicator */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col items-center ml-2"
                            >
                                <span className="text-xs text-red-400 font-medium mb-1">TAIL</span>
                                <span className="text-[10px] text-muted-foreground">(Least Recent)</span>
                            </motion.div>
                        </div>
                    </LayoutGroup>
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs text-muted-foreground">Most Recently Used</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-xs text-muted-foreground">Middle</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs text-muted-foreground">Least Recently Used</span>
                </div>
            </div>
        </div>
    );
}

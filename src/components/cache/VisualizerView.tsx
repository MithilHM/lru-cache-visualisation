'use client';

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { CacheNode, NodeArrow } from './CacheNode';
import { VisualNode } from '@/types/cache.types';
import { Database } from 'lucide-react';

interface VisualizerViewProps {
    nodes: VisualNode[];
    capacity: number;
    size: number;
}

export function VisualizerView({ nodes, capacity, size }: VisualizerViewProps) {
    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                    <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 leading-tight">Doubly Linked List</h2>
                    <p className="text-sm text-slate-500 font-medium">
                        {size} / {capacity} items • State Persistence
                    </p>
                </div>
            </div>

            {/* Linked List Visualization */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm min-h-[220px] flex items-center justify-center">
                {nodes.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center text-slate-400"
                    >
                        <div className="p-4 rounded-full bg-slate-50 mb-4">
                            <Database className="w-10 h-10 opacity-30" />
                        </div>
                        <p className="text-sm font-semibold text-slate-500 italic">Initialization Required</p>
                        <p className="text-xs mt-1 text-slate-400">Perform an operation to populate the cache</p>
                    </motion.div>
                ) : (
                    <LayoutGroup>
                        <div className="flex items-center justify-center flex-wrap gap-y-10">
                            {/* Head indicator */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col items-center mr-4"
                            >
                                <div className="px-2 py-1 rounded bg-emerald-50 text-[10px] text-emerald-600 font-extrabold tracking-widest mb-2 border border-emerald-100 uppercase shadow-sm">HEAD</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">(Most Recent)</div>
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
                                            <NodeArrow color="#cbd5e1" />
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Tail indicator */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col items-center ml-4"
                            >
                                <div className="px-2 py-1 rounded bg-rose-50 text-[10px] text-rose-600 font-extrabold tracking-widest mb-2 border border-rose-100 uppercase shadow-sm">TAIL</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">(Least Recent)</div>
                            </motion.div>
                        </div>
                    </LayoutGroup>
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 mt-6 py-4 px-6 rounded-xl bg-slate-50/50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-200 bg-emerald-500 shadow-sm shadow-emerald-200" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Most Recently Used</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-200 bg-amber-500 shadow-sm shadow-amber-200" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Middleware Node</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-rose-200 bg-rose-500 shadow-sm shadow-rose-200" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Least Recently Used</span>
                </div>
            </div>
        </div>
    );
}

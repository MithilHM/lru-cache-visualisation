'use client';

import { motion } from 'framer-motion';
import { VisualNode } from '@/types/cache.types';
import { getNodeColor } from '@/lib/utils';

interface CacheNodeProps {
    node: VisualNode;
    totalNodes: number;
    isHighlighted?: boolean;
    animationDelay?: number;
}

export function CacheNode({
    node,
    totalNodes,
    isHighlighted = false,
    animationDelay = 0
}: CacheNodeProps) {
    const nodeColor = getNodeColor(node.position, totalNodes);

    return (
        <motion.div
            layout
            initial={{ scale: 0.8, opacity: 0, y: 10 }}
            animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                borderColor: isHighlighted ? nodeColor : '#e2e8f0',
                boxShadow: isHighlighted
                    ? `0 0 0 4px ${nodeColor}10, 0 10px 15px -3px rgba(0,0,0,0.1)`
                    : `0 4px 6px -1px rgba(0,0,0,0.05)`
            }}
            exit={{
                scale: 0.8,
                opacity: 0,
                x: 20,
                transition: { duration: 0.2 }
            }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
                delay: animationDelay,
            }}
            whileHover={{
                y: -4,
                boxShadow: `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)`,
                transition: { duration: 0.2 }
            }}
            className="relative bg-white border-2 rounded-xl p-0 min-w-[120px] overflow-hidden group cursor-pointer"
        >
            {/* Semantic Header Stripe */}
            <div
                className="h-1.5 w-full"
                style={{ backgroundColor: nodeColor }}
            />

            <div className="p-4">
                {/* ID Badge */}
                <div className="flex items-center justify-between mb-3">
                    <span
                        className="text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter"
                        style={{ color: nodeColor, backgroundColor: `${nodeColor}10` }}
                    >
                        POS {node.position + 1}
                    </span>
                    <div className="flex gap-1">
                        {node.isHead && (
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        )}
                        {node.isTail && (
                            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                        )}
                    </div>
                </div>

                {/* Data Section */}
                <div className="space-y-3">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Index Key</span>
                        <span className="text-xl font-black text-slate-900 font-mono tracking-tighter">
                            {node.key}
                        </span>
                    </div>

                    <div className="h-px w-full bg-slate-100" />

                    <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Payload</span>
                        <span className="text-sm font-bold text-slate-600 font-mono italic">
                            {node.value}
                        </span>
                    </div>
                </div>

                {/* Indicators Sidebar (Vertical Label) */}
                <div className="absolute top-10 -right-7 rotate-90 origin-left flex gap-2">
                    {node.isHead && (
                        <span className="text-[8px] font-black text-emerald-600/40 uppercase tracking-[0.2em]">Primary</span>
                    )}
                    {node.isTail && (
                        <span className="text-[8px] font-black text-rose-600/40 uppercase tracking-[0.2em]">Terminal</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Arrow component for linking nodes - Doubly Linked List Version
export function NodeArrow({ color = '#cbd5e1' }: { color?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 48 }}
            className="flex items-center justify-center -mx-1"
        >
            <div className="flex flex-col gap-1.5 w-full">
                {/* Forward Arrow (Next) */}
                <div className="relative flex items-center w-full">
                    <div className="h-[1.5px] w-full rounded-full" style={{ backgroundColor: color }} />
                    <div
                        className="absolute right-0 w-1.5 h-1.5 rotate-45 border-t-1.5 border-r-1.5"
                        style={{ borderColor: color, borderTopWidth: '1.5px', borderRightWidth: '1.5px' }}
                    />
                </div>
                {/* Backward Arrow (Prev) */}
                <div className="relative flex items-center w-full">
                    <div className="h-[1.5px] w-full rounded-full" style={{ backgroundColor: color }} />
                    <div
                        className="absolute left-0 w-1.5 h-1.5 rotate-[225deg] border-t-1.5 border-r-1.5"
                        style={{ borderColor: color, borderTopWidth: '1.5px', borderRightWidth: '1.5px' }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

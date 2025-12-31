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
            initial={{ scale: 0, opacity: 0, y: -20 }}
            animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                boxShadow: isHighlighted
                    ? `0 0 30px ${nodeColor}80`
                    : `0 0 20px ${nodeColor}40`
            }}
            exit={{
                scale: 0,
                opacity: 0,
                x: 50,
                transition: { duration: 0.3 }
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                delay: animationDelay,
            }}
            whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.2 }
            }}
            className="relative"
        >
            {/* Gradient Border Wrapper */}
            <div
                className="p-[2px] rounded-xl"
                style={{
                    background: `linear-gradient(135deg, ${nodeColor}, ${nodeColor}80)`,
                }}
            >
                {/* Main Card */}
                <div className="glass-strong rounded-xl p-4 min-w-[100px]">
                    {/* Position Badge */}
                    <div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: nodeColor }}
                    >
                        {node.position + 1}
                    </div>

                    {/* Key */}
                    <div className="text-center mb-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Key</span>
                        <div
                            className="text-2xl font-bold font-mono"
                            style={{ color: nodeColor }}
                        >
                            {node.key}
                        </div>
                    </div>

                    {/* Divider */}
                    <div
                        className="h-px w-full my-2"
                        style={{ backgroundColor: `${nodeColor}40` }}
                    />

                    {/* Value */}
                    <div className="text-center">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Value</span>
                        <div className="text-lg font-semibold text-foreground">
                            {node.value}
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex gap-1 mt-3 justify-center">
                        {node.isHead && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-400 font-medium"
                            >
                                MRU
                            </motion.span>
                        )}
                        {node.isTail && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-2 py-0.5 text-[10px] rounded-full bg-red-500/20 text-red-400 font-medium"
                            >
                                LRU
                            </motion.span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Arrow component for linking nodes
export function NodeArrow({ color = '#6366f1' }: { color?: string }) {
    return (
        <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            className="flex items-center mx-1"
        >
            <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                {/* Line */}
                <motion.line
                    x1="0" y1="12" x2="32" y2="12"
                    stroke={color}
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                />
                {/* Arrow head */}
                <motion.path
                    d="M32 12L26 6M32 12L26 18"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                />
            </svg>
        </motion.div>
    );
}

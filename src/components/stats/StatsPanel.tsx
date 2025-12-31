'use client';

import { motion } from 'framer-motion';
import { useCacheStore } from '@/store/cache-store';
import { formatPercent } from '@/lib/utils';
import {
    TrendingUp,
    TrendingDown,
    Target,
    Trash2,
    Activity,
    Gauge
} from 'lucide-react';

export function StatsPanel() {
    const { stats, cacheState } = useCacheStore();
    const { totalOperations, hits, misses, evictions, hitRate } = stats;
    const { size, capacity } = cacheState;

    const statsItems = [
        {
            label: 'Hit Rate',
            value: formatPercent(hitRate),
            icon: Target,
            color: hitRate >= 50 ? 'text-emerald-400' : 'text-red-400',
            bgColor: hitRate >= 50 ? 'bg-emerald-500/20' : 'bg-red-500/20',
        },
        {
            label: 'Total Ops',
            value: totalOperations.toString(),
            icon: Activity,
            color: 'text-primary',
            bgColor: 'bg-primary/20',
        },
        {
            label: 'Hits',
            value: hits.toString(),
            icon: TrendingUp,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/20',
        },
        {
            label: 'Misses',
            value: misses.toString(),
            icon: TrendingDown,
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/20',
        },
        {
            label: 'Evictions',
            value: evictions.toString(),
            icon: Trash2,
            color: 'text-red-400',
            bgColor: 'bg-red-500/20',
        },
    ];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                    <Gauge className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Statistics</h2>
            </div>

            {/* Capacity Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-4"
            >
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Cache Usage</span>
                    <span className="font-mono font-bold text-foreground">
                        {size} / {capacity}
                    </span>
                </div>
                <div className="h-3 bg-background/50 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(size / capacity) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                        className={`h-full rounded-full ${size >= capacity
                                ? 'bg-gradient-to-r from-red-500 to-red-400'
                                : size >= capacity * 0.7
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                                    : 'bg-gradient-to-r from-primary to-secondary'
                            }`}
                    />
                </div>
                {size >= capacity && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-400 mt-2"
                    >
                        ⚠️ Cache is full! Next insert will trigger eviction.
                    </motion.p>
                )}
            </motion.div>

            {/* Stats Grid */}
            <div className="grid gap-3">
                {statsItems.map((item, index) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass rounded-xl p-4 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${item.bgColor}`}>
                                <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                        <motion.span
                            key={item.value}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-xl font-bold font-mono ${item.color}`}
                        >
                            {item.value}
                        </motion.span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

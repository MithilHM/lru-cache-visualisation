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
            color: hitRate >= 50 ? 'text-emerald-600' : 'text-rose-600',
            bgColor: hitRate >= 50 ? 'bg-emerald-50' : 'bg-rose-50',
            borderColor: hitRate >= 50 ? 'border-emerald-100' : 'border-rose-100',
        },
        {
            label: 'Cycle Count',
            value: totalOperations.toString(),
            icon: Activity,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100',
        },
        {
            label: 'Cache Hits',
            value: hits.toString(),
            icon: TrendingUp,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-100',
        },
        {
            label: 'Cache Misses',
            value: misses.toString(),
            icon: TrendingDown,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-100',
        },
        {
            label: 'Evictions',
            value: evictions.toString(),
            icon: Trash2,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            borderColor: 'border-rose-100',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 px-1">
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                    <Gauge className="w-4 h-4 text-slate-600" />
                </div>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Operational Health</h2>
            </div>

            {/* Capacity Bar - High Density Enterprise Style */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
            >
                <div className="flex justify-between items-end mb-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Volumetric Load</span>
                        <span className="text-sm font-bold text-slate-700">Storage Allocation</span>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter">
                            {size}
                        </span>
                        <span className="text-slate-300 font-bold mx-1">/</span>
                        <span className="text-sm font-bold text-slate-400 font-mono uppercase">
                            {capacity} Max
                        </span>
                    </div>
                </div>

                <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(size / capacity) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                        className={`h-full rounded-full transition-colors duration-500 ${size >= capacity
                            ? 'bg-rose-500'
                            : size >= capacity * 0.7
                                ? 'bg-amber-500'
                                : 'bg-blue-600'
                            }`}
                    />
                </div>

                {size >= capacity && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-2 rounded bg-rose-50 border border-rose-100 flex items-center gap-2"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                            Overflow Imminent: Next PUT will trigger LRU Purge
                        </p>
                    </motion.div>
                )}
            </motion.div>

            {/* Stats List - Refined B2B List */}
            <div className="space-y-2">
                {statsItems.map((item, index) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white border border-slate-100 rounded-lg p-3 flex items-center justify-between hover:border-slate-200 hover:shadow-sm transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg border ${item.bgColor} ${item.borderColor}`}>
                                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight group-hover:text-slate-700 transition-colors">{item.label}</span>
                        </div>
                        <motion.span
                            key={item.value}
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`text-sm font-black font-mono tracking-tighter ${item.color}`}
                        >
                            {item.value}
                        </motion.span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

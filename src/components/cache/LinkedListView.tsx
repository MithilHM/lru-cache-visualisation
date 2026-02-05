'use client';

import { useCacheStore } from '@/store/cache-store';
import { VisualizerView } from './VisualizerView';
import { HashMapView } from './HashMapView';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';

export function LinkedListView() {
    const { cacheState } = useCacheStore();
    const { nodes, capacity, size } = cacheState;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <VisualizerView
                nodes={nodes}
                capacity={capacity}
                size={size}
            />

            <HashMapView />

            {/* Algorithm Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 tracking-tight">
                        <Database className="w-5 h-5 text-blue-600" />
                        Infrastructure Specs
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded uppercase tracking-tighter">Performance Profile</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
                        <div className="text-2xl font-black text-emerald-600 font-mono tracking-tighter">O(1)</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Access Method</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
                        <div className="text-2xl font-black text-emerald-600 font-mono tracking-tighter">O(1)</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Insertion Lag</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
                        <div className="text-2xl font-black text-blue-600 font-mono tracking-tighter">O(N)</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Memory Footprint</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
                        <div className="text-lg font-black text-slate-700 leading-tight">Map + DLL</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hybrid Logic</div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

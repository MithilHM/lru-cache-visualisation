'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCacheStore } from '@/store/cache-store';
import {
    Globe,
    Server,
    Download,
    Play,
    RotateCcw,
    Clock,
    Shield,
    Wifi,
    HardDrive,
    Layout,
    FileText,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { presetSequences, delay, assetIcons } from '@/lib/utils';
import { RealWorldLog } from './RealWorldLog';

export function RealWorldSimulationView() {
    const { cacheState, put, get, reset, stats } = useCacheStore();
    const { nodes } = cacheState;
    const [isSimulating, setIsSimulating] = useState(false);
    const [statusText, setStatusText] = useState('Idle - Ready to browse');

    const runSimulation = async () => {
        const preset = presetSequences.find(p => p.id === 'browser_cache');
        if (!preset || isSimulating) return;

        setIsSimulating(true);
        reset();
        await delay(500);

        for (const op of preset.operations) {
            const label = 'label' in op ? op.label : undefined;
            const category = 'category' in op ? op.category : undefined;
            const value = 'value' in op ? op.value : undefined;

            setStatusText(op.type === 'put' ? `Fetching Asset: ${label}...` : `Requested from Cache: ${label}`);

            if (op.type === 'put' && value !== undefined) {
                put(op.key, value, label, category);
            } else if (op.type === 'get') {
                get(op.key, label, category);
            }
            await delay(1000); // 1s per request
        }

        setStatusText('Simulation Complete');
        setIsSimulating(false);
    };

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto">
            {/* Browser-styled Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-slate-800 px-4 py-3 flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-rose-500" />
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex-1 bg-slate-900/50 rounded-lg px-4 py-1.5 border border-slate-700/50 flex items-center gap-3">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11px] text-slate-400 font-mono">https://www.algoverse.pro/docs/lru-cache</span>
                    </div>
                </div>

                <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-6">
                        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <Globe className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white leading-tight">Browser Asset Cache</h2>
                            <p className="text-sm text-slate-400 font-medium">Visualizing how LRU speeds up your browsing experience</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</div>
                            <div className={`text-sm font-black font-mono transition-colors ${isSimulating ? 'text-blue-400 animate-pulse' : 'text-slate-300'}`}>
                                {statusText}
                            </div>
                        </div>
                        <div className="w-px h-10 bg-slate-800" />
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => reset()}
                                variant="outline"
                                className="h-12 px-6 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-widest text-[10px]"
                                disabled={isSimulating}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                            <Button
                                onClick={runSimulation}
                                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-500/20 group border-none"
                                disabled={isSimulating}
                            >
                                <Play className={`w-4 h-4 mr-2 ${isSimulating ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                                {isSimulating ? 'Loading Pages...' : 'Run Browser Simulation'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Visualizer Area */}
                <div className="p-12 bg-slate-950 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Mock Browser Assets View */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <Wifi className="w-4 h-4 text-slate-500" />
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Network Request Cycle</h3>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 min-h-[400px] flex flex-col justify-center items-center gap-8 relative overflow-hidden group">
                            {/* Decorative Background Grid */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(circle, #2563eb 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                            <div className="relative flex items-center justify-center w-full max-w-md">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-xl group-hover:border-blue-500/50 transition-colors">
                                        <Layout className="w-10 h-10 text-white opacity-40" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase">Your Browser</span>
                                </div>

                                <div className="flex-1 flex flex-col items-center gap-2 px-8">
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent relative">
                                        {isSimulating && (
                                            <motion.div
                                                animate={{ x: [0, 200], opacity: [0, 1, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-px bg-blue-500 shadow-[0_0_8px_#2563eb]"
                                            />
                                        )}
                                    </div>
                                    <span className="text-[9px] font-black text-slate-600 uppercase">Exchange</span>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-xl group-hover:border-emerald-500/50 transition-colors">
                                        <Server className="w-10 h-10 text-white opacity-40" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase">CDN Edge</span>
                                </div>
                            </div>

                            {/* Current Active Request Notification */}
                            <AnimatePresence mode="wait">
                                {isSimulating && (
                                    <motion.div
                                        key={statusText}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-blue-600/10 border border-blue-500/20 px-6 py-4 rounded-2xl flex items-center gap-4"
                                    >
                                        <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
                                            <Download className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Processing Data</div>
                                            <div className="text-sm font-bold text-white truncate max-w-[200px]">{statusText}</div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Cache Performance View */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <HardDrive className="w-4 h-4 text-slate-500" />
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Live Disk Cache (LRU Manager)</h3>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Hits: {Math.round(stats.hitRate)}%</span>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 min-h-[400px]">
                            {nodes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-700 py-20">
                                    <Clock className="w-12 h-12 mb-4 opacity-10" />
                                    <p className="text-xs font-black uppercase tracking-[0.2em]">Cache Empty</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    <AnimatePresence mode="popLayout">
                                        {nodes.map((node, index) => (
                                            <motion.div
                                                key={node.id}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center group hover:bg-slate-800 hover:border-blue-500/30 transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                                    <span className="text-lg">{assetIcons[node.category || 'other'] || '📦'}</span>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-xs font-black text-white">{node.label}</span>
                                                        {index === 0 && (
                                                            <span className="bg-blue-600/20 text-blue-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Hot Asset</span>
                                                        )}
                                                    </div>
                                                    <div className="text-[9px] font-bold text-slate-500 font-mono">
                                                        {(node.value || 0) / 100} KB • CACHE_ID: {node.address}
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Eviction Rank</div>
                                                    <div className={`text-xs font-black font-mono transition-colors ${index >= 4 ? 'text-rose-500' : 'text-slate-300'}`}>
                                                        {index + 1} / 5
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sub-Logs & Analysis */}
                <div className="p-8 border-t border-slate-800 bg-slate-900/50 space-y-8">
                    <div className="flex items-center gap-2 px-1">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Network Traffic Trace</h3>
                    </div>
                    <RealWorldLog />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-950/50 border border-slate-800 group hover:border-blue-500/30 transition-colors">
                            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 w-fit">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h5 className="text-xs font-black text-white uppercase tracking-widest mb-2">Instant Reloads</h5>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                When you press 'Back', browsers like Chrome use LRU to instantly serve images (like <code className="text-blue-400">hero-banner.jpg</code>) from disk instead of re-downloading them.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-950/50 border border-slate-800 group hover:border-emerald-500/30 transition-colors">
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 w-fit">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h5 className="text-xs font-black text-white uppercase tracking-widest mb-2">Memory Preservation</h5>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                Your phone has limited RAM. Browsers evict old assets (like <code className="text-slate-500">heavy-video-intro</code>) to make room for new pages while keeping frequently used fonts and scripts.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-950/50 border border-slate-800 group hover:border-amber-500/30 transition-colors">
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4 w-fit">
                                <Download className="w-5 h-5" />
                            </div>
                            <h5 className="text-xs font-black text-white uppercase tracking-widest mb-2">Bandwidth Optimization</h5>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                LRU reduces your mobile data bill by ensuring common site assets only travel through the network once. A 90% hit rate can save GBs of monthly data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

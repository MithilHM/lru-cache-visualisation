'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCacheStore } from '@/store/cache-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { presetSequences, delay } from '@/lib/utils';
import {
    Play,
    RotateCcw,
    Download,
    Shuffle,
    ArrowDownToLine,
    ArrowUpFromLine,
    Settings2,
    Zap,
    Plus,
    Search
} from 'lucide-react';

export function ControlPanel() {
    const { get, put, setCapacity, reset, capacity, exportState } = useCacheStore();

    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [getKey, setGetKey] = useState('');
    const [isRunningPreset, setIsRunningPreset] = useState(false);

    const handlePut = () => {
        const k = parseInt(key);
        const v = parseInt(value);
        if (!isNaN(k)) {
            // Default value if empty
            const finalValue = isNaN(v) ? Math.floor(Math.random() * 900) + 100 : v;
            put(k, finalValue);
            setKey('');
            setValue('');
        }
    };

    const handleGet = () => {
        const k = parseInt(getKey);
        if (!isNaN(k)) {
            get(k);
            setGetKey('');
        }
    };

    const handleRandomPut = () => {
        const k = Math.floor(Math.random() * 20) + 1;
        const v = Math.floor(Math.random() * 900) + 100;
        put(k, v);
    };

    const handleRunPreset = async (presetId: string) => {
        const preset = presetSequences.find(p => p.id === presetId);
        if (!preset || isRunningPreset) return;

        setIsRunningPreset(true);
        reset();
        await delay(300);

        for (const op of preset.operations) {
            if (op.type === 'put' && op.value !== undefined) {
                put(op.key, op.value);
            } else if (op.type === 'get') {
                get(op.key);
            }
            await delay(800);
        }

        setIsRunningPreset(false);
    };

    const handleExport = () => {
        const data = exportState();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'algoverse-session-state.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Command Interface - Grouped Operations */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5 text-blue-600" />
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Command Center</h3>
                    </div>
                </div>

                <div className="p-5 space-y-6">
                    {/* Put Section */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="key" className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Access Key</Label>
                                <Input
                                    id="key"
                                    type="number"
                                    placeholder="ID"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handlePut()}
                                    className="h-9 text-sm font-mono bg-slate-50 border-slate-200 focus:bg-white focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="value" className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Payload</Label>
                                <Input
                                    id="value"
                                    type="number"
                                    placeholder="VAL"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handlePut()}
                                    className="h-9 text-sm font-mono bg-slate-50 border-slate-200 focus:bg-white focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handlePut}
                                className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-100"
                                disabled={!key}
                            >
                                <Plus className="w-3.5 h-3.5 mr-2" />
                                Commit Entry
                            </Button>
                            <Button
                                onClick={handleRandomPut}
                                variant="outline"
                                className="h-9 px-3 border-slate-200 hover:bg-slate-50 text-slate-500"
                            >
                                <Shuffle className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 w-full" />

                    {/* Get Section */}
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="getKey" className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Retrieve Registry</Label>
                            <div className="relative">
                                <Input
                                    id="getKey"
                                    type="number"
                                    placeholder="Enter lookup key..."
                                    value={getKey}
                                    onChange={(e) => setGetKey(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleGet()}
                                    className="h-9 pl-9 text-sm font-mono bg-slate-50 border-slate-200 focus:bg-white focus:ring-blue-500/20 transition-all"
                                />
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
                            </div>
                        </div>
                        <Button
                            onClick={handleGet}
                            className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-100"
                            disabled={!getKey}
                        >
                            <ArrowUpFromLine className="w-3.5 h-3.5 mr-2" />
                            Execute GET
                        </Button>
                    </div>
                </div>
            </div>

            {/* Capacity Control - Modern Slider */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <Settings2 className="w-3.5 h-3.5 text-blue-600" />
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Cache Depth</h3>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-900 leading-none">{capacity}</span>
                        <span className="text-[10px] text-slate-400 font-bold">UNITS</span>
                    </div>
                </div>

                <Slider
                    value={[capacity]}
                    onValueChange={([value]) => setCapacity(value)}
                    min={1}
                    max={10}
                    step={1}
                    className="mb-4"
                />

                <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                    <span>Minimum</span>
                    <span>Max Profile</span>
                </div>
            </div>

            {/* Presets - Modern Cards */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 px-1 mb-3">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Payload Macros</h3>
                </div>
                <div className="grid gap-2">
                    {presetSequences.slice(0, 3).map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => handleRunPreset(preset.id)}
                            disabled={isRunningPreset}
                            className="flex flex-col text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/20 transition-all disabled:opacity-50 group shadow-sm active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{preset.name}</span>
                                <Play className="w-3 h-3 text-slate-300 group-hover:text-blue-500 fill-current transition-all" />
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium group-hover:text-slate-500 transition-colors truncate w-full">{preset.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Utility Actions */}
            <div className="flex gap-2 pt-2">
                <Button
                    onClick={() => reset()}
                    variant="outline"
                    className="flex-1 h-9 border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-black uppercase tracking-widest"
                >
                    <RotateCcw className="w-3 h-3 mr-2" />
                    Reset
                </Button>
                <Button
                    onClick={handleExport}
                    variant="outline"
                    className="flex-1 h-9 border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest shadow-sm"
                >
                    <Download className="w-3 h-3 mr-2" />
                    Dump
                </Button>
            </div>
        </div>
    );
}

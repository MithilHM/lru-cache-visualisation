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
    Upload,
    Shuffle,
    ArrowDownToLine,
    ArrowUpFromLine,
    Settings2,
    Zap
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
        if (!isNaN(k) && !isNaN(v)) {
            put(k, v);
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
        a.download = 'lru-cache-state.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Put Operation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-4"
            >
                <div className="flex items-center gap-2 mb-4">
                    <ArrowDownToLine className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-foreground">Put Operation</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <Label htmlFor="key" className="text-xs text-muted-foreground">Key</Label>
                        <Input
                            id="key"
                            type="number"
                            placeholder="Enter key"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePut()}
                            className="bg-background/50 border-border/50"
                        />
                    </div>
                    <div>
                        <Label htmlFor="value" className="text-xs text-muted-foreground">Value</Label>
                        <Input
                            id="value"
                            type="number"
                            placeholder="Enter value"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePut()}
                            className="bg-background/50 border-border/50"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={handlePut}
                        className="flex-1 bg-primary hover:bg-primary/90"
                        disabled={!key || !value}
                    >
                        <ArrowDownToLine className="w-4 h-4 mr-2" />
                        Put
                    </Button>
                    <Button
                        onClick={handleRandomPut}
                        variant="outline"
                        className="border-primary/50 hover:bg-primary/20"
                    >
                        <Shuffle className="w-4 h-4" />
                    </Button>
                </div>
            </motion.div>

            {/* Get Operation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-xl p-4"
            >
                <div className="flex items-center gap-2 mb-4">
                    <ArrowUpFromLine className="w-4 h-4 text-secondary" />
                    <h3 className="font-semibold text-foreground">Get Operation</h3>
                </div>

                <div className="mb-3">
                    <Label htmlFor="getKey" className="text-xs text-muted-foreground">Key</Label>
                    <Input
                        id="getKey"
                        type="number"
                        placeholder="Enter key to retrieve"
                        value={getKey}
                        onChange={(e) => setGetKey(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGet()}
                        className="bg-background/50 border-border/50"
                    />
                </div>

                <Button
                    onClick={handleGet}
                    className="w-full bg-secondary hover:bg-secondary/90"
                    disabled={!getKey}
                >
                    <ArrowUpFromLine className="w-4 h-4 mr-2" />
                    Get
                </Button>
            </motion.div>

            {/* Capacity Control */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-xl p-4"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-amber-400" />
                        <h3 className="font-semibold text-foreground">Capacity</h3>
                    </div>
                    <span className="text-2xl font-bold text-amber-400">{capacity}</span>
                </div>

                <Slider
                    value={[capacity]}
                    onValueChange={([value]) => setCapacity(value)}
                    min={1}
                    max={10}
                    step={1}
                    className="mb-2"
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>10</span>
                </div>
            </motion.div>

            {/* Preset Sequences */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl p-4"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <h3 className="font-semibold text-foreground">Presets</h3>
                </div>

                <div className="grid gap-2">
                    {presetSequences.slice(0, 3).map((preset) => (
                        <Button
                            key={preset.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleRunPreset(preset.id)}
                            disabled={isRunningPreset}
                            className="justify-start text-left h-auto py-2 border-border/50 hover:bg-primary/10"
                        >
                            <Play className="w-3 h-3 mr-2 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-medium">{preset.name}</div>
                                <div className="text-xs text-muted-foreground">{preset.description}</div>
                            </div>
                        </Button>
                    ))}
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-2"
            >
                <Button
                    onClick={() => reset()}
                    variant="outline"
                    className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                </Button>
                <Button
                    onClick={handleExport}
                    variant="outline"
                    className="flex-1 border-border/50 hover:bg-background/50"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                </Button>
            </motion.div>
        </div>
    );
}

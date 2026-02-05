import { create } from 'zustand';
import { CacheVisualizer } from '@/lib/lru-cache';
import { FIFOCache } from '@/lib/fifo-cache';
import { CacheState, Operation, StatsData, PlaybackState, AnimationStep } from '@/types/cache.types';

interface CacheStoreState {
    // Core
    visualizer: CacheVisualizer;
    cacheState: CacheState;
    fifoCache: FIFOCache;
    fifoState: CacheState;
    capacity: number;

    // Statistics
    stats: StatsData;
    fifoStats: StatsData;

    // Operation history
    operations: Operation[];

    // Playback
    playback: PlaybackState;
    animationQueue: AnimationStep[];
    isAnimating: boolean;

    // Actions
    get: (key: number, label?: string, category?: string) => number;
    put: (key: number, value: number, label?: string, category?: string) => void;
    setCapacity: (capacity: number) => void;
    reset: () => void;
    clearHistory: () => void;
    refreshState: () => void;

    // Playback actions
    setSpeed: (speed: number) => void;
    setIsAnimating: (isAnimating: boolean) => void;
    clearAnimationQueue: () => void;

    // Export/Import
    exportState: () => string;
}

const DEFAULT_CAPACITY = 5;

const INITIAL_STATS: StatsData = {
    totalOperations: 0,
    hits: 0,
    misses: 0,
    evictions: 0,
    hitRate: 0,
};

export const useCacheStore = create<CacheStoreState>((set, get) => {
    const visualizer = new CacheVisualizer(DEFAULT_CAPACITY);
    const fifoCache = new FIFOCache(DEFAULT_CAPACITY);

    const updateFifoStats = (isHit: boolean, evicted: boolean, currentStats: StatsData): StatsData => {
        const totalOperations = currentStats.totalOperations + 1;
        const hits = isHit ? currentStats.hits + 1 : currentStats.hits;
        const misses = isHit ? currentStats.misses : currentStats.misses + 1;
        const evictions = evicted ? currentStats.evictions + 1 : currentStats.evictions;
        const hitRate = (hits / totalOperations) * 100;

        return { totalOperations, hits, misses, evictions, hitRate };
    };

    return {
        visualizer,
        cacheState: visualizer.getState(),
        fifoCache,
        fifoState: fifoCache.getState(),
        capacity: DEFAULT_CAPACITY,
        stats: visualizer.getStats(),
        fifoStats: INITIAL_STATS,
        operations: [],
        playback: {
            isPlaying: false,
            speed: 1,
            currentStep: 0,
            totalSteps: 0,
            isPaused: false,
        },
        animationQueue: [],
        isAnimating: false,

        get: (key: number, label?: string, category?: string) => {
            const { visualizer, fifoCache, fifoStats } = get();

            // LRU Logic
            const { result, animations } = visualizer.get(key);

            // FIFO Logic
            const fifoResult = fifoCache.get(key);
            const isFifoHit = fifoResult !== -1;
            const newFifoStats = updateFifoStats(isFifoHit, false, fifoStats);

            set({
                cacheState: visualizer.getState(),
                stats: visualizer.getStats(),
                fifoState: fifoCache.getState(),
                fifoStats: newFifoStats,
                operations: visualizer.getOperations().map(op =>
                    op.key === key ? { ...op, label: label || op.label, category: category || op.category } : op
                ),
                animationQueue: [...get().animationQueue, ...animations],
            });

            return result;
        },

        put: (key: number, value: number, label?: string, category?: string) => {
            const { visualizer, fifoCache, fifoStats } = get();

            // LRU Logic
            const { animations } = visualizer.put(key, value);

            // FIFO Logic
            const existsBefore = fifoCache.get(key) !== -1;
            const { evictedKey } = fifoCache.put(key, value);
            const newFifoStats = updateFifoStats(existsBefore, !!evictedKey, fifoStats);

            set({
                cacheState: visualizer.getState(),
                stats: visualizer.getStats(),
                fifoState: fifoCache.getState(),
                fifoStats: newFifoStats,
                operations: visualizer.getOperations().map(op =>
                    op.key === key ? { ...op, label: label || op.label, category: category || op.category } : op
                ),
                animationQueue: [...get().animationQueue, ...animations],
            });
        },

        setCapacity: (capacity: number) => {
            const { visualizer, fifoCache } = get();
            visualizer.setCapacity(capacity);
            fifoCache.setCapacity(capacity);

            set({
                capacity,
                cacheState: visualizer.getState(),
                stats: visualizer.getStats(),
                fifoState: fifoCache.getState(),
            });
        },

        reset: () => {
            const capacity = get().capacity;
            const newVisualizer = new CacheVisualizer(capacity);
            const newFifoCache = new FIFOCache(capacity);

            set({
                visualizer: newVisualizer,
                cacheState: newVisualizer.getState(),
                fifoCache: newFifoCache,
                fifoState: newFifoCache.getState(),
                stats: newVisualizer.getStats(),
                fifoStats: INITIAL_STATS,
                operations: [],
                animationQueue: [],
                isAnimating: false,
            });
        },

        clearHistory: () => {
            const { visualizer } = get();
            visualizer.clearHistory();

            set({
                operations: [],
            });
        },

        refreshState: () => {
            const { visualizer, fifoCache } = get();
            set({
                cacheState: visualizer.getState(),
                stats: visualizer.getStats(),
                fifoState: fifoCache.getState(),
                operations: visualizer.getOperations(),
            });
        },

        setSpeed: (speed: number) => {
            set(state => ({
                playback: { ...state.playback, speed },
            }));
        },

        setIsAnimating: (isAnimating: boolean) => {
            set({ isAnimating });
        },

        clearAnimationQueue: () => {
            const { visualizer } = get();
            visualizer.clearAnimationQueue();
            set({ animationQueue: [] });
        },

        exportState: () => {
            const { visualizer } = get();
            return visualizer.exportState();
        },
    };
});

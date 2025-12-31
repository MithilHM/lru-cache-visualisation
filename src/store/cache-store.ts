import { create } from 'zustand';
import { CacheVisualizer } from '@/lib/lru-cache';
import { CacheState, Operation, StatsData, PlaybackState, AnimationStep } from '@/types/cache.types';

interface CacheStoreState {
    // Core
    visualizer: CacheVisualizer;
    cacheState: CacheState;
    capacity: number;

    // Statistics
    stats: StatsData;

    // Operation history
    operations: Operation[];

    // Playback
    playback: PlaybackState;
    animationQueue: AnimationStep[];
    isAnimating: boolean;

    // Actions
    get: (key: number) => number;
    put: (key: number, value: number) => void;
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

export const useCacheStore = create<CacheStoreState>((set, get) => {
    const visualizer = new CacheVisualizer(DEFAULT_CAPACITY);

    return {
        visualizer,
        cacheState: visualizer.getState(),
        capacity: DEFAULT_CAPACITY,
        stats: visualizer.getStats(),
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

        get: (key: number) => {
            const { visualizer } = get();
            const { result, animations } = visualizer.get(key);

            set({
                cacheState: visualizer.getState(),
                stats: visualizer.getStats(),
                operations: visualizer.getOperations(),
                animationQueue: [...get().animationQueue, ...animations],
            });

            return result;
        },

        put: (key: number, value: number) => {
            const { visualizer } = get();
            const { animations } = visualizer.put(key, value);

            set({
                cacheState: visualizer.getState(),
                stats: visualizer.getStats(),
                operations: visualizer.getOperations(),
                animationQueue: [...get().animationQueue, ...animations],
            });
        },

        setCapacity: (capacity: number) => {
            const { visualizer } = get();
            visualizer.setCapacity(capacity);

            set({
                capacity,
                cacheState: visualizer.getState(),
                stats: visualizer.getStats(),
                operations: visualizer.getOperations(),
            });
        },

        reset: () => {
            const capacity = get().capacity;
            const newVisualizer = new CacheVisualizer(capacity);

            set({
                visualizer: newVisualizer,
                cacheState: newVisualizer.getState(),
                stats: newVisualizer.getStats(),
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
            const { visualizer } = get();
            set({
                cacheState: visualizer.getState(),
                stats: visualizer.getStats(),
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

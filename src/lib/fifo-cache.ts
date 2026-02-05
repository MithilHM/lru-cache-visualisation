import { CacheNode, CacheState, VisualNode, StatsData } from '@/types/cache.types';

/**
 * FIFO Cache Implementation using a Queue (Array)
 * 
 * Time Complexity:
 * - get(key): O(n) for lookup in array, but O(1) in Map if used
 * - put(key, value): O(1)
 * 
 * Space Complexity: O(capacity)
 */
export class FIFOCache {
    private capacity: number;
    private cache: Map<number, { value: number; id: string }>;
    private queue: number[] = []; // Stores keys in insertion order
    private nodeIdCounter: number = 0;

    constructor(capacity: number) {
        this.capacity = Math.max(1, capacity);
        this.cache = new Map();
    }

    get(key: number): number {
        const entry = this.cache.get(key);
        return entry ? entry.value : -1;
    }

    put(key: number, value: number): { evictedKey?: number } {
        let evictedKey: number | undefined;

        if (this.cache.has(key)) {
            // Update value but keep order
            const entry = this.cache.get(key)!;
            this.cache.set(key, { ...entry, value });
        } else {
            // Check capacity
            if (this.queue.length >= this.capacity) {
                evictedKey = this.queue.shift();
                if (evictedKey !== undefined) {
                    this.cache.delete(evictedKey);
                }
            }

            const id = `fifo-node-${this.nodeIdCounter++}`;
            this.cache.set(key, { value, id });
            this.queue.push(key);
        }

        return { evictedKey };
    }

    getState(): CacheState {
        const nodes: VisualNode[] = this.queue.map((key, index) => {
            const entry = this.cache.get(key)!;
            return {
                id: entry.id,
                key,
                value: entry.value,
                position: index,
                isHead: index === 0,
                isTail: index === this.queue.length - 1,
                isNew: false,
                isAccessed: false,
                isEvicting: false,
            };
        });

        return {
            nodes,
            capacity: this.capacity,
            size: this.cache.size,
            hashMapEntries: Array.from(this.cache.entries()).map(([key, entry]) => ({
                key,
                nodeId: entry.id,
            })),
        };
    }

    setCapacity(newCapacity: number): number[] {
        const evicted: number[] = [];
        this.capacity = Math.max(1, newCapacity);

        while (this.queue.length > this.capacity) {
            const key = this.queue.shift();
            if (key !== undefined) {
                this.cache.delete(key);
                evicted.push(key);
            }
        }

        return evicted;
    }

    getCapacity(): number {
        return this.capacity;
    }
}

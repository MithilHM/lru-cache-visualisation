import { CacheNode, CacheState, VisualNode, Operation, AnimationStep, StatsData } from '@/types/cache.types';
import { getMemoryAddress } from './utils';

/**
 * LRU Cache Implementation using HashMap + Doubly Linked List
 * 
 * Time Complexity:
 * - get(key): O(1)
 * - put(key, value): O(1)
 * 
 * Space Complexity: O(capacity)
 */
export class LRUCache {
    private capacity: number;
    private cache: Map<number, CacheNode>;
    private head: CacheNode; // Dummy head - most recently used
    private tail: CacheNode; // Dummy tail - least recently used
    private nodeIdCounter: number = 0;
    private nodeIdMap: Map<CacheNode, string> = new Map();

    constructor(capacity: number) {
        this.capacity = Math.max(1, capacity);
        this.cache = new Map();

        // Initialize dummy head and tail
        this.head = { key: -1, value: -1, prev: null, next: null };
        this.tail = { key: -1, value: -1, prev: null, next: null };
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    /**
     * Get value by key
     * @returns value if exists, -1 otherwise
     */
    get(key: number): number {
        const node = this.cache.get(key);
        if (!node) {
            return -1;
        }
        // Move to head (most recently used)
        this.moveToHead(node);
        return node.value;
    }

    /**
     * Put key-value pair
     * Evicts LRU item if at capacity
     */
    put(key: number, value: number): CacheNode | null {
        let evictedNode: CacheNode | null = null;

        const existingNode = this.cache.get(key);
        if (existingNode) {
            // Update existing node
            existingNode.value = value;
            this.moveToHead(existingNode);
        } else {
            // Create new node
            const newNode: CacheNode = { key, value, prev: null, next: null };
            this.nodeIdMap.set(newNode, `node-${this.nodeIdCounter++}`);

            // Check capacity
            if (this.cache.size >= this.capacity) {
                evictedNode = this.removeTail();
                if (evictedNode) {
                    this.cache.delete(evictedNode.key);
                }
            }

            this.addToHead(newNode);
            this.cache.set(key, newNode);
        }

        return evictedNode;
    }

    /**
     * Remove node from its current position
     */
    private removeNode(node: CacheNode): void {
        const prev = node.prev;
        const next = node.next;
        if (prev) prev.next = next;
        if (next) next.prev = prev;
    }

    /**
     * Add node right after head
     */
    private addToHead(node: CacheNode): void {
        node.prev = this.head;
        node.next = this.head.next;
        if (this.head.next) this.head.next.prev = node;
        this.head.next = node;
    }

    /**
     * Move existing node to head
     */
    private moveToHead(node: CacheNode): void {
        this.removeNode(node);
        this.addToHead(node);
    }

    /**
     * Remove and return the tail node (LRU item)
     */
    private removeTail(): CacheNode | null {
        const node = this.tail.prev;
        if (node && node !== this.head) {
            this.removeNode(node);
            return node;
        }
        return null;
    }

    /**
     * Get node ID for visualization
     */
    getNodeId(node: CacheNode): string {
        return this.nodeIdMap.get(node) || `node-unknown`;
    }

    /**
     * Get current cache state for visualization
     */
    getState(): CacheState {
        const nodes: VisualNode[] = [];
        let current = this.head.next;
        let position = 0;

        while (current && current !== this.tail) {
            const isHead = position === 0;
            const isTail = current.next === this.tail;
            const nodeId = this.getNodeId(current);

            nodes.push({
                id: nodeId,
                key: current.key,
                value: current.value,
                position,
                isHead,
                isTail,
                isNew: false,
                isAccessed: false,
                isEvicting: false,
                address: getMemoryAddress(nodeId),
                prevAddress: current.prev ? getMemoryAddress(this.nodeIdMap.get(current.prev) || 'dummy-head') : undefined,
                nextAddress: current.next ? getMemoryAddress(this.nodeIdMap.get(current.next) || 'dummy-tail') : undefined,
            });

            current = current.next;
            position++;
        }

        const hashMapEntries = Array.from(this.cache.entries()).map(([key, node]) => ({
            key,
            nodeId: this.getNodeId(node),
        }));

        return {
            nodes,
            capacity: this.capacity,
            size: this.cache.size,
            hashMapEntries,
        };
    }

    /**
     * Get cache size
     */
    get size(): number {
        return this.cache.size;
    }

    /**
     * Get cache capacity
     */
    getCapacity(): number {
        return this.capacity;
    }

    /**
     * Set new capacity (may trigger evictions)
     */
    setCapacity(newCapacity: number): CacheNode[] {
        const evicted: CacheNode[] = [];
        this.capacity = Math.max(1, newCapacity);

        while (this.cache.size > this.capacity) {
            const node = this.removeTail();
            if (node) {
                this.cache.delete(node.key);
                evicted.push(node);
            }
        }

        return evicted;
    }

    /**
     * Clear all cache entries
     */
    clear(): void {
        this.cache.clear();
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    /**
     * Check if key exists
     */
    has(key: number): boolean {
        return this.cache.has(key);
    }
}

/**
 * Cache Visualizer Bridge
 * Connects LRU Cache with UI for animations and state tracking
 */
export class CacheVisualizer {
    private cache: LRUCache;
    private operations: Operation[] = [];
    private animationQueue: AnimationStep[] = [];
    private stats: StatsData = {
        totalOperations: 0,
        hits: 0,
        misses: 0,
        evictions: 0,
        hitRate: 0,
    };
    private listeners: Set<() => void> = new Set();

    constructor(capacity: number) {
        this.cache = new LRUCache(capacity);
    }

    /**
     * Subscribe to state changes
     */
    subscribe(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify(): void {
        this.listeners.forEach(listener => listener());
    }

    private generateId(): string {
        return `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private updateStats(isHit: boolean, evicted: boolean): void {
        this.stats.totalOperations++;
        if (isHit) {
            this.stats.hits++;
        } else {
            this.stats.misses++;
        }
        if (evicted) {
            this.stats.evictions++;
        }
        this.stats.hitRate = this.stats.totalOperations > 0
            ? (this.stats.hits / this.stats.totalOperations) * 100
            : 0;
    }

    /**
     * Get operation with visualization
     */
    get(key: number): { result: number; operation: Operation; animations: AnimationStep[] } {
        const animations: AnimationStep[] = [];
        const result = this.cache.get(key);
        const isHit = result !== -1;

        const operation: Operation = {
            id: this.generateId(),
            type: 'get',
            key,
            result,
            timestamp: new Date(),
            isHit,
        };

        if (isHit) {
            // Add move-to-head animation
            const state = this.cache.getState();
            const node = state.nodes.find(n => n.key === key);
            if (node && node.position > 0) {
                animations.push({
                    id: this.generateId(),
                    type: 'move',
                    targetNodeId: node.id,
                    fromPosition: node.position,
                    toPosition: 0,
                    description: `Moving key ${key} to head (most recently used)`,
                    duration: 600,
                });
            }
            animations.push({
                id: this.generateId(),
                type: 'highlight',
                targetNodeId: node?.id,
                description: `Cache HIT! Retrieved value ${result} for key ${key}`,
                duration: 400,
            });
        } else {
            animations.push({
                id: this.generateId(),
                type: 'highlight',
                description: `Cache MISS! Key ${key} not found`,
                duration: 400,
            });
        }

        this.updateStats(isHit, false);
        this.operations.push(operation);
        this.animationQueue.push(...animations);
        this.notify();

        return { result, operation, animations };
    }

    /**
     * Put operation with visualization
     */
    put(key: number, value: number): { operation: Operation; animations: AnimationStep[] } {
        const animations: AnimationStep[] = [];
        const existsBefore = this.cache.has(key);
        const willEvict = !existsBefore && this.cache.size >= this.cache.getCapacity();

        let evictedKey: number | undefined;
        let evictedValue: number | undefined;

        if (willEvict) {
            const state = this.cache.getState();
            const tailNode = state.nodes[state.nodes.length - 1];
            if (tailNode) {
                evictedKey = tailNode.key;
                evictedValue = tailNode.value;
                animations.push({
                    id: this.generateId(),
                    type: 'evict',
                    targetNodeId: tailNode.id,
                    description: `Evicting LRU item: key ${tailNode.key}, value ${tailNode.value}`,
                    duration: 700,
                });
            }
        }

        const evictedNode = this.cache.put(key, value);

        if (existsBefore) {
            animations.push({
                id: this.generateId(),
                type: 'update',
                description: `Updated key ${key} with new value ${value}`,
                duration: 400,
            });
        } else {
            animations.push({
                id: this.generateId(),
                type: 'insert',
                description: `Inserted new entry: key ${key}, value ${value}`,
                duration: 500,
            });
        }

        const operation: Operation = {
            id: this.generateId(),
            type: 'put',
            key,
            value,
            timestamp: new Date(),
            isHit: existsBefore,
            evictedKey,
            evictedValue,
        };

        this.updateStats(existsBefore, !!evictedNode);
        this.operations.push(operation);
        this.animationQueue.push(...animations);
        this.notify();

        return { operation, animations };
    }

    /**
     * Get current cache state
     */
    getState(): CacheState {
        return this.cache.getState();
    }

    /**
     * Get statistics
     */
    getStats(): StatsData {
        return { ...this.stats };
    }

    /**
     * Get operation history
     */
    getOperations(): Operation[] {
        return [...this.operations];
    }

    /**
     * Get pending animations
     */
    getAnimationQueue(): AnimationStep[] {
        return [...this.animationQueue];
    }

    /**
     * Clear animation queue
     */
    clearAnimationQueue(): void {
        this.animationQueue = [];
    }

    /**
     * Set capacity
     */
    setCapacity(capacity: number): void {
        const evicted = this.cache.setCapacity(capacity);
        evicted.forEach(node => {
            this.stats.evictions++;
            this.operations.push({
                id: this.generateId(),
                type: 'evict',
                key: node.key,
                value: node.value,
                timestamp: new Date(),
                isHit: false,
            });
        });
        this.notify();
    }

    /**
     * Reset cache
     */
    reset(capacity?: number): void {
        this.cache = new LRUCache(capacity || this.cache.getCapacity());
        this.operations = [];
        this.animationQueue = [];
        this.stats = {
            totalOperations: 0,
            hits: 0,
            misses: 0,
            evictions: 0,
            hitRate: 0,
        };
        this.notify();
    }

    /**
     * Clear operation history
     */
    clearHistory(): void {
        this.operations = [];
        this.notify();
    }

    /**
     * Export state as JSON
     */
    exportState(): string {
        return JSON.stringify({
            state: this.cache.getState(),
            operations: this.operations,
            stats: this.stats,
        }, null, 2);
    }

    /**
     * Get capacity
     */
    getCapacity(): number {
        return this.cache.getCapacity();
    }
}

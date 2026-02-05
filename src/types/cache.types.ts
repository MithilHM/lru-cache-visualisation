// Cache Node structure for doubly linked list
export interface CacheNode {
  key: number;
  value: number;
  prev: CacheNode | null;
  next: CacheNode | null;
}

// Visual representation of a node for UI
export interface VisualNode {
  id: string;
  key: number;
  value: number;
  position: number; // 0 = head (most recent), higher = older
  isHead: boolean;
  isTail: boolean;
  isNew: boolean;
  isAccessed: boolean;
  isEvicting: boolean;
  // Memory addresses for Pointer Inspector
  address?: string;
  prevAddress?: string;
  nextAddress?: string;
  label?: string;
  category?: string;
}

// Cache state snapshot for visualization
export interface CacheState {
  nodes: VisualNode[];
  capacity: number;
  size: number;
  hashMapEntries: { key: number; nodeId: string }[];
}

// Operation types
export type OperationType = 'get' | 'put' | 'evict' | 'move' | 'hit' | 'miss';

// Single operation record
export interface Operation {
  id: string;
  type: OperationType;
  key: number;
  value?: number;
  result?: number;
  timestamp: Date;
  isHit: boolean;
  evictedKey?: number;
  evictedValue?: number;
  label?: string;
  category?: string;
}

// Animation step for step-by-step visualization
export interface AnimationStep {
  id: string;
  type: 'highlight' | 'move' | 'insert' | 'evict' | 'update';
  targetNodeId?: string;
  fromPosition?: number;
  toPosition?: number;
  description: string;
  duration: number;
}

// Statistics data
export interface StatsData {
  totalOperations: number;
  hits: number;
  misses: number;
  evictions: number;
  hitRate: number;
}

// Playback state
export interface PlaybackState {
  isPlaying: boolean;
  speed: number; // 0.5 to 3
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
}

// Preset operation sequence
export interface PresetSequence {
  id: string;
  name: string;
  description: string;
  operations: {
    type: 'get' | 'put';
    key: number;
    value?: number;
    label?: string;
    category?: string;
  }[];
}

// Store state
export interface CacheStore {
  // Cache state
  cacheState: CacheState;
  capacity: number;

  // Statistics
  stats: StatsData;

  // Operation history
  operations: Operation[];

  // Playback
  playback: PlaybackState;
  animationQueue: AnimationStep[];

  // Comparison Mode
  fifoState: CacheState;
  fifoStats: StatsData;

  // Actions
  get: (key: number) => number;
  put: (key: number, value: number) => void;
  setCapacity: (capacity: number) => void;
  reset: () => void;
  clearHistory: () => void;

  // Playback actions
  togglePlayback: () => void;
  setSpeed: (speed: number) => void;
  stepForward: () => void;
  stepBackward: () => void;

  // Export/Import
  exportState: () => string;
  importState: (json: string) => void;
}

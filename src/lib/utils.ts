import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with comma separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format percentage with fixed decimals
 */
export function formatPercent(num: number, decimals: number = 1): string {
  return `${num.toFixed(decimals)}%`;
}

/**
 * Format timestamp to readable time
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Get node color class based on position
 */
export function getNodeColorClass(position: number, total: number): string {
  if (total <= 1) return 'node-head';

  const ratio = position / (total - 1);
  if (ratio <= 0.33) return 'node-head';
  if (ratio <= 0.66) return 'node-middle';
  return 'node-tail';
}

/**
 * Get color for node based on position (for gradients)
 */
export function getNodeColor(position: number, total: number): string {
  if (total <= 1) return '#10b981'; // emerald

  const ratio = position / (total - 1);
  if (ratio <= 0.33) return '#10b981'; // emerald
  if (ratio <= 0.66) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

/**
 * Generate random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Delay helper for animations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Preset operation sequences for demonstration
 */
export const presetSequences = [
  {
    id: 'basic',
    name: 'Basic Operations',
    description: 'Simple put and get operations',
    operations: [
      { type: 'put' as const, key: 1, value: 100 },
      { type: 'put' as const, key: 2, value: 200 },
      { type: 'put' as const, key: 3, value: 300 },
      { type: 'get' as const, key: 1 },
      { type: 'get' as const, key: 2 },
    ],
  },
  {
    id: 'eviction',
    name: 'LRU Eviction Demo',
    description: 'Shows eviction when capacity is exceeded',
    operations: [
      { type: 'put' as const, key: 1, value: 10 },
      { type: 'put' as const, key: 2, value: 20 },
      { type: 'put' as const, key: 3, value: 30 },
      { type: 'get' as const, key: 1 },
      { type: 'put' as const, key: 4, value: 40 },
      { type: 'put' as const, key: 5, value: 50 },
    ],
  },
  {
    id: 'update',
    name: 'Update Existing Keys',
    description: 'Updating moves items to front',
    operations: [
      { type: 'put' as const, key: 1, value: 100 },
      { type: 'put' as const, key: 2, value: 200 },
      { type: 'put' as const, key: 3, value: 300 },
      { type: 'put' as const, key: 1, value: 150 },
      { type: 'get' as const, key: 3 },
      { type: 'put' as const, key: 2, value: 250 },
    ],
  },
  {
    id: 'stress',
    name: 'Stress Test',
    description: 'Many rapid operations',
    operations: Array.from({ length: 15 }, (_, i) => ({
      type: (i % 3 === 0 ? 'get' : 'put') as 'get' | 'put',
      key: randomInt(1, 8),
      value: randomInt(100, 999),
    })),
  },
];

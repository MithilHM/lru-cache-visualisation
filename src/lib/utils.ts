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
 * Get color for node based on position
 */
export function getNodeColor(position: number, total: number): string {
  if (total <= 1) return '#10b981'; // emerald-500

  const ratio = position / (total - 1);
  if (ratio <= 0.33) return '#10b981'; // emerald-500
  if (ratio <= 0.66) return '#f59e0b'; // amber-500
  return '#f43f5e'; // rose-500 (B2B SaaS compatible red)
}

/**
 * Generate a mock memory address for a given ID
 */
export function getMemoryAddress(id: string): string {
  // Use a simple hash to keep addresses consistent for the same ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(4, '0').toUpperCase();
  return `0x${hex}`;
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
    id: 'lru_superiority',
    name: 'LRU Efficiency Demo',
    description: 'A sequence where temporal locality makes LRU outperform FIFO',
    operations: [
      { type: 'put' as const, key: 1, value: 100 },
      { type: 'put' as const, key: 2, value: 200 },
      { type: 'put' as const, key: 3, value: 300 },
      { type: 'put' as const, key: 4, value: 400 },
      { type: 'put' as const, key: 5, value: 500 }, // Full capacity (5)
      { type: 'get' as const, key: 1 }, // LRU moves 1 to head, FIFO keeps it at front
      { type: 'put' as const, key: 6, value: 600 }, // Eviction: LRU evicts 2, FIFO evicts 1 (the oldest)
      { type: 'get' as const, key: 1 }, // HIT in LRU, MISS in FIFO
      { type: 'get' as const, key: 1 }, // Another HIT in LRU
      { type: 'put' as const, key: 7, value: 700 }, // LRU evicts 3, FIFO evicts 2
      { type: 'get' as const, key: 1 }, // Persistent HIT in LRU
    ],
  },
  {
    id: 'browser_cache',
    name: 'Web Browser Asset Cache',
    description: 'Simulating how a browser caches images and scripts to speed up navigation',
    operations: [
      { type: 'put' as const, key: 101, value: 1200, label: 'hero-banner.jpg', category: 'image' },
      { type: 'put' as const, key: 102, value: 450, label: 'main-style.css', category: 'style' },
      { type: 'put' as const, key: 103, value: 800, label: 'app-logic.js', category: 'script' },
      { type: 'put' as const, key: 104, value: 300, label: 'logo-vector.svg', category: 'image' },
      { type: 'put' as const, key: 105, value: 1500, label: 'user-gallery-1.png', category: 'image' }, // Capacity (5)
      { type: 'get' as const, key: 101, label: 'hero-banner.jpg' }, // Users navigates back to Home (HIT)
      { type: 'put' as const, key: 106, value: 2200, label: 'heavy-video-intro.mp4', category: 'video' }, // Evicts 102
      { type: 'get' as const, key: 103, label: 'app-logic.js' }, // Script reused (HIT)
      { type: 'put' as const, key: 107, value: 600, label: 'nav-icons.woff2', category: 'font' }, // Evicts 104
      { type: 'get' as const, key: 101, label: 'hero-banner.jpg' }, // Navigates Home again (HIT)
    ],
  },
];

export const assetIcons: Record<string, string> = {
  image: '🖼️',
  style: '🎨',
  script: '📜',
  video: '🎥',
  font: '🗚',
  other: '📦'
};

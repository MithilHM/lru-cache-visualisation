'use client';

import { motion } from 'framer-motion';
import { LinkedListView } from '@/components/cache/LinkedListView';
import { HashMapView } from '@/components/cache/HashMapView';
import { ControlPanel } from '@/components/controls/ControlPanel';
import { StatsPanel } from '@/components/stats/StatsPanel';
import { OperationLog } from '@/components/stats/OperationLog';
import {
  Database,
  Github,
  Info,
  Cpu
} from 'lucide-react';

import DotGrid from '@/components/ui/DotGrid/DotGrid';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background DotGrid */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30">
        <DotGrid
          dotSize={21}
          gap={10}
          baseColor="#381f2a"
          activeColor="#37ff29"
        />
      </div>
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong sticky top-0 z-50 border-b border-border/50"
      >
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  LRU Cache Visualizer
                </h1>
                <p className="text-xs text-muted-foreground">
                  Interactive Data Structure Lab
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-background/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                <Github className="w-5 h-5" />
              </a>
              <button className="p-2 rounded-lg hover:bg-background/50 transition-colors text-muted-foreground hover:text-foreground">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Controls */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="sticky top-24">
              <ControlPanel />
            </div>
          </motion.aside>

          {/* Center Panel - Visualization */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Linked List */}
            <LinkedListView />

            {/* Hash Map */}
            <HashMapView />

            {/* Algorithm Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl p-4"
            >
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                Algorithm Complexity
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-lg bg-background/50">
                  <div className="text-xl font-bold text-emerald-400 font-mono">O(1)</div>
                  <div className="text-xs text-muted-foreground">Get</div>
                </div>
                <div className="p-3 rounded-lg bg-background/50">
                  <div className="text-xl font-bold text-emerald-400 font-mono">O(1)</div>
                  <div className="text-xs text-muted-foreground">Put</div>
                </div>
                <div className="p-3 rounded-lg bg-background/50">
                  <div className="text-xl font-bold text-primary font-mono">O(n)</div>
                  <div className="text-xs text-muted-foreground">Space</div>
                </div>
                <div className="p-3 rounded-lg bg-background/50">
                  <div className="text-xl font-bold text-amber-400 font-mono">HashMap</div>
                  <div className="text-xs text-muted-foreground">+ DLL</div>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Right Panel - Stats & Logs */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-6"
          >
            <StatsPanel />
            <OperationLog />
          </motion.aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-8">
        <div className="max-w-[1800px] mx-auto px-6 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built for DSA Lab • LRU Cache with HashMap + Doubly Linked List
          </p>
        </div>
      </footer>
    </div>
  );
}

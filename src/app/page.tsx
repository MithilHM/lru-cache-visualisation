'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCacheStore } from '@/store/cache-store';
import { StatsPanel } from '@/components/stats/StatsPanel';
import { OperationLog } from '@/components/stats/OperationLog';
import { ControlPanel } from '@/components/controls/ControlPanel';
import { LinkedListView } from '@/components/cache/LinkedListView';
import { ComparisonView } from '@/components/cache/ComparisonView';
import { AlternateArchitecturesView } from '@/components/cache/AlternateArchitecturesView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Layers,
  Settings,
  ShieldCheck,
  Cpu,
  Github,
  Globe
} from 'lucide-react';
import DotGrid from '@/components/ui/DotGrid/DotGrid';
import { RealWorldSimulationView } from '@/components/cache/RealWorldSimulationView';

export default function Home() {
  const [activeTab, setActiveTab] = useState('visualizer');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Subtle background texture */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]">
        <DotGrid
          dotSize={20}
          gap={12}
          baseColor="#0f172a"
          activeColor="#2563eb"
        />
      </div>

      {/* Modern B2B SaaS Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-[1600px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 group cursor-pointer transition-transform hover:scale-105 active:scale-95">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-0.5">Algoverse <span className="text-blue-600">Pro</span></h1>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Visualizer v2.0</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com" className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Content Area - Tabbed Interface */}
          <section className={(activeTab === 'comparison' || activeTab === 'alternates' || activeTab === 'realworld') ? 'lg:col-span-12' : 'lg:col-span-9 lg:order-2'}>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/60">
                <TabsList className="bg-slate-100 p-1 border border-slate-200/60">
                  <TabsTrigger value="visualizer" className="gap-2 px-6 py-2 rounded-md transition-all">
                    <LayoutDashboard className="w-4 h-4" />
                    Visualizer
                  </TabsTrigger>
                  <TabsTrigger value="comparison" className="gap-2 px-6 py-2 rounded-md transition-all">
                    <ArrowLeftRight className="w-4 h-4" />
                    Algorithm Comparison
                  </TabsTrigger>
                  <TabsTrigger value="alternates" className="gap-2 px-6 py-2 rounded-md transition-all">
                    <Layers className="w-4 h-4" />
                    Alternate Architectures
                  </TabsTrigger>
                  <TabsTrigger value="realworld" className="gap-2 px-6 py-2 rounded-md transition-all">
                    <Globe className="w-4 h-4" />
                    Real-World App
                  </TabsTrigger>
                </TabsList>

                <div className="hidden sm:flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">System Nominal</span>
                  </div>
                </div>
              </div>

              <TabsContent value="visualizer" className="mt-0 focus-visible:outline-none">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                  <div className="xl:col-span-3 space-y-8">
                    <LinkedListView />
                    <OperationLog />
                  </div>
                  <div className="xl:col-span-1 space-y-8">
                    <StatsPanel />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comparison" className="mt-0 focus-visible:outline-none">
                <ComparisonView />
              </TabsContent>

              <TabsContent value="alternates" className="mt-0 focus-visible:outline-none">
                <AlternateArchitecturesView />
              </TabsContent>

              <TabsContent value="realworld" className="mt-0 focus-visible:outline-none">
                <RealWorldSimulationView />
              </TabsContent>
            </Tabs>
          </section>

          {/* Sidebar - Conditional rendering based on tab */}
          {activeTab === 'visualizer' && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 lg:order-1 space-y-6 lg:sticky lg:top-24"
            >
              <div className="flex items-center gap-2 px-1 mb-2">
                <Settings className="w-4 h-4 text-slate-400" />
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Operation Core</h2>
              </div>
              <ControlPanel />
            </motion.aside>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 mt-20 bg-white">
        <div className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-slate-400" />
            <p className="text-sm font-bold text-slate-500">
              © 2026 Algoverse Systems • Secure DSA Engineering
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

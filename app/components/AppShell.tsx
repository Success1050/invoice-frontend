"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-950">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col md:pl-[260px] min-h-screen w-0 min-w-full overflow-x-hidden overflow-y-auto transition-all duration-300">
        {/* Mobile topbar */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            {/* Global Search Shortcut */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-400 group cursor-pointer hover:bg-white/[0.08] hover:border-white/20 transition-all">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <span>Search...</span>
              <div className="ml-2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded text-[10px] font-bold text-slate-300 group-hover:text-white transition-colors">⌘</kbd>
                <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded text-[10px] font-bold text-slate-300 group-hover:text-white transition-colors">K</kbd>
              </div>
            </div>

            {/* Profile & Notifications */}
            <div className="flex items-center gap-3">
              <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all relative">
                <span className="text-xl">🔔</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950" />
              </button>
              <div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-500/20 cursor-pointer hover:scale-105 transition-transform"
              >
                E
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}

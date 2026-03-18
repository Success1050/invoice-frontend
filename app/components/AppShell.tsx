"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        {/* Mobile topbar */}
        <header className="topbar">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: "auto" }}>
            {/* Mockup Search Shortcut */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
              className="hidden sm-flex"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <span>Search everywhere...</span>
              <kbd style={{ marginLeft: 8, padding: "2px 6px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 4, fontWeight: 700 }}>⌘K</kbd>
            </div>

            {/* Mockup Profile */}
            <div style={{ display: "flex", gap: 12 }}>
              <button className="nav-item" style={{ padding: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }}>
                <span style={{ fontSize: 16 }}>🔔</span>
              </button>
              <div 
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--gradient-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "white",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(79, 142, 247, 0.3)",
                }}
              >
                E
              </div>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}

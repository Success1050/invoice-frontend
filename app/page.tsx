"use client";
import Link from "next/link";
import { useState } from "react";

const features = [
  {
    icon: "📄",
    title: "Smart Invoicing",
    desc: "Create, track and manage invoices with real-time status updates. Never lose track of payments again.",
  },
  {
    icon: "👥",
    title: "Customer Management",
    desc: "Maintain a rich customer database with full contact details, history, and invoice associations.",
  },
  {
    icon: "🔍",
    title: "Instant Search",
    desc: "Find any invoice or customer instantly with powerful real-time search and advanced filters.",
  },
  {
    icon: "📊",
    title: "Dashboard Analytics",
    desc: "Get a birds-eye view of your business with key stats, totals, and status breakdowns.",
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    desc: "Built on Next.js 16 for blazing fast navigation, server-side rendering, and optimal performance.",
  },
  {
    icon: "🔒",
    title: "Reliable API",
    desc: "Powered by a robust NestJS backend with structured CRUD endpoints for invoices and customers.",
  },
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden w-full" style={{ background: "linear-gradient(135deg, #1a0f2e 0%, #2d1b69 50%, #1a0f2e 100%)" }}>
      {/* Background glows */}
      <div className="landing-glow-1" />
      <div className="landing-glow-2" />
      <div className="landing-glow-3" />

      {/* Mobile Menu Overlay — moved OUTSIDE nav so it's not constrained */}
      <div
        className={`fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[1000] md:hidden transition-all duration-500 ease-in-out ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-8 py-12" onClick={(e) => e.stopPropagation()}>
          <Link href="/dashboard"
            className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/invoices"
            className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            onClick={() => setIsMenuOpen(false)}>
            Invoices
          </Link>
          <Link href="/customers"
            className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            onClick={() => setIsMenuOpen(false)}>
            Customers
          </Link>

          <button
            className="mt-8 px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold cursor-pointer hover:bg-white/20 transition-all"
            onClick={() => setIsMenuOpen(false)}>
            Close Menu
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 py-6 md:px-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl font-extrabold text-white text-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40">
            I
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:block gradient-text-accent">
            InvoiceFlow
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-medium no-underline transition-all backdrop-blur-lg hover:bg-white/10 hover:border-white/20 hover:text-white">
            Dashboard
          </Link>
          <Link href="/invoices" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-medium no-underline transition-all backdrop-blur-lg hover:bg-white/10 hover:border-white/20 hover:text-white">
            Invoices
          </Link>
          <Link href="/customers" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-medium no-underline transition-all backdrop-blur-lg hover:bg-white/10 hover:border-white/20 hover:text-white">
            Customers
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center relative cursor-pointer group z-[1001]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Hero */}
      <section className="pt-16 sm:pt-20 pb-16 px-4 sm:px-6 flex flex-col items-center text-center relative z-10 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm font-medium text-blue-400 mb-8 animate-fade-in-down">
          <span>✦</span>
          Modern Invoice Management Platform
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1] md:max-w-4xl">
          Manage Invoices &amp;<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
            Customers with Ease
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed px-2">
          A beautifully crafted platform for tracking invoices, managing customers,
          and keeping your business finances organized — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mb-16 sm:mb-24 w-full sm:w-auto">
          <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all no-underline">
            <span className="text-xl">⊞</span>
            Go to Dashboard
          </Link>
          <Link href="/invoices" className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold backdrop-blur-xl hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all no-underline">
            <span>📄</span>
            View Invoices
          </Link>
          <Link href="/customers" className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold backdrop-blur-xl hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all no-underline">
            <span>👥</span>
            View Customers
          </Link>
        </div>

        {/* Mini preview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mx-auto mb-16 px-2">
          {[
            { label: "Total Invoices", value: "Active", color: "text-blue-400", bg: "bg-blue-400/5", border: "border-blue-400/10" },
            { label: "Status", value: "Paid / Pending", color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/10" },
            { label: "Customers", value: "All Tracked", color: "text-indigo-400", bg: "bg-indigo-400/5", border: "border-indigo-400/10" },
          ].map((item) => (
            <div
              key={item.label}
              className={`p-6 bg-white/5 border border-white/10 rounded-2xl text-center backdrop-blur-2xl flex flex-col items-center justify-center ${item.bg} ${item.border}`}
            >
              <p className={`text-xl sm:text-2xl font-bold mb-1 ${item.color}`}>
                {item.value}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto pb-16 sm:pb-24 relative z-10">
        {features.map((f) => (
          <div className="p-6 sm:p-8 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl hover:bg-white/[0.08] hover:border-blue-500/30 transition-all group relative overflow-hidden" key={f.title}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-3xl sm:text-4xl mb-4 sm:mb-6 block relative z-10">{f.icon}</span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 relative z-10 group-hover:text-blue-400 transition-colors">{f.title}</h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed relative z-10">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA strip */}
      <div className="relative z-10 text-center px-4 sm:px-6 pb-16 sm:pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto p-8 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
            Ready to get started?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
            Jump into your dashboard and start managing invoices and customers today
            with our powerful, intuitive platform.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 relative z-10">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all text-center no-underline">
              Open Dashboard ↗
            </Link>
            <Link href="/invoices" className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold backdrop-blur-xl hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all text-center no-underline">
              Invoices
            </Link>
            <Link href="/customers" className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold backdrop-blur-xl hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all text-center no-underline">
              Customers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
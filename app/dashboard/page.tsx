"use client";

import { useEffect, useState } from "react";
import { getInvoices, getCustomers } from "../services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";

function StatCard({
  icon,
  label,
  value,
  color,
  sub,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  sub?: string;
}) {
  return (
    <div className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] hover:border-white/10 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 transition-opacity group-hover:opacity-30" style={{ background: color }} />
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ background: `${color}20`, color }}>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em]">{label}</div>
      {sub && (
        <div className="text-[11px] text-slate-400 mt-4 flex items-center gap-1.5 font-medium">
          <span className="w-1 h-1 rounded-full" style={{ background: color }} />
          {sub}
        </div>
      )}
    </div>
  );
}

function DashboardContent() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([getInvoices(), getCustomers()])
      .then(([inv, cust]) => {
        setInvoices(Array.isArray(inv) ? inv : []);
        setCustomers(Array.isArray(cust) ? cust : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const paid = invoices.filter((i) => i.status === "paid");
  const pending = invoices.filter((i) => i.status === "pending");
  const overdue = invoices.filter((i) => i.status === "overdue");
  const paidAmount = paid.reduce((s, i) => s + (Number(i.amount) || 0), 0);

  const recentInvoices = [...invoices].slice(-5).reverse();
  const recentCustomers = [...customers].slice(-5).reverse();

  const avatarColors = ["#4f8ef7", "#7c6bf0", "#22d3ee", "#10b981", "#f59e0b", "#f43f5e"];

  const getInitials = (name: string) =>
    (name ?? "?").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const getBadgeStyles = (status: string) => {
    switch(status) {
      case "paid": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "overdue": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <>
      <div className="mb-10 animate-fade-in">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Dashboard</h1>
        <p className="text-slate-400 font-medium tracking-tight">Welcome back — here's an overview of your business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon="📄" label="Total Invoices" value={loading ? "—" : invoices.length} color="#4f8ef7" sub={`${paid.length} paid`} />
        <StatCard icon="✅" label="Revenue Collected" value={loading ? "—" : `₦${paidAmount.toLocaleString()}`} color="#10b981" sub="From paid invoices" />
        <StatCard icon="⏳" label="Pending" value={loading ? "—" : pending.length} color="#f59e0b" sub={`₦${pending.reduce((s, i) => s + (Number(i.amount) || 0), 0).toLocaleString()}`} />
        <StatCard icon="👥" label="Customers" value={loading ? "—" : customers.length} color="#7c6bf0" sub="Total registered" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
        {/* Recent Invoices */}
        <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 pb-2 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Recent Invoices
            </h2>
            <Link href="/invoices" className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="p-2">
            {loading ? (
              <div className="space-y-2 p-4">
                {[1,2,3].map((k) => <div key={k} className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />)}
              </div>
            ) : recentInvoices.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-3xl opacity-50">📄</div>
                <p className="text-slate-500 font-bold">No invoices yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentInvoices.map((inv, idx) => {
                  const color = avatarColors[idx % avatarColors.length];
                  return (
                    <button 
                      key={inv.id} 
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left group"
                      onClick={() => router.push(`/invoices/${inv.id}`)}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-[11px] group-hover:scale-105 transition-transform" style={{ background: `${color}15`, color }}>
                        #{inv.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white mb-1">Invoice #{inv.id}</div>
                        <div className="text-xs font-semibold text-slate-500 truncate">{inv.customer?.name ?? "Unknown"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white mb-1.5">₦{Number(inv.amount).toLocaleString()}</div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyles(inv.status)}`}>
                          {inv.status?.toUpperCase()}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 pb-2 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Recent Customers
            </h2>
            <Link href="/customers" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="p-2">
            {loading ? (
              <div className="space-y-2 p-4">
                {[1,2,3].map((k) => <div key={k} className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />)}
              </div>
            ) : recentCustomers.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-3xl opacity-50">👥</div>
                <p className="text-slate-500 font-bold">No customers yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentCustomers.map((cust, idx) => {
                  const color = avatarColors[idx % avatarColors.length];
                  return (
                    <button 
                      key={cust.id} 
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left group"
                      onClick={() => router.push(`/customers/${cust.id}`)}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm tracking-tighter group-hover:scale-105 transition-transform" style={{ background: `${color}15`, color }}>
                        {getInitials(cust.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white mb-1">{cust.name}</div>
                        <div className="text-xs font-semibold text-slate-500 truncate">{cust.email}</div>
                      </div>
                      <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
                        Customer
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown Section */}
      {!loading && invoices.length > 0 && (
        <div className="mt-12 bg-white/5 border border-white/5 rounded-[2rem] p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-8">System Health & Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Paid Invoices", count: paid.length, pct: Math.round((paid.length / invoices.length) * 100), color: "rgb(16, 185, 129)", shadow: "shadow-emerald-500/10" },
              { label: "Pending Payment", count: pending.length, pct: Math.round((pending.length / invoices.length) * 100), color: "rgb(245, 158, 11)", shadow: "shadow-amber-500/10" },
              { label: "Overdue Attention", count: overdue.length, pct: Math.round((overdue.length / invoices.length) * 100), color: "rgb(244, 63, 94)", shadow: "shadow-rose-500/10" },
            ].map((s) => (
              <div key={s.label} className={`p-6 bg-slate-950/40 border border-white/5 rounded-2xl ${s.shadow}`}>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
                  <span className="text-2xl font-black" style={{ color: s.color }}>{s.count}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                  <div className="h-full transition-all duration-1000 ease-out rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
                <p className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                  <span>{s.pct}% of total assets</span>
                  <span style={{ color: s.color }}>+{s.pct}%</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}

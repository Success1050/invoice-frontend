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
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}18` }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && (
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
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

  const getBadgeClass = (status: string) => {
    if (status === "paid") return "badge-paid";
    if (status === "pending") return "badge-pending";
    if (status === "overdue") return "badge-overdue";
    return "badge-draft";
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back — here's an overview of your business</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon="📄" label="Total Invoices" value={loading ? "—" : invoices.length} color="#4f8ef7" sub={`${paid.length} paid`} />
        <StatCard icon="✅" label="Revenue Collected" value={loading ? "—" : `₦${paidAmount.toLocaleString()}`} color="#10b981" sub="From paid invoices" />
        <StatCard icon="⏳" label="Pending" value={loading ? "—" : pending.length} color="#f59e0b" sub={`₦${pending.reduce((s, i) => s + (Number(i.amount) || 0), 0).toLocaleString()}`} />
        <StatCard icon="👥" label="Customers" value={loading ? "—" : customers.length} color="#7c6bf0" sub="Total registered" />
      </div>

      <div className="content-section">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
          {/* Recent Invoices */}
          <div>
            <div className="section-header">
              <h2 className="section-title">Recent Invoices</h2>
              <Link href="/invoices" style={{ fontSize: 13, color: "var(--accent-blue)", textDecoration: "none", fontWeight: 500 }}>
                View all →
              </Link>
            </div>
            {loading ? (
              <>{[1,2,3].map((k) => <div key={k} className="skeleton skeleton-row" />)}</>
            ) : recentInvoices.length === 0 ? (
              <div className="empty-state" style={{ padding: "40px 20px" }}>
                <span className="empty-state-icon">📄</span>
                <p className="empty-state-title">No invoices yet</p>
              </div>
            ) : (
              <div className="data-list">
                {recentInvoices.map((inv, idx) => {
                  const color = avatarColors[idx % avatarColors.length];
                  return (
                    <button key={inv.id} className="data-row" onClick={() => router.push(`/invoices/${inv.id}`)}>
                      <div className="avatar" style={{ background: `${color}1a`, color, fontSize: 11, fontWeight: 700 }}>#{inv.id}</div>
                      <div className="row-main">
                        <div className="row-title">Invoice #{inv.id}</div>
                        <div className="row-subtitle">{inv.customer?.name ?? "Unknown"}</div>
                      </div>
                      <div className="row-meta">
                        <span className="invoice-amount">₦{Number(inv.amount).toLocaleString()}</span>
                        <span className={`badge ${getBadgeClass(inv.status)}`}>{inv.status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Customers */}
          <div>
            <div className="section-header">
              <h2 className="section-title">Recent Customers</h2>
              <Link href="/customers" style={{ fontSize: 13, color: "var(--accent-blue)", textDecoration: "none", fontWeight: 500 }}>
                View all →
              </Link>
            </div>
            {loading ? (
              <>{[1,2,3].map((k) => <div key={k} className="skeleton skeleton-row" />)}</>
            ) : recentCustomers.length === 0 ? (
              <div className="empty-state" style={{ padding: "40px 20px" }}>
                <span className="empty-state-icon">👥</span>
                <p className="empty-state-title">No customers yet</p>
              </div>
            ) : (
              <div className="data-list">
                {recentCustomers.map((cust, idx) => {
                  const color = avatarColors[idx % avatarColors.length];
                  return (
                    <button key={cust.id} className="data-row" onClick={() => router.push(`/customers/${cust.id}`)}>
                      <div className="avatar" style={{ background: `${color}1a`, color, fontSize: 14 }}>{getInitials(cust.name)}</div>
                      <div className="row-main">
                        <div className="row-title">{cust.name}</div>
                        <div className="row-subtitle">{cust.email}</div>
                      </div>
                      <div className="row-meta"><span className="tag">Customer</span></div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Breakdown bars */}
        {!loading && invoices.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div className="section-header">
              <h2 className="section-title">Invoice Breakdown</h2>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Paid", count: paid.length, pct: Math.round((paid.length / invoices.length) * 100), color: "#10b981" },
                { label: "Pending", count: pending.length, pct: Math.round((pending.length / invoices.length) * 100), color: "#f59e0b" },
                { label: "Overdue", count: overdue.length, pct: Math.round((overdue.length / invoices.length) * 100), color: "#f43f5e" },
              ].map((s) => (
                <div key={s.label} style={{ flex: "1 1 180px", padding: 20, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{s.label}</span>
                    <span style={{ fontWeight: 700, color: s.color, fontSize: 18 }}>{s.count}</span>
                  </div>
                  <div style={{ height: 6, background: "var(--bg-primary)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 99 }} />
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{s.pct}% of total</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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

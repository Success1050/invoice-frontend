"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "⊞", label: "Dashboard" },
  { href: "/invoices", icon: "📄", label: "Invoices" },
  { href: "/customers", icon: "👥", label: "Customers" },
];

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 49,
            backdropFilter: "blur(4px)",
          }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar${mobileOpen ? " open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">
            <div className="logo-icon">I</div>
            <span className="logo-text">InvoiceFlow</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="nav-section-title">Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${pathname === item.href ? " active" : ""}`}
              onClick={onClose}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div
            style={{
              padding: "12px",
              background: "rgba(79,142,247,0.08)",
              border: "1px solid rgba(79,142,247,0.15)",
              borderRadius: "12px",
            }}
          >
            <p style={{ fontSize: "12px", color: "var(--accent-blue)", fontWeight: 600, marginBottom: "4px" }}>
              InvoiceFlow Pro
            </p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Manage invoices &amp; customers
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

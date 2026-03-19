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
      <div 
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[49] md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside className={`fixed top-0 left-0 z-50 h-screen w-[260px] bg-slate-900 border-r border-white/5 flex flex-col transition-transform duration-300 md:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Logo */}
        <div className="p-7 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-white shadow-lg shadow-blue-500/20">
              I
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
              InvoiceFlow
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1.5 ring-offset-slate-900">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-4">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 ring-1 ring-blue-500/10" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <span className={`text-lg transition-transform group-hover:scale-110 duration-200 ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white"}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 mt-auto">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/10 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-400/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <p className="text-xs font-bold text-blue-400 mb-1 relative z-10">
              InvoiceFlow Pro
            </p>
            <p className="text-[11px] text-slate-500 relative z-10 leading-relaxed font-medium">
              Manage invoices &amp; customers with advanced analytics
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

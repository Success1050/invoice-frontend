"use client";

import { useEffect, useState } from "react";
import { getInvoices, getCustomers, createInvoice, updateInvoice, deleteInvoice } from "../services/api";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";
import SearchBar from "../components/SearchBar";


const avatarColors = [
  "#4f8ef7", "#7c6bf0", "#22d3ee", "#10b981", "#f59e0b", "#f43f5e",
];

const STATUS_FILTERS = ["all", "paid", "pending", "overdue", "draft"];

function getBadgeStyles(status: string) {
  switch(status) {
    case "paid": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "overdue": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

function SkeletonRows() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((k) => (
        <div key={k} className="h-20 w-full bg-white/5 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [formData, setFormData] = useState({
    customerId: "",
    amount: "",
    status: "pending",
    description: "",
  });
  const router = useRouter();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const customerNameParam = searchParams?.get("customer");
  const customerIdParam = searchParams?.get("customerId");

  useEffect(() => {
    if (customerNameParam) {
      setSearch(customerNameParam);
    }
  }, [customerNameParam]);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getInvoices();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load customers for select");
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) return alert("Please select a customer");
    setSubmitting(true);
    try {
      const payload = { ...formData, amount: Number(formData.amount), customerId: Number(formData.customerId) };
      if (editingInvoice) {
        await updateInvoice(editingInvoice.id, payload);
      } else {
        await createInvoice(payload);
      }
      setIsModalOpen(false);
      setEditingInvoice(null);
      setFormData({ customerId: "", amount: "", status: "pending", description: "" });
      fetchInvoices();
    } catch (err) {
      alert(`Failed to ${editingInvoice ? "update" : "create"} invoice.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingInvoice(null);
    setFormData({ customerId: "", amount: "", status: "pending", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, inv: any) => {
    e.stopPropagation();
    setEditingInvoice(inv);
    setFormData({
      customerId: String(inv.customer?.id || ""),
      amount: String(inv.amount),
      status: inv.status || "pending",
      description: inv.description || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: any) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await deleteInvoice(id);
      fetchInvoices();
    } catch (err) {
      alert("Failed to delete invoice.");
    }
  };

  const filtered = invoices.filter((i: any) => {
    const matchSearch =
      i.status?.toLowerCase().includes(search.toLowerCase()) ||
      i.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(i.id).includes(search) ||
      i.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    const matchCustomerId = !customerIdParam || String(i.customer?.id) === customerIdParam;
    return matchSearch && matchStatus && matchCustomerId;
  });

  const totalAmount = filtered.reduce((s: number, i: any) => s + (Number(i.amount) || 0), 0);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Invoices</h1>
          <p className="text-slate-400 font-medium">
            {loading ? "Loading statistics…" : `${invoices.length} active invoices in the system`}
          </p>
        </div>
        <button 
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
          onClick={handleOpenCreate}
        >
          <span className="text-xl">+</span> Create Invoice
        </button>
      </div>

      <div className="space-y-6 min-w-0 w-full">
        {/* Toolbar & Filters */}
        <div className="flex flex-col gap-4 w-full min-w-0">
          <div className="w-full min-w-0">
            <SearchBar
              placeholder="Search by customer, status or ID…"
              value={search}
              onChange={(val: string) => setSearch(val)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full min-w-0">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  statusFilter === s 
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30 ring-1 ring-blue-500/20" 
                    : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-300"
                }`}
                onClick={() => setStatusFilter(s)}
              >
                {s.toUpperCase()}
                {s !== "all" && (
                  <span className="ml-1.5 py-0.5 px-1.5 rounded-lg bg-black/20 opacity-60">
                    {invoices.filter((i) => i.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary horizontal bar */}
        {!loading && !error && filtered.length > 0 && (
          <div className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-slate-400">
               <span className="w-2 h-2 rounded-full bg-blue-500" />
               Showing <strong className="text-white mx-0.5">{filtered.length}</strong> matching results
            </div>
            <div className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
               Page Total: ₦{totalAmount.toLocaleString()}
            </div>
          </div>
        )}

        {/* Dynamic Content States */}
        {loading && <SkeletonRows />}

        {!loading && error && (
          <div className="py-20 flex flex-col items-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center text-3xl mb-6">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Data fetch failed</h3>
            <p className="text-slate-400 leading-relaxed">Please check your network connection or ensure the API server is healthy.</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-32 flex flex-col items-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-4xl mb-6 opacity-50">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No records found</h3>
            <p className="text-slate-400 leading-relaxed">
              {search ? `We couldn't find any invoices matching "${search}".` : "Your invoice database is currently empty."}
            </p>
          </div>
        )}

        {/* Invoice Grid/List */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((inv, idx) => {
              const color = avatarColors[idx % avatarColors.length];
              return (
                <div 
                  key={inv.id}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-pointer relative overflow-hidden"
                  onClick={() => router.push(`/invoices/${inv.id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs tracking-tighter shrink-0 relative z-10" 
                    style={{ background: `${color}15`, color }}
                  >
                    #{inv.id}
                  </div>

                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-base font-bold text-white">Invoice #{inv.id}</span>
                      {inv.description && (
                        <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-white/5">
                          {inv.description}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearch(inv.customer?.name || "");
                        }}
                        className="hover:text-blue-400 transition-colors cursor-pointer font-bold"
                      >
                        {inv.customer?.name ?? "Guest User"}
                      </button>
                      {inv.customer?.email && <span className="text-slate-600 text-xs">· {inv.customer.email}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between sm:justify-end relative z-10">
                    <div className="text-right">
                      <div className="text-lg font-black text-white mb-1">₦{Number(inv.amount).toLocaleString()}</div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getBadgeStyles(inv.status)}`}>
                        {inv.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => handleOpenEdit(e, inv)}
                        className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                      >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, inv.id)}
                        className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                      >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="hidden sm:block text-slate-600 group-hover:text-blue-400 transition-colors translate-x-1 group-hover:translate-x-2">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInvoice ? "Edit Invoice Detail" : "Generate New Invoice"}
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Customer Client</label>
            <div className="relative group">
              <select
                className="w-full h-12 bg-slate-900 border border-white/10 rounded-xl px-4 text-white text-sm focus:border-blue-500 outline-none transition-all appearance-none"
                required
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              >
                <option value="">Select a registered customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Amount (₦)</label>
            <input
              type="number"
              className="w-full h-12 bg-slate-900 border border-white/10 rounded-xl px-4 text-white text-sm focus:border-blue-500 outline-none transition-all"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Status</label>
              <div className="relative group">
                <select
                  className="w-full h-12 bg-slate-900 border border-white/10 rounded-xl px-4 text-white text-sm focus:border-blue-500 outline-none transition-all appearance-none"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {STATUS_FILTERS.filter(s => s !== "all").map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Reference</label>
              <input
                type="text"
                className="w-full h-12 bg-slate-900 border border-white/10 rounded-xl px-4 text-white text-sm focus:border-blue-500 outline-none transition-all"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. INV-2024"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl text-slate-300 font-bold hover:bg-white/10 transition-all"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Processing…" : editingInvoice ? "Update Invoice" : "Confirm Invoice"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
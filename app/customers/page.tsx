"use client";

import { useEffect, useState } from "react";
import { getCustomers, createCustomer, deleteCustomer, updateCustomer } from "../services/api";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";
import SearchBar from "../components/SearchBar";
import AppShell from "../components/AppShell";

const avatarColors = [
  "#4f8ef7", "#7c6bf0", "#22d3ee", "#10b981", "#f59e0b", "#f43f5e",
  "#ec4899", "#14b8a6", "#6366f1", "#84cc16",
];

function getInitials(name: string) {
  return (name ?? "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SkeletonRows() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((k) => (
        <div key={k} className="h-[72px] w-full rounded-[14px] animate-shimmer" />
      ))}
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const router = useRouter();

  const fetchCustomers = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
      } else {
        await createCustomer(formData);
      }
      setIsModalOpen(false);
      setEditingCustomer(null);
      setFormData({ name: "", email: "", phone: "" });
      fetchCustomers();
    } catch (err) {
      alert(`Failed to ${editingCustomer ? "update" : "create"} customer.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setFormData({ name: "", email: "", phone: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, customer: any) => {
    e.stopPropagation();
    setEditingCustomer(customer);
    setFormData({ name: customer.name, email: customer.email, phone: customer.phone || "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: any) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer(id);
      fetchCustomers();
    } catch (err) {
      alert("Failed to delete customer.");
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Customers</h1>
          <p className="text-slate-400 font-medium">
            {loading ? "Loading…" : `${customers.length} customer${customers.length !== 1 ? "s" : ""} registered`}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
          onClick={handleOpenCreate}
        >
          <span className="text-xl">+</span> New Customer
        </button>
      </div>

      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <SearchBar
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={(val: string) => setSearch(val)}
          />
        </div>

        {/* Result count */}
        {!loading && !error && filtered.length > 0 && search && (
          <div className="mb-4 text-[13px] text-text-muted">
            Found <strong className="text-text-primary">{filtered.length}</strong> result{filtered.length !== 1 ? "s" : ""} for &quot;{search}&quot;
          </div>
        )}

        {/* States */}
        {loading && <SkeletonRows />}

        {!loading && error && (
          <div className="py-20 flex flex-col items-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center text-3xl mb-6">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Failed to load customers</h3>
            <p className="text-slate-400 leading-relaxed">Make sure the backend server is running on the correct port.</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-32 flex flex-col items-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-4xl mb-6 opacity-50">👥</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {search ? "No results found" : "No customers yet"}
            </h3>
            <p className="text-slate-400 leading-relaxed">
              {search
                ? `No customers matching "${search}".`
                : "Start adding customers from your backend."}
            </p>
          </div>
        )}

        {/* Customer list */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((c, idx) => {
              const color = avatarColors[idx % avatarColors.length];
              return (
                <button
                  key={c.id}
                  id={`customer-${c.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-pointer relative overflow-hidden text-left w-full"
                  onClick={() => router.push(`/customers/${c.id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs tracking-tighter shrink-0 relative z-10"
                    style={{ background: `${color}15`, color }}
                  >
                    {getInitials(c.name)}
                  </div>

                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="text-base font-bold text-white mb-1">{c.name}</div>
                    <div className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      {c.email}
                      {c.phone && <span className="text-slate-600 text-xs">· {c.phone}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 relative z-10">
                    <button
                      onClick={(e) => handleOpenEdit(e, c)}
                      className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, c.id)}
                      className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="hidden sm:block text-slate-600 group-hover:text-blue-400 transition-colors translate-x-1 group-hover:translate-x-2 relative z-10">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? "Edit Customer" : "Create New Customer"}
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
            <input
              type="text"
              className="w-full h-12 bg-slate-900 border border-white/10 rounded-xl px-4 text-white text-sm focus:border-blue-500 outline-none transition-all"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
            <input
              type="email"
              className="w-full h-12 bg-slate-900 border border-white/10 rounded-xl px-4 text-white text-sm focus:border-blue-500 outline-none transition-all"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
            <input
              type="text"
              className="w-full h-12 bg-slate-900 border border-white/10 rounded-xl px-4 text-white text-sm focus:border-blue-500 outline-none transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="080 000 0000"
            />
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
              {submitting ? "Saving..." : editingCustomer ? "Save Changes" : "Create Customer"}
            </button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
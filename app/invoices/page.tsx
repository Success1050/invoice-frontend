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

function getBadgeClass(status: string) {
  if (status === "paid") return "badge-paid";
  if (status === "pending") return "badge-pending";
  if (status === "overdue") return "badge-overdue";
  return "badge-draft";
}

function SkeletonRows() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((k) => (
        <div key={k} className="skeleton skeleton-row" />
      ))}
    </>
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
    return matchSearch && matchStatus;
  });

  const totalAmount = filtered.reduce((s: number, i: any) => s + (Number(i.amount) || 0), 0);

  return (
    <>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="page-subtitle">
            {loading ? "Loading…" : `${invoices.length} invoice${invoices.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          style={{ marginBottom: 4 }}
          onClick={handleOpenCreate}
        >
          <span>+</span> New Invoice
        </button>
      </div>

      <div className="content-section">
        {/* Toolbar */}
        <div className="toolbar">
          <SearchBar
            placeholder="Search by customer, status or ID…"
            value={search}
            onChange={(val: string) => setSearch(val)}
          />
        </div>

        {/* Status filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              className={`filter-chip${statusFilter === s ? " active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && (
                <span style={{ marginLeft: 6, opacity: 0.7 }}>
                  ({invoices.filter((i) => i.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Summary bar */}
        {!loading && !error && filtered.length > 0 && (
          <div
            style={{
              padding: "12px 18px",
              background: "rgba(79,142,247,0.06)",
              border: "1px solid rgba(79,142,247,0.14)",
              borderRadius: 12,
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Showing <strong style={{ color: "var(--text-primary)" }}>{filtered.length}</strong> invoice{filtered.length !== 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-cyan)" }}>
              Total: ₦{totalAmount.toLocaleString()}
            </span>
          </div>
        )}

        {/* States */}
        {loading && <SkeletonRows />}

        {!loading && error && (
          <div className="error-state">
            <span className="error-state-icon">⚠️</span>
            <p className="error-state-title">Failed to load invoices</p>
            <p className="error-state-text">Make sure the backend server is running on the correct port.</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <p className="empty-state-title">
              {search || statusFilter !== "all" ? "No results found" : "No invoices yet"}
            </p>
            <p className="empty-state-text">
              {search ? `No invoices matching "${search}".` : statusFilter !== "all" ? `No ${statusFilter} invoices.` : "Start adding invoices from your backend."}
            </p>
          </div>
        )}

        {/* Invoice list */}
        {!loading && !error && filtered.length > 0 && (
          <div className="data-list">
            {filtered.map((inv, idx) => {
              const color = avatarColors[idx % avatarColors.length];
              const statusClass = getBadgeClass(inv.status);
              return (
                <button
                  key={inv.id}
                  id={`invoice-${inv.id}`}
                  className="data-row"
                  onClick={() => router.push(`/invoices/${inv.id}`)}
                >
                  <div
                    className="avatar"
                    style={{ background: `${color}1a`, color, fontSize: 13, fontWeight: 700 }}
                  >
                    #{inv.id}
                  </div>
                  <div className="row-main">
                    <div className="row-title">
                      Invoice #{inv.id}
                      {inv.description && (
                        <span className="tag" style={{ marginLeft: 8 }}>
                          {inv.description.slice(0, 20)}{inv.description.length > 20 ? "…" : ""}
                        </span>
                      )}
                    </div>
                    <div className="row-subtitle">
                      {inv.customer?.name ?? "Unknown Customer"}
                      {inv.customer?.email && ` • ${inv.customer.email}`}
                    </div>
                  </div>
                  <div className="row-meta">
                    <span className="invoice-amount">
                      ₦{Number(inv.amount).toLocaleString()}
                    </span>
                    <span className={`badge ${statusClass}`}>{inv.status ?? "draft"}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                    <button 
                      onClick={(e) => handleOpenEdit(e, inv)}
                      style={{
                        padding: "6px 10px",
                        background: "rgba(79, 142, 247, 0.1)",
                        color: "var(--accent-blue)",
                        border: "none",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(79, 142, 247, 0.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(79, 142, 247, 0.1)")}
                    >
                      EDIT
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, inv.id)}
                      style={{
                        padding: "6px 10px",
                        background: "rgba(244, 63, 94, 0.1)",
                        color: "#fb7185",
                        border: "none",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(244, 63, 94, 0.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(244, 63, 94, 0.1)")}
                    >
                      DELETE
                    </button>
                  </div>
                  <div style={{ marginLeft: 16 }}>
                    <svg
                      style={{ color: "var(--text-muted)", flexShrink: 0 }}
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
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
        title={editingInvoice ? "Edit Invoice" : "Create New Invoice"}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Customer</label>
            <select
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none"
              }}
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            >
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Amount (₦)</label>
            <input
              type="number"
              className="search-input"
              style={{ paddingLeft: 14 }}
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Status</label>
            <select
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                color: "var(--text-primary)",
                fontSize: 14,
              }}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              {STATUS_FILTERS.filter(s => s !== "all").map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Description</label>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: 14 }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Services rendered"
            />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1 }}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={submitting}
            >
              {submitting ? "Saving..." : editingInvoice ? "Save Changes" : "Create Invoice"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
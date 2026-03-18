"use client";

import { useEffect, useState } from "react";
import { getCustomers, createCustomer, deleteCustomer, updateCustomer } from "../services/api";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";
import SearchBar from "../components/SearchBar";

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
    <>
      {[1, 2, 3, 4, 5].map((k) => (
        <div key={k} className="skeleton skeleton-row" />
      ))}
    </>
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
    <>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">
            {loading ? "Loading…" : `${customers.length} customer${customers.length !== 1 ? "s" : ""} registered`}
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          style={{ marginBottom: 4 }}
          onClick={handleOpenCreate}
        >
          <span>+</span> New Customer
        </button>
      </div>

      <div className="content-section">
        {/* Toolbar */}
        <div className="toolbar">
          <SearchBar
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={(val: string) => setSearch(val)}
          />
        </div>

        {/* Result count */}
        {!loading && !error && filtered.length > 0 && search && (
          <div style={{ marginBottom: 16, fontSize: 13, color: "var(--text-muted)" }}>
            Found <strong style={{ color: "var(--text-primary)" }}>{filtered.length}</strong> result{filtered.length !== 1 ? "s" : ""} for "{search}"
          </div>
        )}

        {/* States */}
        {loading && <SkeletonRows />}

        {!loading && error && (
          <div className="error-state">
            <span className="error-state-icon">⚠️</span>
            <p className="error-state-title">Failed to load customers</p>
            <p className="error-state-text">Make sure the backend server is running on the correct port.</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon">👥</span>
            <p className="empty-state-title">
              {search ? "No results found" : "No customers yet"}
            </p>
            <p className="empty-state-text">
              {search
                ? `No customers matching "${search}".`
                : "Start adding customers from your backend."}
            </p>
          </div>
        )}

        {/* Customer list */}
        {!loading && !error && filtered.length > 0 && (
          <div className="data-list">
            {filtered.map((c, idx) => {
              const color = avatarColors[idx % avatarColors.length];
              return (
                <button
                  key={c.id}
                  id={`customer-${c.id}`}
                  className="data-row"
                  onClick={() => router.push(`/customers/${c.id}`)}
                >
                  <div
                    className="avatar"
                    style={{
                      background: `${color}1a`,
                      color,
                      fontSize: 14,
                    }}
                  >
                    {getInitials(c.name)}
                  </div>
                  <div className="row-main">
                    <div className="row-title">{c.name}</div>
                    <div className="row-subtitle">
                      {c.email}
                      {c.phone && ` • ${c.phone}`}
                    </div>
                  </div>
                  <div className="row-meta" style={{ display: "flex", gap: 8 }}>
                    <button 
                      onClick={(e) => handleOpenEdit(e, c)}
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
                      onClick={(e) => handleDelete(e, c.id)}
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
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Full Name</label>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: 14 }}
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Email Address</label>
            <input
              type="email"
              className="search-input"
              style={{ paddingLeft: 14 }}
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Phone Number</label>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: 14 }}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="080 000 0000"
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
              {submitting ? "Saving..." : editingCustomer ? "Save Changes" : "Create Customer"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
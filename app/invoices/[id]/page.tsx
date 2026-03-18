import { getInvoice } from "@/app/services/api";
import Link from "next/link";

function getBadgeClass(status: string) {
  if (status === "paid") return "badge-paid";
  if (status === "pending") return "badge-pending";
  if (status === "overdue") return "badge-overdue";
  return "badge-draft";
}

export default async function InvoiceDetail({ params }: any) {
  const { id } = await params;
  const invoice = await getInvoice(id);

  if (!invoice) {
    return (
      <div className="detail-container">
        <Link href="/invoices" className="back-btn">
          ← Back to Invoices
        </Link>
        <div
          style={{
            textAlign: "center",
            padding: "80px 32px",
            background: "rgba(244,63,94,0.05)",
            border: "1px solid rgba(244,63,94,0.15)",
            borderRadius: 20,
          }}
        >
          <span style={{ fontSize: 56, display: "block", marginBottom: 20 }}>🔍</span>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#fb7185",
              marginBottom: 8,
            }}
          >
            Invoice Not Found
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            No invoice with ID <strong style={{ color: "var(--text-primary)" }}>{id}</strong> was found.
          </p>
        </div>
      </div>
    );
  }

  const statusClass = getBadgeClass(invoice.status);
  const amount = Number(invoice.amount) || 0;

  return (
    <div className="detail-container">
      {/* Back button */}
      <Link href="/invoices" className="back-btn">
        ← Back to Invoices
      </Link>

      {/* Hero card */}
      <div className="detail-hero">
        <div className="detail-hero-header">
          <div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
              Invoice
            </p>
            <h1 className="detail-title">#{invoice.id}</h1>
            {invoice.description && (
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
                {invoice.description}
              </p>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <span className={`badge ${statusClass}`} style={{ fontSize: 13, padding: "6px 14px" }}>
              {invoice.status ?? "draft"}
            </span>
          </div>
        </div>

        {/* Big amount */}
        <div
          style={{
            padding: "24px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 14,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Invoice Amount
          </p>
          <p
            style={{
              fontSize: 48,
              fontWeight: 800,
              background: "linear-gradient(135deg, #34d399, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.1,
            }}
          >
            ₦{amount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Invoice details */}
      <div className="detail-card">
        <p className="detail-card-title">Invoice Details</p>
        <div>
          <div className="detail-row">
            <span className="detail-label">Invoice ID</span>
            <span className="detail-value">#{invoice.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className={`badge ${statusClass}`}>{invoice.status ?? "draft"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Amount</span>
            <span className="detail-value" style={{ color: "#34d399", fontWeight: 700 }}>
              ₦{amount.toLocaleString()}
            </span>
          </div>
          {invoice.description && (
            <div className="detail-row">
              <span className="detail-label">Description</span>
              <span className="detail-value" style={{ maxWidth: 260, textAlign: "right" }}>
                {invoice.description}
              </span>
            </div>
          )}
          {invoice.createdAt && (
            <div className="detail-row">
              <span className="detail-label">Created</span>
              <span className="detail-value">
                {new Date(invoice.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Customer details */}
      {invoice.customer && (
        <div className="detail-card">
          <p className="detail-card-title">Customer</p>
          <div>
            {/* Avatar row */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "rgba(124,107,240,0.15)",
                  color: "#a78bfa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {invoice.customer.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) ?? "?"}
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 16 }}>
                  {invoice.customer.name}
                </p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {invoice.customer.email}
                </p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Link
                  href={`/customers/${invoice.customer.id}`}
                  style={{
                    fontSize: 12,
                    color: "var(--accent-blue)",
                    textDecoration: "none",
                    fontWeight: 500,
                    padding: "6px 12px",
                    border: "1px solid rgba(79,142,247,0.25)",
                    borderRadius: 8,
                  }}
                >
                  View Profile →
                </Link>
              </div>
            </div>

            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{invoice.customer.email}</span>
            </div>
            {invoice.customer.phone && (
              <div className="detail-row">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{invoice.customer.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
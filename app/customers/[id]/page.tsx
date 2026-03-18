import { getCustomer, getInvoices } from "@/app/services/api";
import Link from "next/link";

function getBadgeClass(status: string) {
  if (status === "paid") return "badge-paid";
  if (status === "pending") return "badge-pending";
  if (status === "overdue") return "badge-overdue";
  return "badge-draft";
}

function getInitials(name: string) {
  return (name ?? "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = ["#4f8ef7", "#7c6bf0", "#22d3ee", "#10b981", "#f59e0b", "#f43f5e"];

export default async function CustomerDetail({ params }: any) {
  const { id } = await params;
  const customer = await getCustomer(id);

  // Fetch all invoices and filter for this customer
  let customerInvoices: any[] = [];
  try {
    const allInvoices = await getInvoices();
    customerInvoices = Array.isArray(allInvoices)
      ? allInvoices.filter((inv: any) => String(inv.customer?.id) === String(id))
      : [];
  } catch (_) {}

  if (!customer) {
    return (
      <div className="detail-container">
        <Link href="/customers" className="back-btn">
          ← Back to Customers
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
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fb7185", marginBottom: 8 }}>
            Customer Not Found
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            No customer with ID{" "}
            <strong style={{ color: "var(--text-primary)" }}>{id}</strong> was found.
          </p>
        </div>
      </div>
    );
  }

  const totalSpend = customerInvoices.reduce((s: number, i: any) => s + (Number(i.amount) || 0), 0);
  const paidInvoices = customerInvoices.filter((i: any) => i.status === "paid");
  const colorIdx = Number(id) % avatarColors.length;
  const avatarColor = avatarColors[colorIdx] ?? "#4f8ef7";

  return (
    <div className="detail-container">
      {/* Back */}
      <Link href="/customers" className="back-btn">
        ← Back to Customers
      </Link>

      {/* Hero */}
      <div className="detail-hero">
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          {/* Big avatar */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: `${avatarColor}20`,
              color: avatarColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 800,
              flexShrink: 0,
              border: `2px solid ${avatarColor}30`,
            }}
          >
            {getInitials(customer.name)}
          </div>
          <div style={{ flex: 1 }}>
            <h1 className="detail-title" style={{ marginBottom: 2 }}>
              {customer.name}
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{customer.email}</p>
            {customer.phone && (
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                📞 {customer.phone}
              </p>
            )}
          </div>
          <span
            style={{
              padding: "6px 14px",
              background: `${avatarColor}15`,
              color: avatarColor,
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Customer
          </span>
        </div>

        {/* Mini stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginTop: 24,
          }}
        >
          {[
            { label: "Total Invoices", value: customerInvoices.length },
            { label: "Paid Invoices", value: paidInvoices.length },
            {
              label: "Total Value",
              value: `₦${totalSpend.toLocaleString()}`,
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: "16px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 4,
                }}
              >
                {s.value}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact info */}
      <div className="detail-card">
        <p className="detail-card-title">Contact Information</p>
        <div className="detail-row">
          <span className="detail-label">Full Name</span>
          <span className="detail-value">{customer.name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email</span>
          <a
            href={`mailto:${customer.email}`}
            style={{ color: "var(--accent-blue)", fontWeight: 500, fontSize: 14, textDecoration: "none" }}
          >
            {customer.email}
          </a>
        </div>
        {customer.phone && (
          <div className="detail-row">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{customer.phone}</span>
          </div>
        )}
        <div className="detail-row">
          <span className="detail-label">Customer ID</span>
          <span className="detail-value" style={{ color: "var(--text-muted)", fontFamily: "monospace", fontSize: 13 }}>
            #{customer.id}
          </span>
        </div>
      </div>

      {/* Customer Invoices */}
      {customerInvoices.length > 0 && (
        <div className="detail-card">
          <p className="detail-card-title">Invoices ({customerInvoices.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {customerInvoices.map((inv: any, idx: number) => {
              const color = avatarColors[idx % avatarColors.length];
              const statusClass = getBadgeClass(inv.status);
              return (
                <Link
                  key={inv.id}
                  href={`/invoices/${inv.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="data-row" style={{ padding: "12px 16px" }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: `${color}18`,
                        color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      #{inv.id}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                        Invoice #{inv.id}
                      </p>
                      {inv.description && (
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{inv.description}</p>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #34d399, #22d3ee)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      ₦{Number(inv.amount).toLocaleString()}
                    </span>
                    <span className={`badge ${statusClass}`}>{inv.status}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {customerInvoices.length === 0 && (
        <div className="detail-card">
          <p className="detail-card-title">Invoices</p>
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <span style={{ fontSize: 36, display: "block", marginBottom: 12 }}>📋</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              No invoices linked to this customer yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
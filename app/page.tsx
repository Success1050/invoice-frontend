import Link from "next/link";

const features = [
  {
    icon: "📄",
    title: "Smart Invoicing",
    desc: "Create, track and manage invoices with real-time status updates. Never lose track of payments again.",
  },
  {
    icon: "👥",
    title: "Customer Management",
    desc: "Maintain a rich customer database with full contact details, history, and invoice associations.",
  },
  {
    icon: "🔍",
    title: "Instant Search",
    desc: "Find any invoice or customer instantly with powerful real-time search and advanced filters.",
  },
  {
    icon: "📊",
    title: "Dashboard Analytics",
    desc: "Get a birds-eye view of your business with key stats, totals, and status breakdowns.",
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    desc: "Built on Next.js 16 for blazing fast navigation, server-side rendering, and optimal performance.",
  },
  {
    icon: "🔒",
    title: "Reliable API",
    desc: "Powered by a robust NestJS backend with structured CRUD endpoints for invoices and customers.",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Background glows */}
      <div className="landing-glow-1" />
      <div className="landing-glow-2" />
      <div className="landing-glow-3" />

      {/* Navigation */}
      <nav className="landing-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="logo-icon">I</div>
          <span className="logo-text" style={{ fontSize: 20 }}>InvoiceFlow</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/dashboard" className="landing-btn-secondary" style={{ padding: "9px 20px", fontSize: 14 }}>
            Dashboard
          </Link>
          <Link href="/invoices" className="landing-btn-secondary" style={{ padding: "9px 20px", fontSize: 14 }}>
            Invoices
          </Link>
          <Link href="/customers" className="landing-btn-secondary" style={{ padding: "9px 20px", fontSize: 14 }}>
            Customers
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-badge">
          <span>✦</span>
          Modern Invoice Management Platform
        </div>

        <h1 className="landing-headline">
          Manage Invoices &amp;<br />
          <span className="gradient-text">Customers with Ease</span>
        </h1>

        <p className="landing-desc">
          A beautifully crafted platform for tracking invoices, managing customers,
          and keeping your business finances organized — all in one place.
        </p>

        <div className="landing-actions">
          <Link href="/dashboard" className="landing-btn-primary">
            <span>⊞</span>
            Go to Dashboard
          </Link>
          <Link href="/invoices" className="landing-btn-secondary">
            <span>📄</span>
            View Invoices
          </Link>
          <Link href="/customers" className="landing-btn-secondary">
            <span>👥</span>
            View Customers
          </Link>
        </div>

        {/* Mini preview cards */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          {[
            { label: "Total Invoices", value: "Active", color: "#4f8ef7" },
            { label: "Status", value: "Paid / Pending", color: "#10b981" },
            { label: "Customers", value: "All Tracked", color: "#7c6bf0" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "16px 24px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                textAlign: "center",
                minWidth: 140,
                backdropFilter: "blur(20px)",
              }}
            >
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: item.color,
                  marginBottom: 4,
                }}
              >
                {item.value}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <div className="features-grid">
        {features.map((f) => (
          <div className="feature-card" key={f.title}>
            <span className="feature-icon">{f.icon}</span>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA strip */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "0 32px 80px",
        }}
      >
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "40px",
            background: "rgba(79,142,247,0.08)",
            border: "1px solid rgba(79,142,247,0.2)",
            borderRadius: 24,
          }}
        >
          <h2
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 12,
            }}
          >
            Ready to get started?
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              marginBottom: 28,
              lineHeight: 1.6,
            }}
          >
            Jump into your dashboard and start managing invoices and customers today.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="landing-btn-primary">
              Open Dashboard ↗
            </Link>
            <Link href="/invoices" className="landing-btn-secondary">
              Invoices
            </Link>
            <Link href="/customers" className="landing-btn-secondary">
              Customers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
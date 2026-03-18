type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: "paid" | "pending" | "overdue" | "draft";
  amount?: string;
  avatarText?: string;
  avatarColor?: string;
  onClick?: () => void;
};

export default function Card({
  title,
  subtitle,
  badge,
  badgeVariant = "draft",
  amount,
  avatarText,
  avatarColor = "#4f8ef7",
  onClick,
}: Props) {
  return (
    <button className="data-row" onClick={onClick}>
      {avatarText && (
        <div
          className="avatar"
          style={{
            background: `${avatarColor}1a`,
            color: avatarColor,
            fontSize: 14,
          }}
        >
          {avatarText}
        </div>
      )}
      <div className="row-main">
        <div className="row-title">{title}</div>
        {subtitle && <div className="row-subtitle">{subtitle}</div>}
      </div>
      <div className="row-meta">
        {amount && <span className="invoice-amount">{amount}</span>}
        {badge && <span className={`badge badge-${badgeVariant}`}>{badge}</span>}
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
}
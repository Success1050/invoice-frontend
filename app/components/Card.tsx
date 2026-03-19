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

const badgeClasses: Record<string, string> = {
  paid: "bg-emerald-500/15 text-emerald-400",
  pending: "bg-amber-500/15 text-amber-400",
  overdue: "bg-rose-500/15 text-rose-400",
  draft: "bg-slate-500/15 text-slate-400",
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
    <button
      className="flex items-center gap-4 px-5 py-4 w-full text-left bg-bg-card border border-border-subtle rounded-[14px] cursor-pointer transition-all duration-250 hover:bg-bg-card-hover hover:border-accent-blue/25 hover:translate-x-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3),-4px_0_0_rgba(79,142,247,0.5)] text-inherit no-underline"
      onClick={onClick}
    >
      {avatarText && (
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
          style={{
            background: `${avatarColor}1a`,
            color: avatarColor,
          }}
        >
          {avatarText}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold text-text-primary mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{title}</div>
        {subtitle && <div className="text-[13px] text-text-secondary">{subtitle}</div>}
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        {amount && <span className="gradient-text-amount text-[17px] font-bold">{amount}</span>}
        {badge && (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${badgeClasses[badgeVariant] || badgeClasses.draft}`}>
            <span className="w-[5px] h-[5px] rounded-full bg-current" />
            {badge}
          </span>
        )}
      </div>
      <svg
        className="text-text-muted shrink-0"
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
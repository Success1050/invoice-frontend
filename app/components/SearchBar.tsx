"use client";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  id?: string;
};

export default function SearchBar({ value, onChange, placeholder = "Search…", id }: Props) {
  return (
    <div className="relative mb-5 w-full">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted flex pointer-events-none">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </span>
      <input
        id={id}
        className="w-full py-3 pl-[42px] pr-3.5 bg-bg-card border border-border-subtle rounded-xl text-text-primary text-sm font-[inherit] outline-none transition-all duration-200 placeholder:text-text-muted focus:border-accent-blue/50 focus:bg-bg-card-hover focus:ring-[3px] focus:ring-accent-blue/10"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
"use client";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  id?: string;
};

export default function SearchBar({ value, onChange, placeholder = "Search…", id }: Props) {
  return (
    <div className="search-wrapper" style={{ marginBottom: 20 }}>
      <span className="search-icon">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </span>
      <input
        id={id}
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
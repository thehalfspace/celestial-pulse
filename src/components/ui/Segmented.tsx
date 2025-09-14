import React from 'react';

interface SegmentedProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function Segmented({ value, onChange, options }: SegmentedProps) {
  return (
    <div className="inline-flex rounded-xl overflow-hidden border border-white/10">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1 text-sm ${
            value === o.value
              ? "bg-emerald-500 text-black"
              : "bg-white/10 text-slate-200 hover:bg-white/20"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
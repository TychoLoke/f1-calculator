import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number | React.ReactNode;
  helper?: string;
}

export function KpiCard({ title, value, helper }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4 shadow-xl shadow-black/20">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
      {helper && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
    </div>
  );
}

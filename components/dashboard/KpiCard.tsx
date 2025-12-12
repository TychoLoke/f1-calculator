import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number | React.ReactNode;
  helper?: string;
}

export function KpiCard({ title, value, helper }: KpiCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 shadow-2xl shadow-black/30 ring-1 ring-white/10"> 
      <div className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rotate-12 rounded-full bg-sky-500/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -left-10 -bottom-14 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl" aria-hidden />
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <div className="mt-2 text-3xl font-semibold text-white drop-shadow-sm">{value}</div>
      {helper && <p className="mt-2 text-xs text-slate-300/80">{helper}</p>}
    </div>
  );
}

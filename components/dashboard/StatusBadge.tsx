import React from 'react';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-100 border-emerald-400/40 shadow-[0_0_0_1px_rgba(52,211,153,0.25)]',
  inactive: 'bg-amber-500/10 text-amber-100 border-amber-400/40 shadow-[0_0_0_1px_rgba(251,191,36,0.25)]',
  unknown: 'bg-slate-500/10 text-slate-100 border-slate-400/40 shadow-[0_0_0_1px_rgba(148,163,184,0.35)]',
  failed: 'bg-rose-500/10 text-rose-100 border-rose-400/40 shadow-[0_0_0_1px_rgba(248,113,113,0.25)]',
  terminated: 'bg-rose-500/10 text-rose-100 border-rose-400/40 shadow-[0_0_0_1px_rgba(248,113,113,0.25)]',
  success: 'bg-emerald-500/10 text-emerald-100 border-emerald-400/40 shadow-[0_0_0_1px_rgba(52,211,153,0.25)]',
  running: 'bg-sky-500/10 text-sky-100 border-sky-400/40 shadow-[0_0_0_1px_rgba(56,189,248,0.25)]',
};

interface StatusBadgeProps {
  status: string;
  children?: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const normalized = status?.toLowerCase?.() ?? 'unknown';
  const styles = STATUS_STYLES[normalized] ?? STATUS_STYLES.unknown;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${styles}`}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-current shadow-[0_0_0_4px_rgba(255,255,255,0.04)]" aria-hidden />
      {children ?? status}
    </span>
  );
}

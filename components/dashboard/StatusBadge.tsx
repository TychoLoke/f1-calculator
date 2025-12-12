import React from 'react';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30',
  inactive: 'bg-amber-500/10 text-amber-200 border-amber-500/30',
  unknown: 'bg-slate-500/10 text-slate-200 border-slate-500/30',
  failed: 'bg-rose-500/10 text-rose-200 border-rose-500/30',
  success: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30',
  running: 'bg-sky-500/10 text-sky-200 border-sky-500/30',
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
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide ${styles}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden />
      {children ?? status}
    </span>
  );
}

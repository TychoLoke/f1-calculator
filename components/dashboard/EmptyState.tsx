import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-center shadow-xl shadow-black/20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-700/10 via-transparent to-slate-900/40" aria-hidden />
      <div className="relative space-y-2 text-sm text-slate-300">
        <p className="text-base font-semibold text-white">{title}</p>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>
    </div>
  );
}

import React from 'react';
import { StatusBadge } from './StatusBadge';

interface ProductTileProps {
  name: string;
  status: string;
}

export function ProductTile({ name, status }: ProductTileProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/30 ring-1 ring-white/10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-purple-500/10" aria-hidden />
      <div className="relative flex flex-col gap-3">
        <div className="text-sm font-semibold text-white">{name}</div>
        <StatusBadge status={status}>{status}</StatusBadge>
      </div>
    </div>
  );
}

import React from 'react';
import { StatusBadge } from './StatusBadge';

interface ProductTileProps {
  name: string;
  status: string;
}

export function ProductTile({ name, status }: ProductTileProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 shadow-xl shadow-black/20">
      <div className="text-sm font-semibold text-white">{name}</div>
      <StatusBadge status={status}>{status}</StatusBadge>
    </div>
  );
}

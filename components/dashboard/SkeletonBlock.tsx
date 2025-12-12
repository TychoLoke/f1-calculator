import React from 'react';

interface SkeletonBlockProps {
  className?: string;
}

export function SkeletonBlock({ className }: SkeletonBlockProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white/10 ${className ?? ''}`}>
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5" aria-hidden />
    </div>
  );
}

import React from 'react';

interface SkeletonBlockProps {
  className?: string;
}

export function SkeletonBlock({ className }: SkeletonBlockProps) {
  return <div className={`animate-pulse rounded-xl bg-white/10 ${className ?? ''}`} />;
}

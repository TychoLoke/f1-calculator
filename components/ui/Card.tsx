import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/5 bg-[#0a1222]/85 shadow-[0_30px_80px_-60px_rgba(0,0,0,1)] ring-1 ring-white/5 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

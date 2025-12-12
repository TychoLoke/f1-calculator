import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  accent?: boolean;
}

export function Card({ title, subtitle, action, children, accent }: CardProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-white/10 ${
        accent ? 'bg-gradient-to-br from-white/10 via-white/5 to-white/0 ring-1 ring-white/15' : 'bg-white/5'
      } p-5 shadow-2xl shadow-black/30 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          {title && <h2 className="text-sm font-semibold text-white">{title}</h2>}
          {subtitle && <p className="text-xs text-slate-300">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4 space-y-3 text-sm text-slate-100/90">{children}</div>
    </section>
  );
}

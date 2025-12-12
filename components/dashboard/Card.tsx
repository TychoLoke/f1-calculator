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
      className={`group relative overflow-hidden rounded-3xl border ${
        accent
          ? 'border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/0 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)] ring-1 ring-white/20'
          : 'border-white/10 bg-white/5 shadow-[0_12px_45px_-32px_rgba(0,0,0,0.9)]'
      } p-5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/40`}
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden>
        <div className="absolute inset-[-40%] bg-[radial-gradient(circle_at_top,_rgba(91,139,255,0.16),_transparent_45%)]" />
        <div className="absolute inset-[-40%] bg-[radial-gradient(circle_at_bottom,_rgba(255,95,109,0.16),_transparent_45%)]" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-1">
          {title && <h2 className="text-sm font-semibold leading-5 text-white">{title}</h2>}
          {subtitle && <p className="text-xs leading-relaxed text-slate-300">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="relative mt-4 space-y-3 text-sm text-slate-100/90">{children}</div>
    </section>
  );
}

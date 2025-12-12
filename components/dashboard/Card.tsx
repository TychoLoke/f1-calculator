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
      className={`group relative overflow-hidden rounded-2xl border ${
        accent
          ? 'border-white/15 bg-[#0c1220] shadow-[0_18px_45px_-32px_rgba(0,0,0,0.9)]'
          : 'border-white/10 bg-[#0b101d] shadow-[0_14px_40px_-30px_rgba(0,0,0,0.9)]'
      } p-5 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/30`}
    >
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

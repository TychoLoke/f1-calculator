import type { ReactNode } from 'react';
import { Card } from '../ui/Card';

interface PanelProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function Panel({ title, subtitle, actions, children }: PanelProps) {
  return (
    <Card>
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-white">{title}</p>
            {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 text-xs text-slate-300">{actions}</div>}
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#0f192f] p-4 shadow-inner shadow-black/30">{children}</div>
      </div>
    </Card>
  );
}

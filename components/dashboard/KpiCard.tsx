import type { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

interface KpiCardProps {
  title: string;
  value: string | number;
  helper?: string;
  icon: LucideIcon;
  footer?: string;
}

export function KpiCard({ title, value, helper, icon: Icon, footer }: KpiCardProps) {
  return (
    <Card className="h-full bg-[#0c1629]">
      <div className="flex h-full flex-col justify-between gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
            <p className="text-3xl font-semibold text-white sm:text-4xl">{value}</p>
            {helper && <p className="text-sm text-slate-400">{helper}</p>}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#101b34] ring-1 ring-white/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#ff5f6d] via-[#7c3aed] to-[#5b8bff] text-white shadow-[0_20px_40px_-26px_rgba(91,139,255,0.9)]">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
        {footer && <p className="text-xs text-slate-500">{footer}</p>}
      </div>
    </Card>
  );
}

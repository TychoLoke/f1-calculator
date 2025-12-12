'use client';

import type { TooltipProps } from 'recharts';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card } from '../ui/Card';

type JobHealthDatum = {
  status: string;
  count: number;
};

interface JobHealthChartProps {
  data: JobHealthDatum[];
}

const STATUS_COLORS: Record<string, string> = {
  Succeeded: '#8de4af',
  Warning: '#f5d278',
  Failed: '#f49ca8',
  Running: '#8dd5f5',
  Pending: '#d6c3ff',
  Ready: '#cbd5e1',
};

function JobHealthTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length || label == null) return null;

  const item = payload[0];

  return (
    <div className="rounded-xl border border-white/10 bg-[#0b1223] px-4 py-3 shadow-xl shadow-black/30">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-4 text-sm text-slate-200">
        <span className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: STATUS_COLORS[label] ?? '#7dd3fc' }}
          />
          Jobs
        </span>
        <span className="font-semibold text-slate-50">{Number(item.value).toLocaleString()}</span>
      </div>
    </div>
  );
}

export function JobHealthChart({ data }: JobHealthChartProps) {
  const totalJobs = data.reduce((sum, item) => sum + item.count, 0);
  const healthyCount = data.find((item) => item.status === 'Succeeded')?.count ?? 0;
  const failureCount = data.find((item) => item.status === 'Failed')?.count ?? 0;

  return (
    <Card className="h-full bg-gradient-to-b from-[#0d152c] via-[#0b1223] to-[#0a0f1b]">
      <div className="flex flex-col h-full">
        <header className="flex flex-col gap-3 border-b border-white/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-300">Job health summary</p>
            <h3 className="text-xl font-semibold text-white">Latest run distribution</h3>
            <p className="text-sm text-slate-400">Balanced colors, softened gridlines, and tooltips that echo premium admin dashboards.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="rounded-full bg-white/5 px-3 py-1">{totalJobs.toLocaleString()} jobs</span>
            <span className="rounded-full bg-white/5 px-3 py-1">{healthyCount.toLocaleString()} healthy</span>
            <span className="rounded-full bg-white/5 px-3 py-1">{failureCount.toLocaleString()} failing</span>
          </div>
        </header>

        <div className="flex-1 px-4 pb-6 pt-5 sm:px-6">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
              <span key={status} className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-slate-200">{status}</span>
              </span>
            ))}
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer>
              <BarChart data={data} barSize={26} margin={{ top: 10, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="status" tickLine={false} axisLine={false} tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 500 }} />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<JobHealthTooltip />} />
                <defs>
                  <linearGradient id="jobHealthGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9de2ff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Bar dataKey="count" radius={[10, 10, 10, 10]} background={{ fill: 'rgba(255,255,255,0.02)', radius: 10 }}>
                  {data.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] ?? 'url(#jobHealthGlow)'}
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth={0.5}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}

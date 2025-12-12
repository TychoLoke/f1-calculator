'use client';

import type { TooltipProps } from 'recharts';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card } from '../ui/Card';

type CoverageDatum = {
  module: string;
  scanned: number;
  protected: number;
};

interface BackupCoverageChartProps {
  data: CoverageDatum[];
}

type BackupCoverageTooltipProps = Partial<TooltipProps<number, string | number>> & {
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: string | number;
  active?: boolean;
};

function BackupCoverageTooltip({ active, payload, label }: BackupCoverageTooltipProps) {
  if (!active || !payload?.length || label == null) return null;

  const scanned = payload.find((item) => item.dataKey === 'scanned');
  const protectedItem = payload.find((item) => item.dataKey === 'protected');

  return (
    <div className="rounded-xl border border-white/10 bg-[#0b1223] px-4 py-3 shadow-xl shadow-black/30">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-2 space-y-1 text-sm text-slate-50">
        {scanned && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-[#7dd3fc]" /> Scanned
            </span>
            <span className="font-semibold text-slate-100">{Number(scanned.value).toLocaleString()}</span>
          </div>
        )}
        {protectedItem && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-[#c7b9ff]" /> Protected
            </span>
            <span className="font-semibold text-slate-100">{Number(protectedItem.value).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function BackupCoverageChart({ data }: BackupCoverageChartProps) {
  const totalModules = data.length;
  const totalProtected = data.reduce((sum, item) => sum + item.protected, 0);
  const totalScanned = data.reduce((sum, item) => sum + item.scanned, 0);

  return (
    <Card className="h-full bg-gradient-to-b from-[#0c1428] via-[#0a1120] to-[#0a0f1a]">
      <div className="flex flex-col h-full">
        <header className="flex flex-col gap-3 border-b border-white/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-300">Backup coverage</p>
            <h3 className="text-xl font-semibold text-white">Scanned vs protected</h3>
            <p className="text-sm text-slate-400">Soft contrast bars with muted gridlines for a Darken-inspired view.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="rounded-full bg-white/5 px-3 py-1">{totalModules} modules</span>
            <span className="rounded-full bg-white/5 px-3 py-1">{totalScanned.toLocaleString()} scanned</span>
            <span className="rounded-full bg-white/5 px-3 py-1">{totalProtected.toLocaleString()} protected</span>
          </div>
        </header>

        <div className="flex-1 px-4 pb-6 pt-5 sm:px-6">
          <div className="mb-4 flex items-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#7dd3fc] shadow-[0_0_0_4px_rgba(125,211,252,0.15)]" />
              <span className="text-slate-200">Scanned</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#c7b9ff] shadow-[0_0_0_4px_rgba(199,185,255,0.18)]" />
              <span className="text-slate-200">Protected</span>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer>
              <BarChart data={data} barSize={18} margin={{ top: 10, right: 10, left: 0, bottom: 8 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.14)" strokeDasharray="3 6" vertical={false} />
                <XAxis
                  dataKey="module"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  tickFormatter={(value) => Math.round(value).toLocaleString()}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  content={(props: TooltipProps<number, string | number>) => (
                    <BackupCoverageTooltip {...props} />
                  )}
                />
                <defs>
                  <linearGradient id="coverageScanned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="coverageProtected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d9d6ff" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <Bar dataKey="scanned" stackId="coverage" name="Scanned" fill="url(#coverageScanned)" radius={[10, 10, 10, 10]} />
                <Bar
                  dataKey="protected"
                  stackId="coverage"
                  name="Protected"
                  fill="url(#coverageProtected)"
                  radius={[10, 10, 10, 10]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}

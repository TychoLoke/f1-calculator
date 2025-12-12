import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export type CustomerRow = {
  id: string;
  organization: string;
  tenants: number;
  region: string;
  backupEnabled: boolean;
  protectedObjects: number | null | undefined;
  jobHealth: string;
};

interface CustomerTableProps {
  rows: CustomerRow[];
  errors?: string[];
}

function formatNumber(value: number | null | undefined) {
  if (value == null) return '—';
  return value.toLocaleString();
}

export function CustomerTable({ rows, errors = [] }: CustomerTableProps) {
  return (
    <div className="space-y-4">
      {errors.length > 0 && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold">Fixture warnings</p>
          <ul className="list-disc space-y-1 pl-5">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {rows.length === 0 ? (
        <p className="text-sm text-slate-300">No customers are available.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-950/50 shadow-2xl ring-1 ring-white/10">
          <div className="grid grid-cols-12 items-center gap-4 border-b border-white/5 bg-white/5 px-6 py-4 text-xs font-medium text-slate-300">
            <span className="col-span-4 sm:col-span-5">Customer name</span>
            <span className="col-span-2">Tenants</span>
            <span className="col-span-2">Backup status</span>
            <span className="col-span-2">Protected objects</span>
            <span className="col-span-2 text-right sm:text-left">Job health</span>
          </div>
          <div className="divide-y divide-white/5 text-sm">
            {rows.map((row) => (
              <Link
                key={row.id}
                href={`/customers/${row.id}`}
                className="grid grid-cols-12 items-center gap-4 px-6 py-4 transition duration-150 hover:bg-white/5"
              >
                <div className="col-span-4 sm:col-span-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-semibold uppercase text-white">
                      {row.organization
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join('') || 'CU'}
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-white">{row.organization}</p>
                      <p className="text-xs text-slate-400">{row.region}</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-col text-white">
                    <span className="text-base font-semibold leading-none">{row.tenants.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">Tenants</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium leading-none ${
                      row.backupEnabled
                        ? 'bg-emerald-500/10 text-emerald-100 ring-1 ring-emerald-400/40'
                        : 'bg-slate-700/40 text-slate-200 ring-1 ring-slate-500/40'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {row.backupEnabled ? 'Backup enabled' : 'Backup disabled'}
                  </span>
                </div>

                <div className="col-span-2 text-white">
                  <span className="text-base font-semibold leading-none">{formatNumber(row.protectedObjects)}</span>
                  <p className="text-xs text-slate-400">Protected objects</p>
                </div>

                <div className="col-span-2 flex items-center justify-between gap-3 text-slate-200">
                  <StatusBadge status={row.jobHealth}>{row.jobHealth}</StatusBadge>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import Link from 'next/link';
import { fetchCustomers } from '../../../lib/data-service';
import { Card } from '../../../components/dashboard/Card';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const { items, total } = await fetchCustomers();
  const gradientText = 'bg-gradient-to-r from-[#ff5f6d] via-[#5b8bff] to-[#7c3aed] bg-clip-text text-transparent';

  const statusTone = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized.includes('active') || normalized.includes('ready')) {
      return 'bg-emerald-500/15 text-emerald-200 border-emerald-400/40 shadow-emerald-500/20';
    }
    if (normalized.includes('warning') || normalized.includes('pending')) {
      return 'bg-amber-500/15 text-amber-100 border-amber-400/40 shadow-amber-500/20';
    }
    if (normalized.includes('error') || normalized.includes('fail') || normalized.includes('off')) {
      return 'bg-rose-500/15 text-rose-100 border-rose-400/40 shadow-rose-500/20';
    }
    return 'bg-white/10 text-white border-white/20 shadow-white/10';
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-8 shadow-2xl shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className={`text-xs font-semibold uppercase tracking-[0.32em] text-slate-300 ${gradientText}`}>AvePoint Elements</p>
            <h1 className="text-3xl font-bold text-white">Customers</h1>
            <p className="max-w-3xl text-sm text-slate-300">
              Rich customer cards keep the essentials visible—region, owner contact, and live status—so your team can move from
              scanning to action without guessing.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Total tenants</p>
              <p className="text-2xl font-semibold text-white">{total}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#ff5f6d]/20 via-[#5b8bff]/20 to-[#7c3aed]/20 px-4 py-3 text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">Live view</p>
              <p className="text-sm font-medium text-white">Status, owner, and region always filled</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((customer, index) => {
          const name = customer.name?.trim() || `Customer ${index + 1}`;
          const owner = customer.ownerEmail?.trim() || 'Owner not set';
          const region = customer.region?.trim() || 'Region not provided';
          const status = customer.status?.trim() || 'Unknown';
          const initials = name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join('') || 'CU';

          return (
            <Card
              key={customer.id}
              title={name}
              subtitle={`${region} • ${owner}`}
              accent
              action={
                <Link
                  href={`/customers/${customer.id}`}
                  className="rounded-lg bg-gradient-to-r from-[#ff5f6d] via-[#5b8bff] to-[#7c3aed] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-black/30 transition hover:shadow-black/40"
                >
                  Open
                </Link>
              }
            >
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5b8bff]/30 via-[#7c3aed]/30 to-[#ff5f6d]/30 text-sm font-semibold uppercase text-white ring-1 ring-white/20">
                    {initials}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Customer</p>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-slate-300">{owner}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold shadow-sm ${statusTone(status)}`}>
                  <span className="h-2 w-2 rounded-full bg-current opacity-70" aria-hidden />
                  {status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-200">
                <div className="space-y-1 rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Region</p>
                  <p className="text-sm font-semibold text-white">{region}</p>
                </div>
                <div className="space-y-1 rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Owner</p>
                  <p className="text-sm font-semibold text-white">{owner}</p>
                </div>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-[#ff5f6d] via-[#5b8bff] to-[#7c3aed]"
                  aria-hidden
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

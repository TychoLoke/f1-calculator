import Link from 'next/link';
import { fetchCustomers } from '../../../lib/data-service';
import { Card } from '../../../components/dashboard/Card';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const { items, total } = await fetchCustomers();
  const gradientText = 'bg-gradient-to-r from-[#ff5f6d] via-[#5b8bff] to-[#7c3aed] bg-clip-text text-transparent';

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-3">
        <p className={`text-xs font-semibold uppercase tracking-[0.32em] text-slate-300 ${gradientText}`}>AvePoint Elements</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">Customers</h1>
            <p className="text-sm text-slate-400">Manage every tenant with unified visibility and MSP-grade controls.</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            {total} customers
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((customer) => (
          <Card
            key={customer.id}
            title={customer.name}
            subtitle={`${customer.region} • ${customer.ownerEmail}`}
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
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Status</span>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-white">{customer.status}</span>
            </div>
            <div className="h-1 w-full rounded-full bg-white/5">
              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#ff5f6d] via-[#5b8bff] to-[#7c3aed]" aria-hidden />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

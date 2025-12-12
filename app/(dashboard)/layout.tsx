'use client';

import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react';

const navItems = [
  { label: 'Overview', href: (id: string) => `/customers/${id}` },
  { label: 'Services', href: (id: string) => `/customers/${id}#services` },
  { label: 'Tenants', href: (id: string) => `/customers/${id}#tenants` },
  { label: 'Backup', href: (id: string) => `/customers/${id}#backup` },
  { label: 'Baselines', href: (id: string) => `/customers/${id}#baselines` },
  { label: 'Scans', href: (id: string) => `/customers/${id}#scans` },
  { label: 'Risk', href: (id: string) => `/customers/${id}#risk` },
  { label: 'Jobs', href: (id: string) => `/customers/${id}#jobs` },
];

function getCustomerIdFromParams(params: Record<string, string | string[] | undefined>) {
  const id = params.customerId;
  if (Array.isArray(id)) return id[0];
  return id ?? 'MockMSP';
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const params = useParams<Record<string, string>>();
  const pathname = usePathname();
  const router = useRouter();
  const customerId = getCustomerIdFromParams(params ?? {});
  const [customers, setCustomers] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/customers', { cache: 'no-store' });
        if (!response.ok) throw new Error('Unable to load customers');
        const payload = (await response.json()) as { items?: Array<{ customerId?: string; customerName?: string; name?: string }> };
        const mapped = (payload.items ?? []).map((item, index) => ({
          id: item.customerId ?? item.name ?? `customer-${index + 1}`,
          name: item.customerName ?? item.name ?? item.customerId ?? `Customer ${index + 1}`,
        }));
        setCustomers(mapped);
      } catch (error) {
        console.error('Failed to load customers list', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const customerOptions = useMemo(() => {
    if (!customers.length) return [{ id: customerId, name: customerId }];
    if (customers.some((c) => c.id === customerId)) return customers;
    return [{ id: customerId, name: customerId }, ...customers];
  }, [customerId, customers]);

  const handleCustomerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value;
    router.push(`/customers/${nextId}`);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute right-10 top-10 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="hidden w-72 shrink-0 flex-col gap-10 border-r border-white/5 bg-white/5 px-6 py-10 backdrop-blur-xl lg:flex">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500 shadow-lg shadow-black/30" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">AvePoint</p>
              <p className="text-base font-semibold text-white">Mission Control</p>
            </div>
          </div>
          <nav aria-label="Dashboard navigation" className="space-y-2">
            {navItems.map((item) => {
              const href = item.href(customerId);
              const isActive = pathname?.startsWith(href.replace(/#.*/, ''));
              return (
                <Link
                  key={item.label}
                  href={href}
                  className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm transition hover:bg-white/10 hover:text-white ${
                    isActive ? 'bg-gradient-to-r from-white/10 via-white/5 to-white/0 text-white ring-1 ring-white/10 shadow-lg shadow-black/20' : 'text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-sky-400' : 'bg-slate-500/70'} ring-4 ring-white/5`} aria-hidden />
                    {item.label}
                  </span>
                  <span className="text-xs text-slate-400 transition group-hover:text-white">›</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300 shadow-lg shadow-black/20">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Live status</p>
            <p className="mt-1 text-sm font-semibold text-white">Unified oversight</p>
            <p className="mt-2 leading-relaxed text-slate-400">Track customers, services, tenants, risk, and automation from one modern workspace.</p>
          </div>
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-900/60 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="space-y-1">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-sky-200">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden />
                  AvePoint dashboard
                </p>
                <h1 className="text-2xl font-bold text-white">Unified customer overview</h1>
                <p className="text-sm text-slate-400">Monitor services, tenants, backup protection, baselines, scans, and risk in one hyper-modern experience.</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 shadow-lg shadow-black/20">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Customer</p>
                  <select
                    id="customer"
                    className="w-48 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white shadow-inner shadow-black/30 focus:border-sky-400 focus:outline-none"
                    value={customerId}
                    onChange={handleCustomerChange}
                    disabled={loading}
                  >
                    {customerOptions.map((customer) => (
                      <option key={customer.id} value={customer.id} className="bg-slate-900">
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

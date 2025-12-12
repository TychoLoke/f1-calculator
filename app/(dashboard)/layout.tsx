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
    <div className="min-h-screen text-slate-100 bg-transparent flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-8 border-r border-white/5 bg-slate-900/40 backdrop-blur-md px-6 py-10">
        <div className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-300">AvePoint</div>
        <nav aria-label="Dashboard navigation" className="space-y-2">
          {navItems.map((item) => {
            const href = item.href(customerId);
            const isActive = pathname?.startsWith(href.replace(/#.*/, ''));
            return (
              <Link
                key={item.label}
                href={href}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-white/5 hover:text-white ${
                  isActive ? 'bg-white/10 text-white' : 'text-slate-200'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs text-slate-400">›</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-900/40 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-sky-300">AvePoint Dashboard</p>
              <h1 className="text-xl font-semibold text-white">Unified customer overview</h1>
              <p className="text-sm text-slate-400">Monitor services, tenants, backup protection, baselines, scans, and risk.</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400" htmlFor="customer">
                Customer
              </label>
              <select
                id="customer"
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white shadow-inner shadow-black/20 focus:border-sky-400 focus:outline-none"
                value={customerId}
                onChange={handleCustomerChange}
                disabled={loading}
              >
                {customerOptions.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

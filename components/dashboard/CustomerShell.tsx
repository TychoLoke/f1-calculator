'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, ReactNode, useMemo } from 'react';
import type { CustomerSummary } from '../../lib/data-service';

const gradientText = 'bg-gradient-to-r from-[#ff5f6d] via-[#5b8bff] to-[#7c3aed] bg-clip-text text-transparent';

const navItems = [
  { label: 'Overview', path: (id: string) => `/customers/${id}` },
  { label: 'Tenants', path: (id: string) => `/customers/${id}/tenants` },
  { label: 'Backup', path: (id: string) => `/customers/${id}/backup` },
  { label: 'Baselines', path: (id: string) => `/customers/${id}/baselines` },
  { label: 'Jobs', path: (id: string) => `/customers/${id}/jobs` },
];

interface CustomerShellProps {
  customers: CustomerSummary[];
  activeCustomerId: string;
  heading: string;
  description: string;
  lastUpdated?: string;
  children: ReactNode;
}

export function CustomerShell({ customers, activeCustomerId, heading, description, lastUpdated, children }: CustomerShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const customerOptions = useMemo(() => {
    if (customers.some((c) => c.id === activeCustomerId)) return customers;
    return [{ id: activeCustomerId, name: activeCustomerId, ownerEmail: '—', region: 'Unknown', status: 'Unknown' }, ...customers];
  }, [activeCustomerId, customers]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value;
    router.push(`/customers/${nextId}`);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="hidden w-72 shrink-0 border-r border-white/5 bg-white/5 px-6 py-10 backdrop-blur-xl lg:flex lg:flex-col lg:gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#ff5f6d] via-[#5b8bff] to-[#7c3aed] shadow-lg shadow-black/40" />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">AvePoint</p>
              <p className="text-base font-semibold text-white">Elements Mission Control</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Unified MSP-grade telemetry and controls.</p>
        </div>

        <nav className="space-y-1" aria-label="Customer navigation">
          {navItems.map((item) => {
            const href = item.path(activeCustomerId);
            const isActive = pathname === href;
            return (
              <Link
                key={item.label}
                href={href}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                    ? 'bg-gradient-to-r from-white/10 via-white/5 to-transparent text-white ring-1 ring-white/10 shadow-lg shadow-black/20'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 rounded-full ${isActive ? 'bg-[#5b8bff]' : 'bg-slate-500/70'} ring-4 ring-white/5`}
                    aria-hidden
                  />
                  {item.label}
                </span>
                <span className="text-xs text-slate-400">›</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300 shadow-lg shadow-black/20">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Status</p>
          <p className="text-sm font-semibold text-white">Always-on coverage</p>
          <p className="leading-relaxed text-slate-400">Multi-tenant views with risk, protection, and job telemetry.</p>
        </div>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-900/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="space-y-1">
              <p className={`text-xs font-semibold uppercase tracking-[0.32em] text-slate-300 ${gradientText}`}>AvePoint Elements</p>
              <h1 className="text-2xl font-bold text-white">{heading}</h1>
              <p className="text-sm text-slate-400">{description}</p>
              {lastUpdated && <p className="text-[11px] text-slate-500">Last updated {new Date(lastUpdated).toLocaleString()}</p>}
            </div>
            <div className="flex flex-col items-start gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs shadow-lg shadow-black/20 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Customer</p>
                <select
                  className="w-56 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white shadow-inner shadow-black/30 focus:border-[#5b8bff] focus:outline-none"
                  value={activeCustomerId}
                  onChange={handleChange}
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

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const navItems = [
  { label: 'Overview', href: (id: string) => `/customers/${id}` },
  { label: 'Tenants', href: (id: string) => `/customers/${id}#tenants` },
  { label: 'Backup', href: (id: string) => `/customers/${id}#backup` },
  { label: 'Baselines', href: (id: string) => `/customers/${id}#baselines` },
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
  const customerId = getCustomerIdFromParams(params ?? {});

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
              <p className="text-sm text-slate-400">Monitor tenants, backup protection, baselines, and jobs.</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400" htmlFor="customer">
                Customer
              </label>
              <select
                id="customer"
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white shadow-inner shadow-black/20 focus:border-sky-400 focus:outline-none"
                defaultValue={customerId}
                disabled
              >
                <option value="MockMSP">MockMSP</option>
              </select>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

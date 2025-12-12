'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ActivitySquare, Database, Layers, LayoutDashboard, Users } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/customers', icon: LayoutDashboard },
  { label: 'Customers', href: '/customers', icon: Users },
  { label: 'Backup', href: '#', icon: Database },
  { label: 'Jobs', href: '#', icon: ActivitySquare },
  { label: 'Baselines', href: '#', icon: Layers },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 z-30 hidden w-72 shrink-0 border-r border-white/5 bg-[#0c1425]/85 backdrop-blur-2xl lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-6 pb-6 pt-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f1a34] ring-1 ring-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#ff5f6d] via-[#7c3aed] to-[#5b8bff] text-sm font-black text-white shadow-[0_20px_40px_-24px_rgba(91,139,255,0.8)]">
            AP
          </div>
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">AvePoint Elements</p>
          <p className="text-xs text-slate-400">MSP Control Plane</p>
        </div>
      </div>

      <div className="px-6">
        <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-slate-400 shadow-inner shadow-black/30">
          Unified backup, job health, and readiness signals for every customer.
        </div>
      </div>

      <nav className="mt-5 flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href !== '#' && pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 h-9 -translate-y-1/2 w-1 rounded-full bg-gradient-to-b from-[#ff5f6d] via-[#7c3aed] to-[#5b8bff] transition ${
                  isActive ? 'opacity-100 shadow-[0_0_18px_rgba(91,139,255,0.7)]' : 'opacity-0 group-hover:opacity-60'
                }`}
                aria-hidden
              />
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-[#0f172d] text-white shadow-inner transition ${
                  isActive ? 'shadow-[0_20px_40px_-28px_rgba(91,139,255,0.8)] ring-1 ring-white/10' : 'group-hover:border-white/10'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-200'}`} />
              </span>
              <span className="tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 px-6 py-5 text-xs text-slate-500">
        <p className="font-semibold text-slate-300">Status signals</p>
        <p>Live insight into coverage, failures, and customer readiness.</p>
      </div>
    </aside>
  );
}

import '../globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#050814] text-slate-50">
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0a0f1c] p-4 shadow-[0_10px_50px_-35px_rgba(0,0,0,0.9)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">AvePoint Elements</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-lg font-semibold text-white">
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs uppercase tracking-wide text-slate-200">
                MSP Control Plane
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Global dashboard
              </span>
            </div>
            <p className="max-w-2xl text-sm text-slate-300">Unified visibility across customer tenants, backup coverage, and job health.</p>
          </div>
          <nav className="flex items-center gap-3 text-sm text-slate-200">
            <Link
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-gradient-to-r from-[#ff5f6d] via-[#5b8bff] to-[#7c3aed] px-3 py-2 text-white shadow-[0_10px_40px_-30px_rgba(91,139,255,0.6)]"
              href="/customers"
            >
              Dashboard
            </Link>
            <a
              className="rounded-lg border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
              href="https://www.avepoint.com/"
              target="_blank"
              rel="noreferrer"
            >
              AvePoint.com
            </a>
          </nav>
        </header>

        <main className="relative z-10">{children}</main>
      </div>
    </div>
  );
}

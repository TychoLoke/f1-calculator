import '../globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#050915] text-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-[#ff5f6d]/20 via-[#5b8bff]/16 to-[#7c3aed]/14 blur-3xl" />
        <div className="absolute right-8 top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#5b8bff]/12 via-[#7c3aed]/14 to-[#ff5f6d]/16 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#7c3aed]/12 via-[#5b8bff]/10 to-[#ff5f6d]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/5/60 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">AvePoint Elements</p>
            <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="rounded-md bg-gradient-to-r from-[#ff5f6d] via-[#5b8bff] to-[#7c3aed] px-2 py-1 text-xs uppercase tracking-wide text-white shadow-lg shadow-black/30">
                MSP
              </span>
              Control Plane
            </div>
            <p className="max-w-2xl text-sm text-slate-300">Unified visibility across customer tenants, backup coverage, and job health.</p>
          </div>
          <nav className="flex items-center gap-3 text-sm text-slate-200">
            <Link className="rounded-lg border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white" href="/customers">
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

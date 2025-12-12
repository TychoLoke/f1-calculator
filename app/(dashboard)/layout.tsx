import '../globals.css';
import type { ReactNode } from 'react';

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-slateInk text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-[#ff5f6d]/20 via-[#5b8bff]/15 to-[#7c3aed]/20 blur-3xl" />
        <div className="absolute right-8 top-12 h-72 w-72 rounded-full bg-gradient-to-br from-[#5b8bff]/20 via-[#7c3aed]/14 to-[#ff5f6d]/14 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-[#7c3aed]/18 via-[#5b8bff]/14 to-[#ff5f6d]/10 blur-3xl" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
